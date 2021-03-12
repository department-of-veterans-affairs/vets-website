import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
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

const makeHTMLFileName = name => {
  const liquidFileName = name.match(/(\w|\d|\.)+$/g)[0];
  return `${liquidFileName.split('.')[0]}.html`;
};

const createDirectory = async () => {
  const directoryPath = path.resolve(__dirname, '../', 'html');
  await mkdir(directoryPath);
};

const saveFile = async (name, html) => {
  const filePath = path.resolve(__dirname, '../html/', name);
  await writeFile(filePath, html);
};

const saveHTML = (name, html) => {
  createDirectory();
  saveFile(name, html);
};

const updateHTML = files => {
  const options = {
    buildtype: process.env.BUILDTYPE || 'vagovdev',
    host: 'liquidUnitTestingFramework',
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
  // we don't need 'done' to do anything so it's an empty function.
  const done = () => {};

  createRedirects(options)(files, null, done);
  rewriteAWSUrls(options)(files, null, done);
  modifyDom(options)(files, null, done);
};

const renderHTML = (name, layout, data, options) => {
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

        if (options && options.save) {
          saveHTML(htmlFileName, files[htmlFileName].contents);
        }

        const dom = new JSDOM(files[htmlFileName].contents, {
          runScripts: 'dangerously',
        });

        resolve(dom.window.document);
      }
    }),
  );
};

export { getLayout, parseFixture, renderHTML };
