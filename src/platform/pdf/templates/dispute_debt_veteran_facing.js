import { format } from 'date-fns';
import { formatDateLong } from 'platform/utilities/date';
import { validate } from '../utils/validations/dispute_debt';
import {
  createAccessibleDoc,
  createHeading,
  registerVaGovFonts,
  generateFooterContent,
  generateInitialHeaderContent,
} from './utils';

const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 65, right: 65 },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    monospaceFont: 'RobotoMono-Regular',
    size: 12,
    labelColor: '#757575',
    valueColor: '#000000',
  },
  headings: {
    H1: { font: 'Bitter-Bold', size: 30 },
    H2: { font: 'Bitter-Bold', size: 24 },
    H3: { font: 'Bitter-Bold', size: 16 },
    H4: { font: 'Bitter-Bold', size: 14 },
    H5: { font: 'Bitter-Bold', size: 12 },
  },
};

// =====================================
// * Helper Functions *
// =====================================

/** Creates a labeled field with gray label and black value * */
const createLabeledField = (doc, config, label, value, options = {}) => {
  const { lineGapLabel = 5, lineGapValue = 10 } = options;

  return doc.struct('P', () => {
    doc
      .font(config.text.font)
      .fontSize(config.text.size)
      .fillColor(config.text.labelColor)
      .text(label, { lineGap: lineGapLabel });
    doc
      .font(config.text.font)
      .fillColor(config.text.valueColor)
      .text(value || '', { lineGap: lineGapValue });
  });
};

/** Adds a labeled field to a section * */
const addLabeledField = (section, doc, config, label, value, options = {}) => {
  section.add(createLabeledField(doc, config, label, value, options));
};

