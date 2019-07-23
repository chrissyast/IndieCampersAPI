In order to test the API, you will need to download the repository files. Assuming you already have Node.js installed, navigate the command line to the root directory of the project and run `npm install` to download the node depenecies, and then run `npm start init`.

This will then create a server instance on http://localhost:3000/

To make an API query, you will need to use the following syntax:

`http://localhost:3000/places/<startLat>&<startLong>&<endLat>&<endLong>&<detour(kms)>`

Example:

`http://localhost:3000/places/38.8564585&-9.0649598&37.0800768&-8.0034537&50`

Will find places within a 50km detour from any point along the route between Indie Campers' Lisbon and Faro depots.

### Limitations

Google's "nearby places" API only allows a maximum search radius of 50km, and returns a maxiumum of 20 locations per search.
