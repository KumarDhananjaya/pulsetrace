import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'pulsetrace-api' });
});

app.post('/api/collect', (req, res) => {
    console.log('[API] Received Event:', req.body);
    res.status(202).json({ status: 'received' });
});

app.listen(port, () => {
    console.log(`PulseTrace API listening at http://localhost:${port}`);
});
