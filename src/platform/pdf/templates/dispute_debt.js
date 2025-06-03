import { format } from 'date-fns';
import {
  createAccessibleDoc,
  createHeading,
  registerVaGovFonts,
  generateFooterContent,
  generateInitialHeaderContent,
} from './utils';

// GH docs source:
// https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/benefits-memorials-2/engineering/front-end/architecture/static-codes.md
// let's try and keep these values updated there so it's easier for stakeholders to check them
export const deductionCodes = Object.freeze({
  '11': 'Post-9/11 GI Bill debt for books and supplies',
  '12': 'Post-9/11 GI Bill debt for books and supplies',
  '13': 'Post-9/11 GI Bill debt for books and supplies',
  '14': 'Post-9/11 GI Bill debt for books and supplies',
  '15': 'Post-9/11 GI Bill debt for books and supplies',
  '16': 'Post-9/11 GI Bill debt for housing',
  '17': 'Post-9/11 GI Bill debt for housing',
  '18': 'Post-9/11 GI Bill debt for housing',
  '19': 'Post-9/11 GI Bill debt for housing',
  '20': 'Post-9/11 GI Bill debt for housing',
  '27': 'Post-9/11 GI Bill debt for books and supplies',
  '28': 'Post-9/11 GI Bill debt for books and supplies',
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '48': 'Post-9/11 GI Bill debt for housing',
  '49': 'Post-9/11 GI Bill debt for housing',
  '50': 'Post-9/11 GI Bill debt for housing',
  '51': 'Post-9/11 GI Bill debt for housing',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '73': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
  '76': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '77': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '78': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '79': 'Education Ch 33-Ch1606/Ch30 Kickers',
});

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
// validate data
// Get confirmation number
// handle page breaks with sections
//

const generate = async (data = {}, config = defaultConfig) => {
  // const downloadDate = format(new Date(), 'MM/dd/yyyy');
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

  const { selectedDebts, veteran } = data;

  const headerData = {
    headerLeft: '',
    headerRight: '',
    footerLeft: 'VA.gov',
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    ...data,
  };

  await generateInitialHeaderContent(doc, wrapper, headerData, config);

  // =====================================
  // * H1 Title Section *
  // =====================================
  const titleSection = doc.struct('Sect', {
    title: 'Title',
  });
  titleSection.add(
    createHeading(doc, 'H1', config, 'Debt dispute from VA.gov', {
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );
  titleSection.end();
  wrapper.add(titleSection);
  doc.moveDown();

  // =====================================
  // * VA Logo Fetch logo as base64 *
  // =====================================
  const response = await fetch('/img/design/logo/logo-black-and-white.png');
  const arrayBuffer = await response.arrayBuffer();
  const base64Image = `data:image/png;base64,${Buffer.from(
    arrayBuffer,
  ).toString('base64')}`;
  const logoWidth = 125;

  // right align logo
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
          .text(nameLabel, config.margins.left, doc.y);
        doc
          .font(config.text.font)
          .text(veteranFullName[key] || '', config.margins.left);
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
        .text('Date of birth', config.margins.left, doc.y);
      doc.font(config.text.font).text(formattedDob, config.margins.left);
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
        .text('Social Security number', config.margins.left, doc.y);
      doc
        .font(config.text.font)
        .text('add masking thingy', config.margins.left);
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
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Country', config.margins.left, doc.y);
      doc.font(config.text.font).text(countryName || '', config.margins.left);
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Street address', config.margins.left, doc.y);
      doc.font(config.text.font).text(addressLine1, config.margins.left);
      if (addressLine2) doc.text(addressLine2, config.margins.left);
      if (addressLine3) doc.text(addressLine3, config.margins.left);
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('City', config.margins.left, doc.y);
      doc.font(config.text.font).text(city, config.margins.left);
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('State', config.margins.left, doc.y);
      doc.font(config.text.font).text(stateCode, config.margins.left);
    }),
  );

  veteranMailingAddress.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Postal code', config.margins.left, doc.y);
      doc.font(config.text.font).text(zipCode, config.margins.left);
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
      x: config.margins.left,
      paragraphGap: 12,
    }),
  );

  veteranContactInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Phone number', config.margins.left, doc.y);
      doc
        .font(config.text.font)
        .text(formattedPhoneNumber, config.margins.left);
    }),
  );

  veteranContactInformation.add(
    doc.struct('P', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text('Email', config.margins.left, doc.y);
      doc.font(config.text.font).text(email, config.margins.left);
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
        x: config.margins.left,
        paragraphGap: 12,
      }),
    );

    selectedDebtsSection.add(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text('Dispute reason', config.margins.left, doc.y);
        doc
          .font(config.text.font)
          .text(debt.disputeReason, config.margins.left);
      }),
    );

    doc.moveDown();

    selectedDebtsSection.add(
      doc.struct('P', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text('Dispute statement', config.margins.left, doc.y);
        doc
          .font(config.text.font)
          .text(debt.supportStatement, config.margins.left);
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
