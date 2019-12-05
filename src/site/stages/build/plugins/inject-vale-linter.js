/* eslint-disable no-continue, no-unused-vars */

/**
 * TODO: Handle errors with sentry where appropriate, or find out what's best todo with these errors
 */

/**
 * Run vale lint on the page content and inject suggestions into the rendered HTML
 */
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const tmp = require('tmp');

/**
 *  Method to execute vale check on a content string via helper script
 *
 * @param {String} content
 */
async function runValeCheck(content) {
  const promise = new Promise((resolve, _reject) => {
    const results = {};

    /**
     * TODO: We need to ensure some sort of check so bad content can't be passed in
     */
    const vale = spawn('vale', [
      '--config=script/vale/.vale.ini',
      '--output=JSON',
      `${content}`,
    ]);

    vale.stdout.on('data', data => {
      results.results = data;
      results.dataString = data.toString();
    });

    vale.stderr.on('data', data => {
      results.errors = data.toString();
      // TODO log error somewhere
      // console.log(`vale stderr: ${data.toString()}`);
    });

    vale.on('exit', code => {
      results.code = code.toString();
      // TODO handle errors
      // console.log(`child process exited with code ${code.toString()}`);
    });

    resolve(results);
  });
  const results = await promise;
  await new Promise((resolve, _reject) => {
    setTimeout(resolve, 5000);
  }); // Only works with this
  return results;
}

/**
 * Create the vale temp file
 * @param {Buffer} dataBuffer the content to write to file
 */
function createTempFile(dataBuffer) {
  const temp = tmp.fileSync({ prefix: 'vale-' });
  fs.writeSync(temp.fd, dataBuffer);
  return temp.name;
}

/**
 * Inject the results into the page header banner element
 */
function injectResultsIntoMarkup(file, issues) {
  const { dom } = file;
  const bannerEl = document.createElement('div');
  let details =
    '<details class="vads-u-background-color--primary-alt-lightest vads-u-border-color--secondary-lighter vads-u-border-bottom--2px vads-u-padding--1">';
  details += `<summary><h4 class="vads-u-display--inline-block vads-u-margin-y--2">There are (${
    issues.length
  }) language linting suggestions found on this page.</h4></summary>`;

  let issuesList =
    '<ul class="usa-unstyled-list vads-u-border-color--primary-darker vads-u-border-top--1px vads-u-padding-x--6 vads-u-padding-y--2">';

  issues.forEach(issue => {
    let issueEl = '<li class=vads-u-margin-y--1">';
    issueEl += '<details>';
    issueEl += `<summary><strong>${issue.Message}</strong></summary>`;
    issueEl +=
      '<ul class="usa-unstyled-list vads-u-padding-y--1 vads-u-padding-x--2">';

    issueEl += '</ul>';
    issueEl += '</details>';
    issueEl += '</li>';

    issuesList += issueEl;
  });

  issuesList += '</ul>';

  details += issuesList;
  details += '</details>';

  bannerEl.innerHTML = details;
  const header = dom('header');
  header.prepend(bannerEl, header.firstChild);
}

/**
 * Run the vale plain language linter on previewed content files
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */
function injectValeLinter(buildOptions) {
  return (files, metalsmith, done) => {
    if (!buildOptions['lint-plain-language']) {
      done();
      return 'Plain language linting skipped';
    }
    let issues;

    for (const fileName of Object.keys(files)) {
      if (!fileName.endsWith('.html')) continue;

      /*
       * Because the file is only linted for plain language on the preview server, which is dynamically served via preview.js, we need to read the contents directly and put them in a tmpfile. Passing contents in directly leads to very large argument lists which errors out.
       */
      const file = files[fileName];
      const contents = file.contents.toString('utf-8');
      const tmpfile = createTempFile(new Buffer(contents));

      /**
       * Run the vale binary on the contents of the file
       */
      issues = runValeCheck(tmpfile).then(
        issuesObj => JSON.parse(issuesObj.dataString)[tmpfile],
      );

      const { dom } = file;
      const issueElements = issues.then(issuesArray => issuesArray);
      issueElements.then(elements => {
        // console.log('There are ', issues.length, ' suggestions');
        injectResultsIntoMarkup(file, elements);
        for (const i of elements) {
          // console.log(i.Message, i.Line, i.Span);
        }
      });

      dom('body').append(
        '<script type="text/javascript" src="/js/inject-lint-results.js"></script>',
      );
      file.modified = true;
    }
    done();
    return issues;
  };
}

module.exports = injectValeLinter;
