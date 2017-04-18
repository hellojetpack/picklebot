const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('botkit:webserver');
const fs = require('fs');
const path = require('path');

module.exports = (controller) => {
  const webserver = express();
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));

  // import express middlewares that are present in /components/express_middleware
  const normalizedPath = path.join(__dirname, 'express_middleware');
  fs.readdirSync(normalizedPath).forEach((file) => {
    /* eslint-disable global-require */
    require(`./express_middleware/${file}`)(webserver, controller);
    /* eslint-enable global-require */
  });

  webserver.use(express.static('public'));

  webserver.listen(process.env.PORT || 3000, null, () => {
    debug(`Express webserver configured and listening at http://localhost:${process.env.PORT}` || 3000);
  });

  // import all the pre-defined routes that are present in /components/routes
  const normalizedPathR = path.join(__dirname, 'routes');
  fs.readdirSync(normalizedPathR).forEach((file) => {
    /* eslint-disable global-require */
    require(`./routes/${file}`)(webserver, controller);
    /* eslint-enable global-require */
  });

  controller.webserver = webserver;

  return webserver;
};
