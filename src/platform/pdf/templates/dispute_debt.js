import { format } from 'date-fns';
import {
  createAccessibleDoc,
  createHeading,
  registerVaGovFonts,
  generateFooterContent,
  generateInitialHeaderContent,
} from './utils';

const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 30, right: 30 },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    monospaceFont: 'RobotoMono-Regular',
    size: 12,
  },
  headings: {
    H1: {
      font: 'Bitter-Bold',
      size: 30,
    },
    H2: {
      font: 'Bitter-Bold',
      size: 24,
    },
    H3: {
      font: 'Bitter-Bold',
      size: 16,
    },
    H4: {
      font: 'Bitter-Bold',
      size: 14,
    },
    H5: {
      font: 'Bitter-Bold',
      size: 12,
    },
  },
};

// TODO:
// Data validation
// Submission information
//   Get confirmation number
// handle page breaks, so H3 sections don't break across pages

// NOTES:
// Header spacing - paragraphGap to set spacing after the header
// Content spacing - lineGap to set spacing after the text before each label item in bold
// bullets - indent is the prop used to move the bullet point over, bulletIndent is just for nested lists
//

const generate = async (data = {}, config = defaultConfig) => {
  const doc = createAccessibleDoc(
    {
      author: 'U.S. Department of Veterans Affairs',
      subject: 'Debt dispute from VA.gov',
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
    createHeading(doc, 'H1', config, 'Debt dispute from VA.gov', {
      x: config.margins.left,
      y: doc.y,
    }),
  );

  doc.moveDown(3);

  const dmcRoutingTitle = 'DMC Routing: TBD';
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
    title: 'Submission Type',
  });
  const submissionTypeTitle = 'Submission type:';
  submissionTypeSection.add(
    createHeading(doc, 'H3', config, submissionTypeTitle, {
      x: config.margins.left,
      y: doc.y,
      paragraphGap: 6,
    }),
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
    doc.struct('List', { title: 'Submission type' }, () => {
      doc
        .fontSize(config.text.size)
        .font(config.text.font)
        .list(
          selectedDebts.map(debt => `${debt.deductionCode} - ${debt.label}`),
          listOptions,
        );
    }),
  );

  submissionTypeSection.end();
  wrapper.add(submissionTypeSection);
  doc.moveDown();

  // =====================================
  // * VA Logo Fetch logo as base64 *
  // =====================================
  const response = await fetch('/img/design/logo/logo-black-and-white.png');
  const arrayBuffer = await response.arrayBuffer();
  const base64Image = `data:image/png;base64,${Buffer.from(
    arrayBuffer,
  ).toString('base64')}`;

  // right align logo
  const logoWidth = 150;
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
  doc.moveDown();
  // =====================================
  // * Submission details *
  // =====================================
  const { confirmationNumber, submissionDateTime } = submissionDetails;
  const submissionDate = format(submissionDateTime, 'MMMM d, yyyy');
  const submissionTimeET = format(submissionDateTime, "h:mm a 'ET'");

  const submissionDetailsSection = doc.struct('Sect', {
    title: 'Submission Type',
  });
  submissionDetailsSection.add(
    createHeading(doc, 'H3', config, 'Submission Details', {
      x: config.margins.left,
      y: doc.y,
      // paragraphGap: 12,
    }),
  );

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text('Date: ', { continued: true });
      doc.text(submissionDate || '');
    }),
  );

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text('Time: ', { continued: true });
      doc.text(submissionTimeET || '');
    }),
  );

  submissionDetailsSection.add(
    doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text('Confirmation number is ', { continued: true });
      doc.text(`${confirmationNumber || ''}.`);
    }),
  );

  submissionDetailsSection.end();
  wrapper.add(submissionDetailsSection);
  doc.moveDown();

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

  const veteranPersonalInformation = doc.struct('Sect', {
    title: "Veteran's personal information",
  });
  veteranPersonalInformation.add(
    createHeading(doc, 'H3', config, "Veteran's personal information", {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  // loop through all portions of the veteran name
  Object.keys(veteranFullName).forEach(key => {
    const nameLabel =
      key === 'suffix'
        ? 'Suffix'
        : `${key.charAt(0).toUpperCase() + key.slice(1)} name`;

    veteranPersonalInformation.add(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text(nameLabel);
        doc.font(config.text.font).text(veteranFullName[key] || '', {
          lineGap: 8,
        });
      }),
    );
    doc.moveDown();
  });

  // veteran dob
  const formattedDob = dob
    ? format(new Date(dob), 'MMMM d, yyyy')
    : 'Not provided';
  veteranPersonalInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Date of birth');
      doc.font(config.text.font).text(formattedDob, {
        lineGap: 8,
      });
    }),
  );

  veteranPersonalInformation.end();
  wrapper.add(veteranPersonalInformation);
  doc.moveDown();

  // =====================================
  // * Veteran identification information *
  // =====================================
  const veteranIdentificationInformation = doc.struct('Sect', {
    title: "Veteran's identification information",
  });
  veteranIdentificationInformation.add(
    createHeading(doc, 'H3', config, "Veteran's identification information", {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  veteranIdentificationInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Social Security number');
      doc.font(config.text.font).text('add masking thingy');
    }),
  );

  veteranIdentificationInformation.end();
  wrapper.add(veteranIdentificationInformation);
  doc.moveDown();

  // =====================================
  // * Veteran mailing address *
  // =====================================
  const {
    mailingAddress: {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      countryName,
      zipCode,
      stateCode,
    },
  } = veteran;
  const veteranMailingAddress = doc.struct('Sect', {
    title: "Veteran's mailing address",
  });
  veteranMailingAddress.add(
    createHeading(doc, 'H3', config, "Veteran's mailing address", {
      paragraphGap: 12,
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Country', config.margins.left, doc.y);
      doc.font(config.text.font).text(countryName || '', {
        lineGap: 8,
      });
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Street address', config.margins.left, doc.y);
      doc.font(config.text.font).text(addressLine1, {
        lineGap: 8,
      });
      if (addressLine2)
        doc.text(addressLine2, {
          lineGap: 8,
        });
      if (addressLine3)
        doc.text(addressLine3, {
          lineGap: 8,
        });
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('City');
      doc.font(config.text.font).text(city, {
        lineGap: 8,
      });
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('State', config.margins.left, doc.y);
      doc.font(config.text.font).text(stateCode, {
        lineGap: 8,
      });
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Postal code');
      doc.font(config.text.font).text(zipCode, {
        lineGap: 8,
      });
    }),
  );

  veteranMailingAddress.end();
  wrapper.add(veteranMailingAddress);
  doc.moveDown();

  // =====================================
  // * Veteran contact information *
  // =====================================
  const {
    email,
    mobilePhone: { phoneNumber, countryCode, areaCode, extension },
  } = veteran;
  const formattedPhoneNumber = `${countryCode || ''} ${areaCode ||
    ''} ${phoneNumber || ''}${extension ? ` ext. ${extension}` : ''}`;

  const veteranContactInformation = doc.struct('Sect', {
    title: "Veteran's contact information",
  });
  veteranContactInformation.add(
    createHeading(doc, 'H3', config, "Veteran's contact information", {
      paragraphGap: 12,
    }),
  );

  veteranContactInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Phone number');
      doc.font(config.text.font).text(formattedPhoneNumber, {
        lineGap: 8,
      });
    }),
  );

  veteranContactInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Email');
      doc.font(config.text.font).text(email, {
        lineGap: 8,
      });
    }),
  );

  veteranContactInformation.end();
  wrapper.add(veteranContactInformation);
  doc.moveDown();

  // =====================================
  // * Selected debts *
  // =====================================
  selectedDebts.forEach(debt => {
    const selectedDebtsSection = doc.struct('Sect', {
      title: debt.label,
    });
    selectedDebtsSection.add(
      createHeading(doc, 'H3', config, debt.label, {
        paragraphGap: 12,
      }),
    );

    selectedDebtsSection.add(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text('Dispute reason');
        doc.font(config.text.font).text(debt.disputeReason, {
          lineGap: 8,
        });
      }),
    );

    doc.moveDown();

    selectedDebtsSection.add(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text('Dispute statement');
        doc.font(config.text.font).text(debt.supportStatement, {
          lineGap: 8,
        });
      }),
    );

    selectedDebtsSection.end();
    wrapper.add(selectedDebtsSection);
    doc.moveDown();
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
