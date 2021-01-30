const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const { validationRule } = require('./controller');

dotenv.config();

// Set up the express app
const app = express();
const { json, urlencoded } = express;
const router = express.Router();

const port = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production' ? process.env.PORT : 5000;

app.use(helmet())
  .disable('x-powered-by')
  .use(cors());

  // Parse incoming requests data
  app.use(json());
  app.use(urlencoded({ extended: false }));

  app.get('/', (req, res) => res.status(200).send({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: process.env.NAME,
      github: process.env.GITHUB,
      email: process.env.EMAIL,
      mobile: process.env.MOBILE,
      twitter: process.env.TWITTER
    }
  }));

  app.post('/validate-rule', validationRule);

  app.listen(port, () => {
    console.log(`Server running on port ${port} 🔥`);
  });