export interface earthquakeDocument {
  _source: {
    _id: string,
    '@timestamp': string,
    place: string,
    coordinates: {
      lat: number,
      lon: number
    },
    type: string,
    mag: number,
    sig: number,
    depth: number,
    url: string
  },
}
