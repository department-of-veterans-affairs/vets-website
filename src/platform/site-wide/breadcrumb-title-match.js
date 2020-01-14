// Nodes with identical titles result in url strings with digits appended.
// This creates ugly breadcrumbs - logic below prevents this.
document.addEventListener('DOMContentLoaded', () => {
  const lastCrumb = document.querySelector(
    '#va-breadcrumbs-list li:last-child a',
  ).textContent;
  const pageTitle = document.getElementsByTagName('h1')[0].textContent;
  if (pageTitle !== undefined && lastCrumb !== pageTitle) {
    document.querySelector(
      '#va-breadcrumbs-list li:last-child a',
    ).textContent = pageTitle;
  }
});
