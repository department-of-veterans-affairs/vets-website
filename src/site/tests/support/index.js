import { readFileSync } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';
import createRedirects from '../../stages/build/plugins/rewrite-va-domains.js';
import rewriteAWSUrls from '../../stages/build/plugins/rewrite-cms-aws-urls.js';
import modifyDom from '../../stages/build/plugins/modify-dom';

registerFilters();

const getFile = filePath =>
  readFileSync(path.resolve(__dirname, `../../../../`, filePath), 'utf8');
const getLayout = filePath => getFile(filePath);
const parseFixture = filePath => JSON.parse(getFile(filePath));

const updateHTML = files => {
  const options = {
    buildtype: process.env.BUILDTYPE, // what should i set this to?
    // what should the following values be?
    host: 'defaultHost',
    port: 3001,
    protocol: 'http',
    entry: true,
  };

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  options.domainReplacements = [
    { from: 'https://www\\.va\\.gov', to: options.hostUrl },
  ];

  // the following chained function calls expect a 'done' callback.
  // we don't need 'done' to do anything so we're passing in an empty function.
  const done = () => {};

  createRedirects(options)(files, null, done);
  rewriteAWSUrls(options)(files, null, done);
  modifyDom(options)(files, null, done);
};

const makeHTMLFileName = name => {
  const liquidFileName = name.match(/(\w|\d|\.)+$/g)[0];
  return `${liquidFileName.split('.')[0]}.html`;
};

const renderHTML = (name, layout, data) => {
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
        const htmlFileName = makeHTMLFileName(name);
        const files = {
          [htmlFileName]: { contents: html, isDrupalPage: true },
          'generated/file-manifest.json': { contents: JSON.stringify({}) },
        };
        updateHTML(files);
        const dom = new JSDOM(files[htmlFileName].contents, {
          runScripts: 'dangerously',
        });
        resolve(dom.window.document.body);
      }
    }),
  );
};

export { getLayout, parseFixture, renderHTML };
