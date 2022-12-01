import 'log-timestamp';
import cors from 'cors';
import express from 'express';
import client from './elasticsearch/client.js';
import data from './data/retrieve_and_ingest.js';

const app = express();

app.use('/ingest-data', data);

app.use(cors());

app.get('/results', async (req, res) => {
  console.info('Searching on earthquakes index')
  const passedType = req.query.type || 'earthquake';
  const passedMag = req.query.mag || '2.5';
  const passedLocation = req.query.location || '';
  const passedDateRange = req.query.dateRange || '30';
  const passedSortOption = req.query.sortOption || 'desc';

  const body = await client.search({
    index: 'earthquakes',
    body: {
      sort: [
        {
          mag: {
            order: passedSortOption,
          },
        },
      ],
      size: 300,
      query: {
        bool: {
          filter: [
            {
              term: { type: passedType },
            },
            {
              range: {
                mag: {
                  gte: passedMag,
                },
              },
            },
            {
              match: { place: passedLocation },
            },
            {
              range: {
                '@timestamp': {
                  gte: `now-${passedDateRange}d/d`,
                  lt: 'now/d',
                },
              },
            },
          ],
        },
      },
    },
  });
  return res.json(body.hits.hits);
});

const port = process.env.PORT || 5000;

app.listen(
  port,
  () => console.info(`Server listening at http://localhost:${port}`)
);
