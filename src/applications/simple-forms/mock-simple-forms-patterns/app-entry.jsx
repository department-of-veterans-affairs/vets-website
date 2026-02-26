import 'platform/polyfills';
import './sass/mock-simple-forms-patterns.scss';
import startApp from 'platform/startup';
import {
  TELEPHONE_VALIDATION_ENDPOINT,
  validationCodes,
} from 'platform/forms-system/src/js/web-component-fields/vaTelephoneInputValidationCodes';
import { rest, setupWorker } from 'msw';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

export const handlers = [
  rest.post(TELEPHONE_VALIDATION_ENDPOINT, async (req, res, ctx) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const keys = Object.keys(validationCodes);
    const randKey = keys.at(Math.floor(Math.random() * (keys.length - 1)));
    return res(
      ctx.status(400),
      ctx.json({
        messages: [
          {
            code: randKey,
            text: validationCodes[randKey],
          },
        ],
      }),
    );
  }),
];

const worker = setupWorker(...handlers);
worker.start();

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});
