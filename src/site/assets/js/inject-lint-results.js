function injectValeLintResults(error, results) {
  if (error) {
    console.log('Error injecting Vale results into page!');
    console.log(error);
    return;
  } else if (results.violations.length === 0) {
    return;
  }

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

  const header = document.querySelector('header');

  header.prepend(bannerEl, header.firstChild);
}

console.log('inject-lint-results.js is loaded!');
document.ready(console.log('ready!'));
