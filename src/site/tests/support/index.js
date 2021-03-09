import { readFileSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';

registerFilters();

const parseFixture = file => {
  const jsonPath = path.resolve(__dirname, `../fixtures/${file}.json`);
  const json = readFileSync(jsonPath, 'utf8');
  return JSON.parse(json);
};

const renderHTML = (layout, data) => {
  const context = liquid.newContext({ locals: data });
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

export { parseFixture, renderHTML };
