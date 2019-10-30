require('dotenv').config();

const { PORT } = process.env;
const port = PORT || '8080';

export { port as PORT };