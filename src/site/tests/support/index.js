import { readFileSync } from 'fs';
import path from 'path';
import tinyliquid from 'tinyliquid';
import { JSDOM } from 'jsdom';

const parseFixture = file => {
  const jsonPath = path.resolve(__dirname, `../fixtures/${file}.json`);
  const json = readFileSync(jsonPath, 'utf8');
  return JSON.parse(json);
};

const renderHTML = data => {
  const layoutPath = path.resolve(
    __dirname,
    '../temp_layouts/landing_page.drupal.liquid',
  );
  const layout = readFileSync(layoutPath, 'utf8').toString();
  const context = tinyliquid.newContext({ locals: data });
  const render = tinyliquid.compile(layout);

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
