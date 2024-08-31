import { IUser, User } from '../models/user';

export const getUsers = (user: IUser) => {
	return User.find(user);
};
