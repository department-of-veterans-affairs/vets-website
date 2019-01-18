/**
 * The top-level page for a section of the website.
 * Examples include /health-care/, /disability/, etc.
 */
module.exports = `
  fragment landingPage on NodeLandingPage {
    entityUrl {
      path
    }
    entityBundle
    entityPublished
    title
    fieldIntroText
  }
`;
