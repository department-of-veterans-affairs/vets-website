import environment from 'platform/utilities/environment';

export const mapboxParam = environment.isProduction()
  ? 'REACT_APP_VALocatorProd'
  : 'REACT_APP_VALocatorDev';

const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-gov-west-1',
});

const parameterStore = new AWS.SSM();

const tokenFail = err => {
  // eslint-disable-next-line no-console
  console.log(
    `FAIL: ${err} ...(${mapboxParam}) Using fallback: ${process.env
      .MAPBOX_FALLBACK || 'Tried Utilizing fallback but Fallback not found'}`,
  );
  return process.env.MAPBOX_FALLBACK;
};

const tokenSuccess = data => {
  data.then(params => {
    // eslint-disable-next-line no-console
    console.log('AWS TOKEN SUCCESS!!', params);
    if (params.length < 1 || params[0]?.Value) {
      return tokenFail('Param doesnt exist!!');
    }
    // eslint-disable-next-line no-console
    console.log(`${mapboxParam}:${params[0].Value}`); // for testing
    return params[0].Value;
  });
};

const getParam = param => {
  return new Promise((res, rej) => {
    parameterStore.getParameter({ Name: param }, (err, data) => {
      if (err) {
        return rej(err.message || err);
      }
      return res(data);
    });
  });
};

export const mapboxTokenPlatform = await getParam(mapboxParam)
  .then(data => tokenSuccess(data))
  .catch(err => tokenFail(err));
