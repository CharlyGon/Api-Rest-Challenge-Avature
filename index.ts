import app from './src/app';
import { startServer } from './src/server/serverConfig';

require('dotenv').config();

startServer(app);
