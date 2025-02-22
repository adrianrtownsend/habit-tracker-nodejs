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

export default app;
