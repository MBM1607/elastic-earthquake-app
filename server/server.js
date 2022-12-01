import express from 'express';
import client from './elasticsearch/client.js';

const app = express();

const port = 5000;

app.listen(
  port,
  () => console.log(`Server listening at http://localhost:${port}`)
);
