import { readFileSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';

registerFilters();

const getLayout = givenPath => {
  // the following 'gaTemplate code' is temporary, just to get
  // the example 'health_care_region_page.drupal.liquid'
  // liquid template to render properly
  const gaLayout = 'src/site/includes/google-analytics';
  const layoutPath = givenPath === gaLayout ? `${givenPath}.liquid` : givenPath;

  return readFileSync(
    path.resolve(__dirname, '../../../../', layoutPath),
    'utf8',
  );
};

const parseFixture = file => {
  const jsonPath = path.resolve(__dirname, `../fixtures/${file}.json`);
  const json = readFileSync(jsonPath, 'utf8');
  return JSON.parse(json);
};

const renderHTML = (layout, data) => {
  const context = liquid.newContext({ locals: data });

  context.onInclude((includeName, callback) => {
    const includeLayout = getLayout(includeName);
    callback(null, liquid.parse(includeLayout));
  });

  const render = liquid.compile(layout);

  return new Promise((resolve, reject) =>
    render(context, err => {
      if (err) {
        reject(err);
      } else {
        const html = context.getBuffer();
        const dom = new JSDOM(html, { runScripts: 'dangerously' });
        resolve(dom.window.document.body);
      }
    }),
  );
};

export { getLayout, parseFixture, renderHTML };