/** Creates a section with heading and labeled fields * */
const createFieldSection = (doc, wrapper, config, title, fields) => {
  const section = doc.struct('Sect', { title });

  section.add(
    createHeading(doc, 'H3', config, title, {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  fields.forEach(({ label, value, options = {} }) => {
    // Skip labels with empty values like suffix which is often
    if (!value || (typeof value === 'string' && !value.trim())) return;
    addLabeledField(section, doc, config, label, value, options);
    if (options.moveDown !== false) doc.moveDown();
  });

  section.end();
  wrapper.add(section);
  doc.moveDown();
};

// SHOULD VALIDATION RETURN ANYTHING ELSE?

// TODO:
// handle page breaks, so H3 sections don't break across pages

// Generation notes:
// Header spacing - paragraphGap to set spacing after the header
// Content spacing - lineGap to set spacing after the text before each label item in bold
// bullets - indent is the prop used to move the bullet point over, bulletIndent is just for nested lists

const generate = async (data = {}, config = defaultConfig) => {
  validate(data);
  const doc = createAccessibleDoc(
    {
      author: 'U.S. Department of Veterans Affairs',
      subject: 'Dispute your VA debt',
      title: 'Debt Dispute',
      lang: 'en-US',
    },
    config,
  );
  await registerVaGovFonts(doc);
  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  const { selectedDebts, submissionDetails, veteran } = data;

  const headerData = {
    headerLeft: '',
    headerRight: '',
    footerLeft: 'VA.gov',
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    ...data,
  };

  await generateInitialHeaderContent(doc, wrapper, headerData, config);

  // =====================================
  // * Title Section *
  // =====================================
  const titleSection = doc.struct('Sect', {
    title: 'Title',
  });
  titleSection.add(
    createHeading(doc, 'H1', config, 'Dispute your VA debt', {
      x: config.margins.left,
      y: config.margins.top,
    }),
  );

  titleSection.end();
  wrapper.add(titleSection);
  doc.moveDown(0.5);

  // =====================================
  // * VA Logo Fetch logo as base64 *
  // =====================================
  const { logoUrl } = submissionDetails;
  if (logoUrl) {
    const response = await fetch(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(
      arrayBuffer,
    ).toString('base64')}`;

    // right align logo
    const logoWidth = 220;
    const logoX = config.margins.left;
    wrapper.add(
      doc.struct(
        'Figure',
        { alt: 'VA U.S Department of Veteran Affairs' },
        () => {
          doc.image(base64Image, logoX, doc.y, { width: logoWidth });
        },
      ),
    );
    doc.moveDown(0.5);
  }

  // =====================================
  // * Submission details *
  // =====================================
  const { submissionDateTime } = submissionDetails;
  const submissionDate = format(submissionDateTime, 'MMMM d, yyyy');

  const submissionStartY = doc.y;
  // Start at the config left margin, increase number to adjust indent as needed
  const submissionDetailsLeftMargin = config.margins.left + 20;

  const submissionDetailsSection = doc.struct('Sect');
  submissionDetailsSection.add(
    createHeading(doc, 'H3', config, `Form submitted on ${submissionDate}`, {
      x: submissionDetailsLeftMargin,
      y: doc.y,
    }),
  );

  const submissionText =
    'Your submission is complete. Submissions are processed in the order they are received. Dispute decisions are normally made with 180 days. We will send you a letter with the outcome.';

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(submissionText);
    }),
  );

  submissionDetailsSection.end();
  wrapper.add(submissionDetailsSection);

  // Start at the config left margin, increase number to adjust indent as needed
  const verticalLineLeftMargin = config.margins.left + 5;

  // Green vertical line
  doc
    .moveTo(verticalLineLeftMargin, submissionStartY)
    .lineTo(verticalLineLeftMargin, doc.y)
    .lineWidth(6)
    .strokeColor('#00A91C')
    .stroke();

  doc.moveDown(2);

  // =====================================
  // * Informational header *
  // =====================================
  wrapper.add(
    createHeading(doc, 'H2', config, 'Information submitted on this dispute', {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  // =====================================
  // * Veteran Personal Information *
  // =====================================
  const { dob, veteranFullName } = veteran;
  const formattedDob = dob ? formatDateLong(dob) : 'Not provided';

  // Build name fields dynamically
  const nameFields = Object.keys(veteranFullName).map(key => ({
    label:
      key === 'suffix'
        ? 'Suffix'
        : `${key.charAt(0).toUpperCase() + key.slice(1)} name`,
    value: veteranFullName[key],
  }));

  createFieldSection(doc, wrapper, config, "Veteran's personal information", [
    ...nameFields,
    { label: 'Date of birth', value: formattedDob },
  ]);

  // =====================================
  // * Veteran identification information *
  // =====================================
  const { ssnLastFour } = veteran;

  createFieldSection(
    doc,
    wrapper,
    config,
    "Veteran's identification information",
    [{ label: 'Social Security number', value: `••• •• ${ssnLastFour}` }],
  );

  // =====================================
  // * Veteran mailing address *
  // =====================================
  const { mailingAddress } = veteran;
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    countryName,
    zipCode,
    stateCode,
  } = mailingAddress;

  // Combine address lines
  const streetAddress = [addressLine1, addressLine2, addressLine3]
    .filter(Boolean)
    .join('\n');

  createFieldSection(doc, wrapper, config, "Veteran's mailing address", [
    { label: 'Country', value: countryName },
    { label: 'Street address', value: streetAddress },
    { label: 'City', value: city },
    { label: 'State', value: stateCode },
    { label: 'Postal code', value: zipCode },
  ]);

  // =====================================
  // * Veteran contact information *
  // =====================================
  const { email, mobilePhone } = veteran;
  const { phoneNumber, countryCode, areaCode, extension } = mobilePhone;
  const formattedPhoneNumber = `${countryCode || ''} ${areaCode ||
    ''} ${phoneNumber || ''}${extension ? ` ext. ${extension}` : ''}`.trim();

  createFieldSection(doc, wrapper, config, "Veteran's contact information", [
    { label: 'Phone number', value: formattedPhoneNumber },
    { label: 'Email', value: email },
  ]);

  // =====================================
  // * Selected debts *
  // =====================================
  selectedDebts.forEach(debt => {
    const { disputeReason, supportStatement, label } = debt;

    createFieldSection(doc, wrapper, config, label, [
      { label: 'Dispute reason', value: disputeReason },
      { label: 'Dispute statement', value: supportStatement },
    ]);
  });

  // =====================================
  // * Wrap it up *
  // =====================================
  await generateFooterContent(doc, wrapper, headerData, config);
  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate, validate };
