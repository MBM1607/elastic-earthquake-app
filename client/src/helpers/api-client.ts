import { earthquakeDocument } from '../types/earthquake-document';

export const getClient = async (endpoint: string, params: {}): Promise<earthquakeDocument[]> => {
  const headers = {
    'content-type': 'application/json'
  }
  const config = {
    method: 'GET',
    headers: {
      ...headers,
    },
  }
  const urlParams = new URLSearchParams(params);

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/${endpoint}?${urlParams}`,
    config
  );

  if (response.ok) {
    return await response.json()
  } else {
    const errorMessage = await response.text()
    return Promise.reject(new Error(errorMessage))
  }
}
