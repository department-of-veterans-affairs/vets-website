const { alert } = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const {
  listOfLinkTeasers,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');
const { promo } = require('./block-fragments/promo.block.graphql');
const linkTeaser = require('./paragraph-fragments/linkTeaser.paragraph.graphql');

module.exports = `
  ${alert}
  ${collapsiblePanel}
  ${linkTeaser}
  ${listOfLinkTeasers}
  ${process}
  ${promo}
  ${qaSection}
  ${wysiwyg}
`;
