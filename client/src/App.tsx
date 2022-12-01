import { FormEvent, useState } from 'react';
import { getClient } from './helpers/api-client';
import { earthquakeDocument } from './types/earthquake-document';
import './App.css';

const App = () => {
  const [chosenType, setChosenType] = useState('');
  const [chosenMag, setChosenMag] = useState('');
  const [chosenLocation, setChosenLocation] = useState('');
  const [chosenDateRange, setChosenDateRange] = useState('');
  const [chosenSortOption, setchosenSortOption] = useState('');
  const [documents, setDocuments] = useState<earthquakeDocument[]>([]);

  const sendSearchRequest = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await getClient('results', {
        type: chosenType,
        mag: chosenMag,
        location: chosenLocation,
        dateRange: chosenDateRange,
        sortOption: chosenSortOption,
      });
      setDocuments(data);
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='app'>
      <nav>
        <ul className='nav-bar'>
          <li>Earthquake Watch</li>
        </ul>
      </nav>
      <p className='directions'>
        {' '}
        Search for earthquakes using the following criteria:
      </p>
      <div className='main'>
        <div className='type-selector'>
          <ul>
            <li>
              <select
                name='types'
                id='types'
                value={chosenType}
                onChange={(e) => setChosenType(e.target.value)}
                required={true}
              >
                <option>Select a Type</option>
                <option value='earthquake'>Earthquake</option>
                <option value='quarry blast'>Quarry Blast</option>
                <option value='ice quake'>Ice Quake</option>
                <option value='explosion'>Explosion</option>
              </select>
            </li>
            <li>
              <select
                name='mag'
                id='mag'
                value={chosenMag}
                onChange={(e) => setChosenMag(e.target.value)}
                required={true}
              >
                <option>Select magnitude level</option>
                <option value='2.5'>2.5+</option>
                <option value='5.5'>5.5+</option>
                <option value='6.1'>6.1+</option>
                <option value='7'>7+</option>
                <option value='8'>8+</option>
              </select>
            </li>
            <li>
              <form onSubmit={sendSearchRequest}>
                <label>
                  <input
                    className='form'
                    type='text'
                    placeholder='Enter city, state, country'
                    value={chosenLocation}
                    onChange={(e) => setChosenLocation(e.target.value)}
                    required={false}
                  />
                </label>
              </form>
            </li>
            <li>
              <select
                name='dateRange'
                id='dateRange'
                value={chosenDateRange}
                onChange={(e) => setChosenDateRange(e.target.value)}
                required={true}
              >
                <option>Select date range</option>
                <option value='7'>Past 7 Days</option>
                <option value='14'>Past 14 Days</option>
                <option value='21'>Past 21 Days</option>
                <option value='30'>Past 30 Days</option>
              </select>
            </li>
            <li>
              <select
                name='sortOption'
                id='sortOption'
                value={chosenSortOption}
                onChange={(e) => setchosenSortOption(e.target.value)}
                required={true}
              >
                <option>Sort by</option>
                <option value='desc'>Largest Magnitude First</option>
                <option value='asc'>Smallest Magnitude First</option>
              </select>
            </li>
            <li>
              <button>Search</button>
            </li>
          </ul>
        </div>
        {documents && (
          <div className='search-results'>
            {documents.length > 0 ? (
              <p> Number of hits: {documents.length}</p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
            {documents.map((document) => (
              <div
                key={`${document._source._id}-card`}
                className='results-card'
              >
                <div
                  key={`${document._source._id}-text`}
                  className='results-text'
                >
                  <p>Type: {document._source.type}</p>
                  <p>Time: {document._source['@timestamp']}</p>
                  <p>Location: {document._source.place}</p>
                  <p>Latitude: {document._source.coordinates.lat}</p>
                  <p>Longitude: {document._source.coordinates.lon}</p>
                  <p>Magnitude: {document._source.mag}</p>
                  <p>Depth: {document._source.depth}</p>
                  <p>Significance: {document._source.sig}</p>
                  <p>Event URL: {document._source.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
