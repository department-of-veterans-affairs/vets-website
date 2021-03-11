// fix fs imports later! this is sloppy and
// and saveHTML() isn't tested yet!
import fs, { readFileSync, writeFile } from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import liquid from 'tinyliquid';
import registerFilters from '../../filters/liquid.js';
import createRedirects from '../../stages/build/plugins/rewrite-va-domains.js';
import rewriteAWSUrls from '../../stages/build/plugins/rewrite-cms-aws-urls.js';
import modifyDom from '../../stages/build/plugins/modify-dom';

registerFilters();

const updateHTML = files => {
  const options = {
    buildtype: process.env.BUILDTYPE, // what should i set this to?
    // what should the following values be?
    host: 'defaultHost',
    port: 3001,
    protocol: 'http',
  };

  options.hostUrl = `${options.protocol}://${options.host}${
    options.port && options.port !== 80 ? `:${options.port}` : ''
  }`;

  options.domainReplacements = [
    { from: 'https://www\\.va\\.gov', to: options.hostUrl },
  ];

  const done = () => {
    // to-do: recreate the done function
  };

  createRedirects(options)(files, null, done);
  rewriteAWSUrls(options)(files, null, done);
  modifyDom(options)(files, null, done);
};

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

const makeHTMLFileName = name => {
  const liquidFileName = name.match(/(\w|\d|\.)+$/g)[0];
  return `${liquidFileName.split('.')[0]}.html`;
};

// not tested yet!
// haven't coded in node for a long time
// and my async/await is rust :-)
const saveHTML = async (name, html) => {
  // saved html files are gitignored
  const directoryPath = path.resolve(__dirname, '../', 'html');
  const filePath = path.resolve(__dirname, '../html/', makeHTMLFileName(name));

  try {
    await fs.promises.mkdir(directoryPath);
    await writeFile(filePath, html);
    /* eslint-disable no-console */
    console.log(`HTML File Saved.\nFile: ${filePath}\n----`);
    /* eslint-enable no-console */
  } catch (err) {
    /* eslint-disable no-console */
    console.log(`Error: HTML File Not Saved.\nFile: ${filePath}\n----`);
    /* eslint-enable no-console */
  }
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
        const files = {
          [name]: { contents: html, isDrupalPage: true },
        };
        updateHTML(files);
        if (options.save) saveHTML(name, html);
        const dom = new JSDOM(files[name].content, {
          runScripts: 'dangerously',
        });
        resolve(dom.window.document.body);
      }
    }),
  );
};

export { getLayout, parseFixture, renderHTML };
