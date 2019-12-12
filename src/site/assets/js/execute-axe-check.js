function sanitizeString(dirtyString, elem) {
  var sanitizedString = document.createElement(elem);
  sanitizedString.innerText = dirtyString;

  return sanitizedString.outerHTML;
}

function processAxeCheckResults(error, results) {
  if (error) {
    console.log('Error executing the Axe check!');
    console.log(error);
    return;
  } else if (results.violations.length === 0) {
    return;
  }

  var bannerEl = document.createElement('div');

  var details = '<details class="vads-u-background-color--primary-alt-lightest vads-u-border-color--primary-darker vads-u-border-bottom--2px vads-u-padding--1">';
  details += '<summary><h4 class="vads-u-display--inline-block vads-u-margin-y--2">There are (' + results.violations.length + ') accessibility issues on this page.</h4></summary>';

  var violationsList = '<ul class="usa-unstyled-list vads-u-border-color--primary-darker vads-u-border-top--1px vads-u-padding-x--6 vads-u-padding-y--2">';

  results.violations.forEach(function(violation) {
    var violationEl = '<li class="vads-u-margin-y--1">';

    violationEl += '<details>';
    violationEl += '<summary>' + sanitizeString(violation.help, 'strong') + '</summary>';
    violationEl += '<ul class="usa-unstyled-list vads-u-padding-y--1 vads-u-padding-x--2">';

    violationEl += '<li><strong>Description</strong>: ' + sanitizeString(violation.description, 'span') + '</li>';
    violationEl += '<li><strong>Impact</strong>: ' + sanitizeString(violation.impact, 'span') + '</li>';
    violationEl += '<li><strong>Tags</strong>: ' + sanitizeString(violation.tags.join(', '), 'span') + '</li>';
    violationEl += '<li><strong>Help</strong>: <a href="' + violation.helpUrl + '" target="blank" rel="noopener noreferrer">' + sanitizeString(violation.helpUrl, 'span') + '</a></li>';

    var nodeList = '<li><strong>HTML</strong>:';
    nodeList += '<ol>';

    violation.nodes.forEach(function(node) {
      var nodeEl = '<li>';
      nodeEl += sanitizeString(node.html, 'code');
      nodeList += nodeEl;
    });

    nodeList += '</ol></li>';
    violationEl += nodeList;

    violationEl += '</ul>';
    violationEl += '</details>';
    violationEl += '</li>';

    violationsList += violationEl;
  });

  violationsList += '</ul>';

  details += violationsList;
  details += '</details>';

  bannerEl.innerHTML = details;

  const header = document.querySelector('header');

  header.prepend(bannerEl, header.firstChild);
}

(function executeAxeCheck() {
  axe.run(
    'main',
    {
      iframes: false,
      runOnly: {
        type: 'tag',
        values: ['section508', 'wcag2a', 'wcag2aa', 'best-practice'],
        resultTypes: ['violations'],
      },
      rules: {
        'color-contrast': { enabled: false },
      },
    }, processAxeCheckResults);
})();
