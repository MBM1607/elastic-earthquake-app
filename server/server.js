import express from 'express';
import client from './elasticsearch/client.js';
import data from './data/retrieve_and_ingest.js';

const app = express();

const port = 5000;

app.use('/ingest-data', data);

app.listen(
  port,
  () => console.log(`Server listening at http://localhost:${port}`)
);
