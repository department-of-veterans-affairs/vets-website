const administration = require('./taxonomy-fragments/administration.taxonomy.graphql');
const alertParagraph = require('./paragraph-fragments/alert.paragraph.graphql');
const alertParagraphSingle = require('./paragraph-fragments/alertSingle.paragraph.graphql');
const audienceBeneficiaries = require('./taxonomy-fragments/audienceBeneficiaries.taxonomy.graphql');
const audienceNonBeneficiaries = require('./taxonomy-fragments/audienceNonBeneficiaries.taxonomy.graphql');
const audienceTopics = require('./paragraph-fragments/audienceTopics.paragraph.graphql');
const button = require('./paragraph-fragments/button.paragraph.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const contactInformation = require('./paragraph-fragments/contactInformation.paragraph.graphql');
const downloadableFile = require('./paragraph-fragments/downloadableFile.paragraph.graphql');
const emailContact = require('./paragraph-fragments/emailContact.paragraph.graphql');
const embeddedImage = require('./paragraph-fragments/media.paragraph.graphql');
const linkTeaser = require('./paragraph-fragments/linkTeaser.paragraph.graphql');
const listsOfLinks = require('./paragraph-fragments/listsOfLinks.paragraph.graphql');
const numberCallout = require('./paragraph-fragments/numberCallout.paragraph.graphql');
const phoneNumber = require('./paragraph-fragments/phoneNumber.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qa = require('./paragraph-fragments/qa.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const reactWidget = require('./paragraph-fragments/reactWidget.paragraph.graphql');
const richTextCharLimit1000 = require('./paragraph-fragments/richTextCharLimit1000.paragraph.graphql');
const spanishSummary = require('./paragraph-fragments/spanishSummary.paragraph.graphql');
const staffProfile = require('./paragraph-fragments/staffProfile.paragraph.graphql');
const supportService = require('./supportService.graphql');
const table = require('./paragraph-fragments/table.paragraph.graphql');
const termLcCategory = require('./taxonomy-fragments/termLcCategory.taxonomy.graphql');
const termTopics = require('./taxonomy-fragments/termTopics.taxonomy.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');
const { alert } = require('./block-fragments/alert.block.graphql');
const {
  listOfLinkTeasers,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { promo } = require('./block-fragments/promo.block.graphql');

const ALL_FRAGMENTS = `
  ${administration}
  ${alertParagraphSingle}
  ${alertParagraph}
  ${alert}
  ${audienceBeneficiaries}
  ${audienceNonBeneficiaries}
  ${audienceTopics}
  ${button}
  ${collapsiblePanel}
  ${contactInformation}
  ${downloadableFile}
  ${emailContact}
  ${embeddedImage}
  ${linkTeaser}
  ${listOfLinkTeasers}
  ${listsOfLinks}
  ${numberCallout}
  ${phoneNumber}
  ${process}
  ${promo}
  ${qaSection}
  ${qa}
  ${reactWidget}
  ${richTextCharLimit1000}
  ${spanishSummary}
  ${staffProfile}
  ${supportService}
  ${table}
  ${termLcCategory}
  ${termTopics}
  ${wysiwyg}
`;

module.exports = {
  ALL_FRAGMENTS,
  administration,
  alertParagraphSingle,
  alertParagraph,
  alert,
  audienceBeneficiaries,
  audienceNonBeneficiaries,
  audienceTopics,
  button,
  collapsiblePanel,
  contactInformation,
  downloadableFile,
  emailContact,
  embeddedImage,
  linkTeaser,
  listOfLinkTeasers,
  listsOfLinks,
  numberCallout,
  phoneNumber,
  process,
  promo,
  qaSection,
  qa,
  reactWidget,
  richTextCharLimit1000,
  spanishSummary,
  staffProfile,
  supportService,
  table,
  termLcCategory,
  termTopics,
  wysiwyg,
};
