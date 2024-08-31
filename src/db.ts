import mongoose from 'mongoose';
import 'dotenv/config';

export const inititalizeDB = () => {
	return new Promise((resolve, reject) =>
		(async () => {
			try {
				const db = await mongoose.connect(
					process.env.ME_CONFIG_MONGODB_URL ?? ''
				);
				console.log('Connected to DB');
				resolve(db);
			} catch (error) {
				console.error('cannot connect to db: ', error);
				reject(error);
			}
		})()
	);
};
