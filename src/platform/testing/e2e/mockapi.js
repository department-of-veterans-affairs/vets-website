// Simple mock api server. Allows scripting of a JSON API endpoint for end-to-end tests.
//
// Set the behavior by posting to /mock with a JSON body of
//    verb: The http verb to mock (defaults to 'get')
//    path: /my/api/path
//   value: { "some": "json", "blob": "yay." }

const fs = require('fs');
const nodePath = require('path');
const bodyParser = require('body-parser');
const commandLineArgs = require('command-line-args');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const winston = require('winston');
const apiMocker = require('mocker-api');

const optionDefinitions = [
  { name: 'buildtype', type: String, defaultValue: 'vagovdev' },
  { name: 'port', type: Number, defaultValue: +(process.env.API_PORT || 3000) },
  { name: 'host', type: String, defaultValue: 'localhost' },
  { name: 'responses', type: String, defaultOption: true },
];
const options = commandLineArgs(optionDefinitions);

function stripTrailingSlash(path) {
  return path.substr(-1) === '/' ? path.slice(0, -1) : path;
}

const corsOptions = {
  origin: true,
  credentials: true,
};

function makeMockApiRouter(opts) {
  // mockResponses[token][verb][response]
  const mockResponses = {};

  const router = express.Router(); // eslint-disable-line new-cap
  router.post('/mock', (req, res) => {
    const token = req.body.token || '_global';
    const verb = (req.body.verb || 'get').toLowerCase();
    const path = stripTrailingSlash(req.body.path);

    opts.logger.verbose(`mock: ${token} ${verb} ${path}`);

    mockResponses[token] = mockResponses[token] || {};
    mockResponses[token][verb] = mockResponses[token][verb] || {};
    if (req.body.query) {
      mockResponses[token][verb][path] = mockResponses[token][verb][path] || {
        query: true,
      };
      mockResponses[token][verb][path][req.body.query] = {
        status: req.body.status,
        value: req.body.value,
      };
    } else {
      mockResponses[token][verb][path] = {
        status: req.body.status,
        value: req.body.value,
      };
    }
    const result = {
      result: `set token: ${token} ${verb} ${path} to ${JSON.stringify(
        req.body.value,
      )}`,
    };

    res.status(200).json(result);
  });

  router.all('*', (req, res) => {
    const token = req.cookies.token || '_global';
    const verb = req.method.toLowerCase();
    const verbResponses = (mockResponses[token] || {})[verb];
    const path = stripTrailingSlash(req.path);

    let result = null;
    if (verbResponses) {
      result = verbResponses[path];
    }

    if (!result) {
      res.status(500);
      result = {
        error: `mock not initialized for token: ${token} ${verb} ${path}`,
      };
    }

    if (result.query) {
      const queryStrings = Object.keys(result).filter(qs => qs !== 'query');
      const currentQuery = req.originalUrl.split('?')[1];
      const match = queryStrings.find(qs => RegExp(qs).test(currentQuery));
      if (match) {
        result = result[match];
        res.append(
          'X-CSRF-Token',
          'bU8YgEOBwIvjJvQ9oT0ix/uz2P5JT23DINkOMNREEvxLu/+RY4FC7qAUdpuVjVzokyB5GA402elnaZm/nkx6Gw==',
        );
      } else {
        res.status(500);
        result = {
          error: `no mock with matching query string: ${token} ${verb} ${path}`,
        };
      }
    }

    if (result.status) {
      res.status(result.status);
    }

    opts.logger.debug(
      `(${token}) ${verb} ${path} : ${JSON.stringify(
        result.error || result.value,
      )}`,
    );
    res.json(result.value);
  });

  return router;
}

options.logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

if (options.responses) {
  const pathToResponses = nodePath.resolve(options.responses);
  if (fs.existsSync(pathToResponses)) {
    apiMocker(app, pathToResponses);
  } else {
    // eslint-disable-next-line no-console
    console.error(
      `Could not find responses at ${pathToResponses}; No such file or directory.`,
    );
    process.exit(1);
  }
}

app.use(makeMockApiRouter(options));

app.listen(options.port, options.host, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock API server listening on port ${options.port}`);
});
