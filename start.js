const app = require('./app');
require('dotenv').config();
const port = process.env.PORT || '3000';

const server = app.listen(port, () => {
	console.log("Listening to port " + port)
});
