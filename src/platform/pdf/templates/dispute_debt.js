import { format } from 'date-fns';
import { formatDateLong } from 'platform/utilities/date';
import i18nDebtApp from 'applications/dispute-debt/i18n';
import {
  createAccessibleDoc,
  createHeading,
  registerVaGovFonts,
  generateFooterContent,
  generateInitialHeaderContent,
} from './utils';
import { validate } from '../utils/validations/dispute_debt';
import {
  createFieldSection,
  defaultConfig,
} from '../utils/helpers/dispute_debt';

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
      subject: i18nDebtApp.t('pdf.document-meta.dmc-subject'),
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
    title: i18nDebtApp.t('pdf.dmc-page-title'),
  });
  titleSection.add(
    createHeading(doc, 'H1', config, i18nDebtApp.t('pdf.dmc-page-title'), {
      x: config.margins.left,
      y: doc.y,
    }),
  );

  doc.moveDown(3);

  const useCompAndPenTitle = selectedDebts?.some(
    debt => debt.deductionCode === '30',
  );

  const dmcRoutingTitle = useCompAndPenTitle
    ? i18nDebtApp.t('pdf.dmc-routing-title.use-comp-and-pen-title')
    : i18nDebtApp.t('pdf.dmc-routing-title.use-education-title');
  titleSection.add(
    createHeading(doc, 'H2', config, dmcRoutingTitle, {
      x: config.margins.left,
      y: doc.y,
      paragraphGap: 12,
    }),
  );

  doc.moveDown(3);

  titleSection.end();
  wrapper.add(titleSection);

  // =====================================
  // * Submission Type Section *
  // =====================================
  const submissionTypeSection = doc.struct('Sect', {
    title: i18nDebtApp.t('pdf.submission.type-header'),
  });

  submissionTypeSection.add(
    createHeading(
      doc,
      'H3',
      config,
      i18nDebtApp.t('pdf.submission.type-header'),
      {
        x: config.margins.left,
        y: doc.y,
        paragraphGap: 6,
      },
    ),
  );

  doc.moveDown(2);

  // bulletIndent prop is just for nested lists
  // regular indent for text will shit the bullet points over
  const listOptions = {
    baseline: 'hanging',
    listType: 'bullet',
    bulletRadius: 2,
    indent: 10,
    textIndent: 15,
  };

  submissionTypeSection.add(
    doc.struct(
      'List',
      { title: i18nDebtApp.t('pdf.submission.type-header') },
      () => {
        doc
          .fontSize(config.text.size)
          .font(config.text.font)
          .list(
            selectedDebts?.map(
              debt => `${debt?.deductionCode || ''} - ${debt?.label || ''}`,
            ),
            listOptions,
          );
      },
    ),
  );

  submissionTypeSection.end();
  wrapper.add(submissionTypeSection);
  doc.moveDown();

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
    const logoWidth = 150;
    const logoX = config.margins.left;
    wrapper.add(
      doc.struct('Figure', { alt: i18nDebtApp.t('pdf.logo-alt') }, () => {
        doc.image(base64Image, logoX, doc.y, { width: logoWidth });
      }),
    );
    doc.moveDown();
  }

  // =====================================
  // * Submission details *
  // =====================================
  const { submissionDateTime } = submissionDetails;
  const submissionDate = format(submissionDateTime, 'MMMM d, yyyy');
  const submissionTimeET = format(submissionDateTime, "h:mm a 'ET'");

  const submissionStartY = doc.y;
  const submissionDetailsSection = doc.struct('Sect', {
    title: i18nDebtApp.t('pdf.submission.dmc-title'),
  });

  // Start at the config left margin, increase number to adjust indent as needed
  const submissionDetailsLeftMargin = config.margins.left + 20;

  submissionDetailsSection.add(
    createHeading(
      doc,
      'H3',
      config,
      i18nDebtApp.t('pdf.submission.dmc-title'),
      {
        x: submissionDetailsLeftMargin,
        y: doc.y,
      },
    ),
  );

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(i18nDebtApp.t('pdf.labels.date'), { continued: true });
      doc.text(submissionDate || '');
    }),
  );

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(i18nDebtApp.t('pdf.labels.time'), { continued: true });
      doc.text(submissionTimeET || '');
    }),
  );

  submissionDetailsSection.end();
  wrapper.add(submissionDetailsSection);

  // Start at the config left margin, increase number to adjust indent as needed
  const verticalLineLeftMargin = config.margins.left + 5;

  doc
    .moveTo(verticalLineLeftMargin, submissionStartY)
    .lineTo(verticalLineLeftMargin, doc.y)
    .lineWidth(6)
    .strokeColor(config.graphicColors.greenBar)
    .stroke();

  doc.moveDown();

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
  const { ssnLastFour, vaFileLastFour } = veteran;

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
      {
        label: i18nDebtApp.t('pdf.labels.file-number'),
        value: vaFileLastFour ? `•••••${vaFileLastFour}` : '',
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

  const addressLines = [addressLine1, addressLine2, addressLine3].filter(
    Boolean,
  );

  createFieldSection(
    doc,
    wrapper,
    config,
    i18nDebtApp.t('pdf.section-headings.mailing-address'),
    [
      { label: i18nDebtApp.t('pdf.labels.country'), value: countryName },
      {
        label: i18nDebtApp.t('pdf.labels.street-address'),
        value: addressLines[0],
        options: { lineGapValue: 2 },
      },
      // Middle lines (if any) get reduced spacing
      ...addressLines.slice(1, -1).map(line => ({
        label: '',
        value: line,
        options: { lineGapLabel: 0, lineGapValue: 2 },
      })),
      // Last line (if different from first) gets normal spacing
      ...(addressLines.length > 1
        ? [
            {
              label: '',
              value: addressLines[addressLines.length - 1],
              options: { lineGapValue: 12 },
            },
          ]
        : []),
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
    const { disputeReason, supportStatement, label, rcvblId } = debt;

    createFieldSection(doc, wrapper, config, label, [
      {
        label: i18nDebtApp.t('pdf.labels.dispute-reason'),
        value: disputeReason,
      },
      {
        label: i18nDebtApp.t('pdf.labels.dispute-statement'),
        value: supportStatement,
      },
      { label: i18nDebtApp.t('pdf.labels.rcvbl-id'), value: rcvblId },
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

export { generate };
