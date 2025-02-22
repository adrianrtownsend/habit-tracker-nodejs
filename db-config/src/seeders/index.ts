import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';

const socket = io(process.env.FEATHERS_API_URL);
const app = feathers();

// Setup the transport (Rest, Socket, etc.) here
app.configure(socketio(socket));

// Available options are listed in the "Options" section
app.configure(authentication());

const userService = app.service('users');
const taskService = app.service('task');
const instanceService = app.service('instance');

const FakeUser = () => {
	return {
		email: faker.internet.email(),
		password: faker.internet.password(),
		googleId: faker.string.uuid(),
		avatar: faker.image.avatar(),
	};
};

const FakeTask = () => {
	const startDate = faker.date.soon();
	const endDate = faker.date.soon({ refDate: startDate });
	const startHour = faker.number.int({ min: 0, max: 23 });
	const startMinute = faker.number.int({ min: 0, max: 59 });
	const endHour = faker.number.int({ min: 0, max: 23 });
	const endMinute = faker.number.int({ min: 0, max: 59 });
	const days = [...Array(7).keys()];
	const duration = faker.number.int({ min: 1, max: 120 });
	const minWeeklyInstances = faker.number.int({ min: 1, max: 6 });
	const maxWeeklyInstances = faker.number.int({
		min: minWeeklyInstances,
		max: 7,
	});

	return {
		text: faker.lorem.word(),
		description: faker.lorem.sentence({ min: 1, max: 50 }),
		startDate,
		endDate,
		startHour,
		startMinute,
		endHour,
		endMinute,
		days,
		duration,
		minWeeklyInstances,
		maxWeeklyInstances,
	};
};

// create a user
const createUser = async () => {
	const userFake = FakeUser();
	try {
		const user = await userService.create(userFake);
		await app.authenticate({
			strategy: 'local',
			email: userFake.email,
			password: userFake.password,
		});
		return user;
	} catch (error) {
		console.log('error creating new user: ', error);
	}
};

const loginOrRegisterSeederUser = () =>
	app
		.authenticate({
			strategy: 'local',
			email: process.env.FEATHERS_API_EMAIL,
			password: process.env.FEATHERS_API_PASSWORD,
		})
		.then((res) => {
			return res;
		})
		.catch(async () =>
			userService
				.create({
					email: process.env.FEATHERS_API_EMAIL,
					password: process.env.FEATHERS_API_PASSWORD,
				})
				.then((res) => {
					return app.authenticate({
						strategy: 'local',
						email: process.env.FEATHERS_API_EMAIL,
						password: process.env.FEATHERS_API_PASSWORD,
					});
				})
		);

// delete all data from db
const deleteAllData = async (userId: string = '') => {
	try {
		await taskService.remove(null);
	} catch (error) {
		console.log('error deleting tasks: ', error);
	}
	try {
		await instanceService.remove(null);
	} catch (error) {
		console.log('error deleting instances: ', error);
	}
	try {
		await userService.remove(null, {
			query: {
				_id: {
					$ne: userId,
				},
			},
		});
	} catch (error) {
		console.log('error deleting users: ', error);
	}
};

const testGenerate = () =>
	Promise.all(
		Array.from(Array(5).keys())
			.map(() => FakeUser())
			.map(async (user, index) => {
				const tasks = Array.from(
					Array(faker.number.int({ min: 1, max: 4 })).keys()
				).map(() => FakeTask());

				// register user
				const dbUser = await userService.create(user);

				// login
				await app.authenticate({
					strategy: 'local',
					email: user.email,
					password: user.password,
				});

				// create tasks
				const dbTasks = await taskService.create(tasks);

				// logout
				app.logout();

				return { dbUser, dbTasks };
			})
	);

(async () => {
	const user = await loginOrRegisterSeederUser();
	await app.reAuthenticate();
	await deleteAllData(user._id);
	app.logout();
	await testGenerate();
})();
