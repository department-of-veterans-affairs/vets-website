const { alert } = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const staffProfile = require('./paragraph-fragments/staffProfile.paragraph.graphql');
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
const table = require('./paragraph-fragments/table.paragraph.graphql');
const downloadableFile = require('./paragraph-fragments/downloadableFile.paragraph.graphql');
const embeddedImage = require('./paragraph-fragments/media.paragraph.graphql');
const button = require('./paragraph-fragments/button.paragraph.graphql');
const alertParagraphSingle = require('./paragraph-fragments/alertSingle.paragraph.graphql');
const audienceTopics = require('./paragraph-fragments/audienceTopics.paragraph.graphql');
const termLcCategory = require('./taxonomy-fragments/termLcCategory.taxonomy.graphql');
const termTopics = require('./taxonomy-fragments/termTopics.taxonomy.graphql');
const supportService = require('./supportService.graphql');
const richTextCharLimit1000 = require('./paragraph-fragments/richTextCharLimit1000.paragraph.graphql');

module.exports = `
  ${alert}
  ${collapsiblePanel}
  ${staffProfile}
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
  ${table}
  ${downloadableFile}
  ${embeddedImage}
  ${button}
  ${alertParagraphSingle}
  ${termLcCategory}
  ${termTopics}
  ${audienceTopics}
  ${supportService}
  ${richTextCharLimit1000}
`;
