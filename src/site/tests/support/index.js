import { readFileSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';

registerFilters();

const getLayout = layoutPath => {
  return readFileSync(
    path.resolve(__dirname, '../../../../', layoutPath),
    'utf8',
  ).toString();
};

const makeOptions = layoutPaths => {
  const files = {};

  layoutPaths.forEach(layoutPath => {
    files[layoutPath] = getLayout(layoutPath);
  });

  return { files: { ...files } };
};

const parseFixture = file => {
  const jsonPath = path.resolve(__dirname, `../fixtures/${file}.json`);
  const json = readFileSync(jsonPath, 'utf8');
  return JSON.parse(json);
};

const renderHTML = (layout, data, options) => {
  const context = liquid.newContext({ locals: data });
  const render = liquid.compile(layout, options);

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

export { getLayout, makeOptions, parseFixture, renderHTML };
