/**
 * Proof of Veteran Status PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import moment from 'moment';
import { MissingFieldsException } from '../utils/exceptions/MissingFieldsException';

import { createAccessibleDoc, registerVaGovFonts } from './utils';

const config = {
  margins: {
    top: 30,
    bottom: 30,
    left: 15,
    right: 15,
  },
  headings: {
    H1: {
      font: 'Bitter-Bold',
      size: 10.5,
    },
    H2: {
      font: 'SourceSansPro-Bold',
      size: 7.5,
    },
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 7.5,
    disclaimerTextSize: 6.75,
  },
};

const validate = data => {
  const requiredFields = ['fullName', 'serviceHistory', 'dob'];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length) {
    throw new MissingFieldsException(missingFields);
  }
};

const generate = async data => {
  validate(data.details);

  const doc = createAccessibleDoc(data, config);

  await registerVaGovFonts(doc);

  doc.addPage({ margins: config.margins });

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  // Add a dotted line to indicate where the card should be cut out
  const cardWrapper = doc.struct('Artifact', () => {
    doc
      .roundedRect(75, 75, 252, 144, 5) // roughly results in a 2 x 3.5 inch rectangle
      .dash(5, { space: 5 })
      .stroke();
  });

  wrapper.add(cardWrapper);

  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  // VA logo
  if (data.details.image) {
    const fetchedImage = await fetch(data.details.image.url);
    const contentType = fetchedImage.headers.get('Content-type');

    const image = doc.image(
      `data:${contentType};base64,${Buffer.from(
        await fetchedImage.arrayBuffer(),
      ).toString('base64')}`,
      206,
      79,
      { width: 112, alt: data.details.image.title },
    );

    const logo = doc.struct('Figure', { alt: data.details.image.title }, [
      () => image,
    ]);

    wrapper.add(logo);
  }

  // Name
  const name = doc.struct('H1', () => {
    doc
      .font(config.headings.H1.font)
      .fontSize(config.headings.H1.size)
      .text(data.details.fullName, 82, 86, { width: 112 });
  });

  wrapper.add(name);

  // DOB
  if (data.details.dob) {
    const dateOfBirthHeader = doc.struct('H2', () => {
      doc
        .font(config.headings.H2.font)
        .fontSize(config.headings.H2.size)
        .text('Date of birth: ', 82, 120);
    });
    const dateOfBirth = doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(data.details.dob)
        .moveDown(0.75);
    });

    wrapper.add(dateOfBirthHeader);
    wrapper.add(dateOfBirth);
  }

  // Disability rating
  if (data.details.totalDisabilityRating) {
    const drHeader = doc.struct('H2', () => {
      doc
        .font(config.headings.H2.font)
        .fontSize(config.headings.H2.size)
        .text('Disability rating: ');
    });
    const dr = doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          `${data.details.totalDisabilityRating.toString()}% service connected`,
        )
        .moveDown(1.5);
    });

    wrapper.add(drHeader);
    wrapper.add(dr);
  }

  // Service History
  const serviceHistory = doc.struct('H2', () => {
    doc
      .font(config.headings.H2.font)
      .fontSize(config.headings.H2.size)
      .text('Period of service', 195, 120)
      .moveDown(0.5);
  });

  wrapper.add(serviceHistory);

  const serviceList = doc.struct('L');

  data.details.serviceHistory.slice(0, 2).forEach(item => {
    const formattedBeginDate = item.beginDate
      ? moment(item.beginDate).format('LL')
      : '';
    const formattedEndDate = item.endDate
      ? moment(item.endDate).format('LL')
      : '';
    const dateRange =
      formattedBeginDate.length || formattedEndDate.length
        ? `${formattedBeginDate} – ${formattedEndDate}`
        : '';

    const listItem = doc.struct('LI');

    const listLabel = doc.struct('Lbl', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(item.branchOfService);
    });
    listItem.add(listLabel);

    const listBody = doc.struct('LBody', () => {
      doc.text(dateRange).moveDown(0.75);
    });
    listItem.add(listBody);

    serviceList.add(listItem);
  });

  wrapper.add(serviceList);

  // disclaimer text
  const disclaimerText = doc.struct('P', () => {
    doc
      .font(config.text.font)
      .fontSize(config.text.disclaimerTextSize)
      .text(
        "You can use this Veteran status to prove you served in the United States Uniformed Services. This status doesn't entitle you to any VA benefits.",
        82,
        187,
        {
          width: 247,
        },
      );
  });

  wrapper.add(disclaimerText);

  wrapper.end();

  doc.flushPages();
  return doc;
};

export { generate };
