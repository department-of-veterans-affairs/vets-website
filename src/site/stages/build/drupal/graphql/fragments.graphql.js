const { alert } = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const {
  listOfLinkTeasers,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const qa = require('./paragraph-fragments/qa.paragraph.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');
const { promo } = require('./block-fragments/promo.block.graphql');
const linkTeaser = require('./paragraph-fragments/linkTeaser.paragraph.graphql');
const administration = require('./taxonomy-fragments/administration.taxonomy.graphql');
const reactWidget = require('./paragraph-fragments/reactWidget.paragraph.graphql');
const spanishSummary = require('./paragraph-fragments/spanishSummary.paragraph.graphql');
const numberCallout = require('./paragraph-fragments/numberCallout.paragraph.graphql');
const alertParagraph = require('./paragraph-fragments/alert.paragraph.graphql');

module.exports = `
  ${alert}
  ${collapsiblePanel}
  ${linkTeaser}
  ${listOfLinkTeasers}
  ${process}
  ${promo}
  ${qa}
  ${qaSection}
  ${wysiwyg}
  ${administration}
  ${reactWidget}
  ${spanishSummary}
  ${numberCallout}
  ${alertParagraph}
`;
