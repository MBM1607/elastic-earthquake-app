import express from 'express';
import 'log-timestamp';
import client from '../elasticsearch/client.js';

const router = express.Router();

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;

router.get('/earthquakes', async (req, res) => {
  console.info('Loading Application...');
  res.json('Running Application...');

  const indexData = async () => {
    try {
      console.info('Retrieving data from USGS API');

      const res = await fetch(`${URL}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const EARTHQUAKES = await res.json();

      console.info('Data retrieved!');

      const results = EARTHQUAKES.features.map(results => ({
        place: results.properties.place,
        time: results.properties.time,
        tz: results.properties.tz,
        url: results.properties.url,
        detail: results.properties.detail,
        felt: results.properties.felt,
        cdi: results.properties.cdi,
        alert: results.properties.alert,
        status: results.properties.status,
        tsunami: results.properties.tsunami,
        sig: results.properties.sig,
        net: results.properties.net,
        code: results.properties.code,
        sources: results.properties.sources,
        nst: results.properties.nst,
        dmin: results.properties.dmin,
        rms: results.properties.rms,
        mag: results.properties.mag,
        magType: results.properties.magType,
        type: results.properties.type,
        longitude: results.geometry.coordinates[0],
        latitude: results.geometry.coordinates[1],
        depth: results.geometry.coordinates[2],
      }));

      console.info('Indexing data...');

      results.map(
        async (earthquakeObject) => {
          earthquakeObject,
            await client.index({
              index: 'earthquakes',
              id: results.id,
              body: earthquakeObject,
              pipeline: 'earthquake_data_pipeline',
            })
        }
      );

      console.info('Data has been indexed successfully!');
    }
    catch (error) {
      console.error(error);
    }
  };
  indexData();
});

export default router;
