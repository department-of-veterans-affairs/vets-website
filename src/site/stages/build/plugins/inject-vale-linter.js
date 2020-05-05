/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */

/**
 * Run vale lint on the page content and inject suggestions into the rendered HTML
 */
const { spawn } = require('child_process');
const fs = require('fs');
const tmp = require('tmp');

/**
 *  Method to execute vale check on content via child process
 *
 * @param {String} contentFilename a tempfile name including the page content, to be passed to vale
 * @return {Promise} resolves with vale results in object
 *
 */
function runValeCheck(contentFilename) {
  return new Promise((resolve, reject) => {
    const output = {};
    const vale = spawn('vale', [
      '--config=script/vale/.vale.ini',
      '--output=JSON',
      `${contentFilename}`,
    ]);

    vale.stdout.on('data', data => {
      output.results = data.toString();
    });

    vale.stderr.on('data', data => {
      output.errors = data.toString();
    });

    vale.on('exit', code => {
      if (code !== 0) {
        reject('Vale exited with non-zero exit code:', code);
      }
      output.code = code.toString();
      resolve(output);
    });
  });
}

/**
 * Method to create a tempfile for the page content
 *
 * @param {Buffer} dataBuffer the content to write to file
 * @return {String} filename of the generated tempfile
 *
 */
function createTempFile(dataBuffer) {
  const temp = tmp.fileSync({ prefix: 'vale-', postfix: '.html' });
  fs.writeSync(temp.fd, dataBuffer);
  return temp.name;
}

/**
 * Build the page header banner element
 *
 * @param {Object} issues an object containing a collection of linting issues
 * @return {String} an HTML string containing elements to be injected into the DOM
 *
 */
function buildDetailsMarkup(issues) {
  let details =
    '<details class="vads-u-background-color--primary-alt-lightest vads-u-border-color--secondary-lighter vads-u-border-bottom--2px vads-u-padding--1">';
  details += `<summary><h4 class="vads-u-display--inline-block vads-u-margin-y--2">There are (${
    issues.length
  }) content suggestions found on this page.</h4></summary>`;

  let issuesList =
    '<ul class="usa-unstyled-list vads-u-border-color--primary-darker vads-u-border-top--1px vads-u-padding-x--6 vads-u-padding-y--2">';

  issues.forEach(issue => {
    let issueEl = '<li class=vads-u-margin-y--1">';
    issueEl += '<details>';
    issueEl += `<summary><strong>${issue.Message}</strong></summary>`;

    issueEl += `<ul class="usa-unstyled-list vads-u-padding-y--1 vads-u-padding-x--2">`;
    issueEl += `<li><strong>Rule</strong>: ${issue.Check}</li>`;
    issueEl += `<li><strong>Description</strong>: ${issue.Description}</li>`;
    issueEl += `<li><strong>Learn More</strong>: <a href="${
      issue.Link
    }" target="blank" rel="noopener noreferrer">${issue.Link}</a></li>`;

    issueEl += '</ul>';
    issueEl += '</details>';
    issueEl += '</li>';

    issuesList += issueEl;
  });

  issuesList += '</ul>';

  details += issuesList;
  details += '</details>';
  return details;
}

/**
 * Run the vale plain language linter on previewed content files
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 *
 */
function injectValeLinter(buildOptions) {
  return async (files, metalsmith, done) => {
    if (!buildOptions['lint-plain-language']) {
      done();
      return 'Plain language linting skipped';
    }

    for (const fileName of Object.keys(files)) {
      if (!fileName.endsWith('.html')) continue;

      /*
       * Because the file is only linted for plain language on the preview server, which is dynamically served via preview.js, we need to read the contents directly and put them in a tmpfile. Passing contents in directly leads to very large argument lists which causes vale to error out.
       */
      const file = files[fileName];
      const tempfile = createTempFile(file.contents);
      const { dom } = file;

      try {
        const valeOutput = await runValeCheck(tempfile);
        if (typeof valeOutput.results.length === 'undefined') continue;

        const parsedOutput = JSON.parse(valeOutput.results)[tempfile];
        const elements = buildDetailsMarkup(parsedOutput);
        dom('body').prepend(elements);
        file.modified = true;
      } catch (e) {
        return e.message;
      }
    }
    return done();
  };
}

module.exports = injectValeLinter;
