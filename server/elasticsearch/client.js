import { Client } from '@elastic/elasticsearch';
import config from 'config';

const elasticConfig = config.get('elastic');

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID,
  },
  auth: {
    apiKey: elasticConfig.apiKey
  }
});

client.ping()
  .then(response => {
    console.log('You are connected to Elasticsearch!');
  })
  .catch(error => {
    console.error(error);
    console.error('Elasticsearch is not connected!');
  });

export default client;
