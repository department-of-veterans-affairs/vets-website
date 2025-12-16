import { format } from 'date-fns';
import { formatDateLong } from 'platform/utilities/date';
import i18nDebtApp from 'applications/dispute-debt/i18n';
import { validate } from '../utils/validations/dispute_debt';
import {
  drawNumberedCircle,
  drawVerticalLine,
  drawHorizontalLine,
  addPhone,
  addTTY,
  addWebLink,
  createFieldSection,
} from '../utils/helpers/dispute_debt';
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
// * Section Builders *
// =====================================
const createWhatToExpectSection = (doc, wrapper, config, content) => {
  const section = doc.struct('Sect', { title: content.title });

  // Define circle constants
  const circleIndent = 15;
  const circleRadius = 10;
  const circleX = config.margins.left + circleRadius + circleIndent;
  const textIndent = circleX + 20;

  // Add section heading
  section.add(
    createHeading(doc, 'H2', config, content.title, {
      x: config.margins.left,
    }),
  );
  doc.moveDown(3);
  let circle1CenterY;

  // Draw steps with circles and vertical lines
  content.steps.forEach((step, index) => {
    const stepY = doc.y;
    const { circleCenterY, circleRadius: radius } = drawNumberedCircle(
      doc,
      config,
      step.number,
      stepY,
    );
    if (index === 0) circle1CenterY = circleCenterY;
    section.add(
      doc.struct('P', () => {
        doc
          .font(config.headings.H5.font)
          .fontSize(config.headings.H5.size)
          .text(step.title, textIndent, stepY);
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .text(step.description);
      }),
    );
    if (index < content.steps.length - 1) {
      doc.moveDown(2);
      const step1EndY = doc.y;
      drawVerticalLine(doc, circleX, circle1CenterY + radius, step1EndY);
      doc.moveDown();
    }
  });
  section.end();
  wrapper.add(section);
  doc.moveDown(4);
};

