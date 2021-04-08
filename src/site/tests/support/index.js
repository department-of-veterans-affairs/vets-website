import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';
import createRedirects from '../../stages/build/plugins/rewrite-va-domains.js';
import rewriteAWSUrls from '../../stages/build/plugins/rewrite-cms-aws-urls.js';
import modifyDom from '../../stages/build/plugins/modify-dom';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';

const BUILDTYPE = ENVIRONMENT_CONFIGURATIONS[__BUILDTYPE__].BUILDTYPE;

registerFilters();

const getFile = filePath =>
  readFileSync(path.resolve(__dirname, `../../../../`, filePath), 'utf8');

const getLayout = filePath => getFile(filePath);

const parseFixture = filePath => {
  let data;

  try {
    data = JSON.parse(getFile(filePath));
  } catch (error) {
    /* eslint-disable no-console */
    console.log(`Error parsing JSON fixture in:\n`, error);
    /* eslint-enable no-console */
  }

  return data;
};

const makeHTMLFileName = (layoutPath, dataName) => {
  const fileName = path.basename(layoutPath).split('.')[0];
  return dataName ? `${fileName}.${dataName}.html` : `${fileName}.html`;
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

const getOptions = () => {
  const options = {
    buildtype: BUILDTYPE,
    entry: true,
    liquidUnitTestingFramework: true,
    accessibility: true,
    host: 'dev.va.gov', // set to dev URL to align with Node environment
    port: null,
    protocol: 'https',
  };

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  options.domainReplacements = [
    { from: 'https://www\\.va\\.gov', to: options.hostUrl },
  ];

  return options;
};

const updateHTML = (files, options) => {
  // the following chained function calls expect a 'done' callback.
  // we don't need 'done' to do anything so it's an empty function.
  const done = () => {};

  createRedirects(options)(files, null, done);
  rewriteAWSUrls(options)(files, null, done);
  modifyDom(options)(files, null, done);
};

const renderHTML = (layoutPath, data, dataName) => {
  const options = getOptions();
  const siteWideMetadata = {
    hostUrl: options.hostUrl,
    buildtype: options.buildtype,
  };

  const layout = getLayout(layoutPath);
  const context = liquid.newContext({
    locals: { ...data, ...siteWideMetadata },
  });

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
        const htmlFileName = makeHTMLFileName(layoutPath, dataName);
        const files = {
          [htmlFileName]: { contents: html, isDrupalPage: true },
          'generated/file-manifest.json': { contents: JSON.stringify({}) },
        };

        updateHTML(files, options);

        if (BUILDTYPE === 'vagovdev') {
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

export { renderHTML, parseFixture };
