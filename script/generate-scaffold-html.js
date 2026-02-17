/**
 * Pre-generates scaffold HTML files for dev mode, decoupled from the bundler.
 * Runs in parallel using worker_threads for fast generation of ~179 HTML files.
 *
 * Usage:
 *   node script/generate-scaffold-html.js [--buildPath build/localhost] [--entry app1,app2]
 */
const fs = require('fs');
const path = require('path');
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('worker_threads');
const os = require('os');

if (!isMainThread) {
  // ---- Worker thread: render a batch of HTML files ----
  const {
    batch,
    templateStr,
    arpTemplateStr,
    headerFooterData,
    facilitySidebar,
    scaffoldAssets,
    buildPath,
  } = workerData;

  const ejs = require('ejs');

  // Compile templates once per worker
  // Use identity escape function since template content is trusted server-side data
  // and modifyScriptAndStyleTags returns raw HTML tags
  const ejsOpts = { escape: v => v };
  const defaultTemplate = ejs.compile(templateStr, ejsOpts);
  const arpTemplate = arpTemplateStr
    ? ejs.compile(arpTemplateStr, ejsOpts)
    : null;

  // eslint-disable-next-line no-inner-declarations
  function generateScriptAndStyleTags(chunks) {
    const styleTags = [];
    const scriptTags = [];

    for (const chunk of chunks) {
      if (!chunk) continue; // eslint-disable-line no-continue

      // CSS link for chunks that produce CSS output
      if (
        chunk === 'style' ||
        chunk === 'web-components' ||
        (!['polyfills', 'vendor', 'shared-modules'].includes(chunk) &&
          chunk !== 'polyfills')
      ) {
        styleTags.push(
          `<link href="/generated/${chunk}.css" rel="stylesheet">`,
        );
      }

      // Script tag
      if (chunk === 'polyfills') {
        // Polyfills first with nomodule
        scriptTags.unshift(
          `<script defer nomodule src="/generated/${chunk}.entry.js"></script>`,
        );
      } else if (chunk !== 'style') {
        scriptTags.push(
          `<script defer src="/generated/${chunk}.entry.js"></script>`,
        );
      }
    }

    return [...styleTags, ...scriptTags].join('\n    ');
  }

  for (const item of batch) {
    const {
      appName,
      entryName = 'static-pages',
      rootUrl,
      template = {},
      widgetType,
      widgetTemplate,
      useLocalStylesAndComponents,
    } = item;

    const chunks = [
      'polyfills',
      useLocalStylesAndComponents ? null : 'web-components',
      'vendor',
      'style',
      entryName,
    ];

    let title = 'VA.gov Home | Veterans Affairs';
    if (typeof template !== 'undefined' && template.title) {
      title = `${template.title} | Veterans Affairs`;
    } else if (typeof appName !== 'undefined' && appName) {
      title = `${appName} | Veterans Affairs`;
    } else if (typeof appName !== 'undefined') {
      title = '';
    }

    const isArp = template.layout === 'accredited-representative-portal.html';
    const renderFn = isArp && arpTemplate ? arpTemplate : defaultTemplate;

    const loadInlineScript = filename => scaffoldAssets[filename] || '';

    // Build a fake htmlWebpackPlugin-compatible object for the template
    const tags = generateScriptAndStyleTags(chunks);
    const modifyScriptAndStyleTags = () => tags;

    const templateData = {
      htmlWebpackPlugin: {
        options: { title },
        tags: { headTags: [] },
      },
      headerFooterData,
      facilitySidebar,
      loadInlineScript,
      modifyScriptAndStyleTags,
      breadcrumbs_override: [], // eslint-disable-line camelcase
      includeBreadcrumbs: false,
      loadingMessage: 'Please wait while we load the application for you.',
      entryName,
      widgetType,
      widgetTemplate,
      rootUrl,
      ...template,
    };

    try {
      const html = renderFn(templateData);
      const outputDir = path.join(buildPath, rootUrl);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, 'index.html'), html);
    } catch (err) {
      // Report error but don't crash the worker
      // eslint-disable-next-line no-console
      console.error(`Error generating HTML for ${rootUrl}: ${err.message}`);
    }
  }

  parentPort.postMessage('done');
  process.exit(0);
}

// ---- Main thread ----
async function generateScaffoldHtml(options = {}) {
  const startTime = Date.now();

  const buildPath =
    options.buildPath || path.resolve(__dirname, '../build/localhost');

  // Load assets
  const scaffoldRegistry = require('../src/applications/registry.scaffold.json');
  const headerFooterData = require('@department-of-veterans-affairs/platform-landing-pages/header-footer-data');
  const facilitySidebar = require('@department-of-veterans-affairs/platform-landing-pages/facility-sidebar');

  // Load scaffold assets (inline scripts + registry)
  const scaffoldAssets = {};
  const contentBuildRoot = path.resolve(__dirname, '../..', 'content-build');

  for (const filename of ['record-event.js', 'static-page-widgets.js']) {
    const localPath = path.join(
      contentBuildRoot,
      'src/site/assets/js',
      filename,
    );
    if (fs.existsSync(localPath)) {
      scaffoldAssets[filename] = fs.readFileSync(localPath, 'utf8');
    }
  }

  const registryPath = path.join(
    contentBuildRoot,
    'src/applications/registry.json',
  );
  let appRegistry = [];
  if (fs.existsSync(registryPath)) {
    appRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  }

  // Read EJS templates as strings to pass to workers
  const templatePath = path.resolve(
    __dirname,
    '../node_modules/@department-of-veterans-affairs/platform-landing-pages/dev-template.ejs',
  );
  const templateStr = fs.readFileSync(templatePath, 'utf8');

  const arpTemplatePath = path.resolve(
    __dirname,
    '../node_modules/@department-of-veterans-affairs/platform-landing-pages/arp-dev-template.ejs',
  );
  const arpTemplateStr = fs.existsSync(arpTemplatePath)
    ? fs.readFileSync(arpTemplatePath, 'utf8')
    : null;

  // Collect all entries to generate
  const allEntries = [...appRegistry, ...scaffoldRegistry].filter(
    ({ rootUrl }) => rootUrl,
  );

  // eslint-disable-next-line no-console
  console.log(`Generating ${allEntries.length} scaffold HTML files...`);

  // Split work across workers
  const numWorkers = Math.min(os.cpus().length, allEntries.length, 8);
  const batchSize = Math.ceil(allEntries.length / numWorkers);
  const batches = [];
  for (let i = 0; i < allEntries.length; i += batchSize) {
    batches.push(allEntries.slice(i, i + batchSize));
  }

  const workerPromises = batches.map(
    batch =>
      new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: {
            batch,
            templateStr,
            arpTemplateStr,
            headerFooterData,
            facilitySidebar,
            scaffoldAssets,
            buildPath,
          },
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
          if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
      }),
  );

  await Promise.all(workerPromises);

  const elapsed = Date.now() - startTime;
  // eslint-disable-next-line no-console
  console.log(
    `Generated ${
      allEntries.length
    } HTML files in ${elapsed}ms using ${numWorkers} workers.`,
  );
}

// Run directly or export for use in other scripts
if (require.main === module) {
  const argv = require('minimist')(process.argv.slice(2));
  generateScaffoldHtml({
    buildPath: argv.buildPath || argv['build-path'],
  }).catch(err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  });
} else {
  module.exports = generateScaffoldHtml;
}