const createContactSection = (doc, wrapper, config, content) => {
  const section = doc.struct('Sect', { title: content.title });

  // Add section heading
  section.add(
    createHeading(doc, 'H2', config, content.title, {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );
  section.add(
    doc.struct('P', () => {
      doc.font(config.text.font).fontSize(config.text.size);

      // Call Us
      doc.text(content['call-us'].prefix, { continued: true });
      addPhone(doc, content['main-phone']);
      addTTY(doc, content.tty);
      doc.text(content['call-us'].suffix, {
        link: null,
        continued: false,
        lineGap: 2,
      });
      doc.moveDown();

      // Ask VA
      doc.text(content['ask-va-text'], { lineGap: 2 });
      doc.moveDown();

      // Ask VA Link
      addWebLink(doc, content['ask-va-link'].text, content['ask-va-link'].url);
    }),
  );
  section.end();
  wrapper.add(section);
  doc.moveDown(2);
};

const createNeedHelpSection = (doc, wrapper, config, content) => {
  const section = doc.struct('Sect', { title: content.title });

  // Add section heading
  section.add(
    createHeading(doc, 'H3', config, content.title, {
      x: config.margins.left,
      paragraphGap: 18,
    }),
  );
  doc.moveDown(2);
  drawHorizontalLine(doc, config);
  section.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .fillColor('#000000');

      // MyVA411 line
      doc.text(content['my-v411'].prefix, { continued: true, lineGap: 2 });
      addPhone(doc, content['my-v411'].phone);
      addTTY(doc, content['my-v411'].tty);
      doc.text('.', { link: null });
      doc.moveDown();

      // Accredited Rep
      doc.text(content['accredited-rep'].text, { lineGap: 2 });
      addWebLink(
        doc,
        content['accredited-rep'].link.text,
        content['accredited-rep'].link.url,
      );
      doc.moveDown();

      // Overpayments
      doc.text(content.overpayments.prefix, { continued: true, lineGap: 2 });
      addPhone(doc, content.overpayments.phone);
      doc.text(' (or ', { link: null, underline: false, continue: true });
      addPhone(doc, content.overpayments['alt-phone']);
      doc.text(content.overpayments.suffix, {
        link: null,
        underline: false,
        continue: false,
      });
      doc.moveDown();

      // Copay
      doc.text(content.copay.prefix, { continued: true, lineGap: 2 });
      addPhone(doc, content.copay.phone);
      doc.text(content.copay.suffix, {
        link: null,
        underline: false,
        continue: false,
      });
    }),
  );
  section.end();
  wrapper.add(section);
  doc.moveDown();
};

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
      author: i18nDebtApp.t('pdf.document-meta.author'),
      subject: i18nDebtApp.t('pdf.document-meta.subject'),
      title: i18nDebtApp.t('pdf.document-meta.title'),
      lang: i18nDebtApp.t('pdf.document-meta.lang'),
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
    footerLeft: i18nDebtApp.t('pdf.footer.left'),
    footerRight: i18nDebtApp.t('pdf.footer.right'),
    ...data,
  };

  await generateInitialHeaderContent(doc, wrapper, headerData, config);

  // =====================================
  // * Title Section *
  // =====================================
  const titleSection = doc.struct('Sect', {
    title: i18nDebtApp.t('pdf.page-title'),
  });
  titleSection.add(
    createHeading(doc, 'H1', config, i18nDebtApp.t('pdf.page-title'), {
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
      doc.struct('Figure', { alt: i18nDebtApp.t('pdf.logo-alt') }, () => {
        doc.image(base64Image, logoX, doc.y, { width: logoWidth });
      }),
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

  const submmissionTextWidth = 375; // Defined as points, not pixels. (approx. 5.21 inches)

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(i18nDebtApp.t('pdf.submission.text'), {
          width: submmissionTextWidth,
          align: 'left',
        });
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
    createHeading(
      doc,
      'H2',
      config,
      i18nDebtApp.t('pdf.section-headings.information-submitted'),
      {
        x: config.margins.left,
        paragraphGap: 12,
      },
    ),
  );

  // =====================================
  // * Veteran Personal Information *
  // =====================================
  const { dob, veteranFullName } = veteran;
  const formattedDob = dob ? formatDateLong(dob) : 'Not provided';

  const nameFields = [
    {
      label: i18nDebtApp.t('pdf.labels.first-name'),
      value: veteranFullName.first,
    },
    {
      label: i18nDebtApp.t('pdf.labels.middle-name'),
      value: veteranFullName.middle,
    },
    {
      label: i18nDebtApp.t('pdf.labels.last-name'),
      value: veteranFullName.last,
    },
    {
      label: i18nDebtApp.t('pdf.labels.suffix'),
      value: veteranFullName.suffix,
    },
  ].filter(field => field.value);

  createFieldSection(
    doc,
    wrapper,
    config,
    i18nDebtApp.t('pdf.section-headings.personal-info'),
    [
      ...nameFields,
      { label: i18nDebtApp.t('pdf.labels.dob'), value: formattedDob },
    ],
  );

  // =====================================
  // * Veteran identification information *
  // =====================================
  const { ssnLastFour } = veteran;

  createFieldSection(
    doc,
    wrapper,
    config,
    i18nDebtApp.t('pdf.section-headings.identification-info'),
    [
      {
        label: i18nDebtApp.t('pdf.labels.ssn'),
        value: `••• •• ${ssnLastFour}`,
      },
    ],
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

  createFieldSection(
    doc,
    wrapper,
    config,
    i18nDebtApp.t('pdf.section-headings.mailing-address'),
    [
      { label: i18nDebtApp.t('pdf.labels.country'), value: countryName },
      {
        label: i18nDebtApp.t('pdf.labels.street-address'),
        value: streetAddress,
      },
      { label: i18nDebtApp.t('pdf.labels.city'), value: city },
      { label: i18nDebtApp.t('pdf.labels.state'), value: stateCode },
      { label: i18nDebtApp.t('pdf.labels.postal-code'), value: zipCode },
    ],
  );

  // =====================================
  // * Veteran contact information *
  // =====================================
  const { email, mobilePhone } = veteran;
  const { phoneNumber, countryCode, areaCode, extension } = mobilePhone;
  const formattedPhoneNumber = `${countryCode || ''} ${areaCode ||
    ''} ${phoneNumber || ''}${extension ? ` ext. ${extension}` : ''}`.trim();

  createFieldSection(
    doc,
    wrapper,
    config,
    i18nDebtApp.t('pdf.section-headings.contact-info'),
    [
      { label: i18nDebtApp.t('pdf.labels.phone'), value: formattedPhoneNumber },
      { label: i18nDebtApp.t('pdf.labels.email'), value: email },
    ],
  );

  // =====================================
  // * Selected debts *
  // =====================================
  selectedDebts.forEach(debt => {
    const { disputeReason, supportStatement, label } = debt;

    createFieldSection(doc, wrapper, config, label, [
      {
        label: i18nDebtApp.t('pdf.labels.dispute-reason'),
        value: disputeReason,
      },
      {
        label: i18nDebtApp.t('pdf.labels.dispute-statement'),
        value: supportStatement,
      },
    ]);
  });

  /* Begin Multi-page logic to make sure What to expect (WTE) section isn't split between pages */
  // Get current Y position and page height
  const currentY = doc.y;
  const pageHeight = doc.page.height;
  const bottomMargin = config.margins.bottom;
  const availableSpace = pageHeight - currentY - bottomMargin;

  // Estimate WTE section height (rough calculation)
  const estimatedSectionHeight = 250; // points
  if (availableSpace < estimatedSectionHeight) {
    doc.addPage(); // Start new page
  }
  /* End Multi-page logic */

  // =====================================
  // * What to expect, Contact, Need help *
  // =====================================

  const whatToExpect = {
    title: i18nDebtApp.t('pdf.section-headings.what-to-expect'),
    steps: [
      {
        number: i18nDebtApp.t(
          'dispute-submitted-whats-next.first-action.number',
        ),
        title: i18nDebtApp.t(
          'dispute-submitted-whats-next.first-action.header',
        ),
        description: i18nDebtApp.t(
          'dispute-submitted-whats-next.first-action.description',
        ),
      },
      {
        number: i18nDebtApp.t(
          'dispute-submitted-whats-next.second-action.number',
        ),
        title: i18nDebtApp.t(
          'dispute-submitted-whats-next.second-action.header',
        ),
        description: i18nDebtApp.t(
          'dispute-submitted-whats-next.second-action.description',
        ),
      },
    ],
  };

  const contact = i18nDebtApp.t('shared.contact', { returnObjects: true });
  const needHelp = i18nDebtApp.t('shared.need-help', { returnObjects: true });
  createWhatToExpectSection(doc, wrapper, config, whatToExpect);
  createContactSection(doc, wrapper, config, contact);
  createNeedHelpSection(doc, wrapper, config, needHelp);

  // =====================================
  // * Wrap it up *
  // =====================================
  await generateFooterContent(doc, wrapper, headerData, config);
  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
