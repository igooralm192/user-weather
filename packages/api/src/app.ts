import express from 'express';
import cors from 'cors';
import userRouter from './user.router';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/users', userRouter);

export default app;


