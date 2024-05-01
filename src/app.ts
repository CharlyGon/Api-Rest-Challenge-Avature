import express from 'express';
import routes from './router/index';

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1', routes);

export default app;
