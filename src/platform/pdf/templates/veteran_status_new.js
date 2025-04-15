/**
 * Proof of Veteran Status PDF template.
 *
 * NB: The order in which items are added to the document is important,
 * and thus PDFKit requires performing operations synchronously.
 */
/* eslint-disable no-await-in-loop */

import { MissingFieldsException } from '../utils/exceptions/MissingFieldsException';
import {
  createAccessibleDoc,
  createHeading,
  registerVaGovFonts,
} from './utils';

const config = {
  margins: {
    top: 30,
    bottom: 40,
    left: 40,
    right: 40,
  },
  headings: {
    H1: {
      font: 'Bitter-Bold',
      size: 20,
    },
    H2: {
      font: 'SourceSansPro-Bold',
      size: 13,
    },
  },
  paragraph: {
    font: 'SourceSansPro-Regular',
    size: 16,
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 9,
  },
  disclaimer: {
    font: 'SourceSansPro-Regular',
    size: 9,
  },
  instruction: {
    font: 'SourceSansPro-Regular',
    size: 12,
  },
};

// Reusable function to fetch and return an image as a base64 data URL
const fetchImage = async url => {
  const fetchedImage = await fetch(url);
  const contentType = fetchedImage.headers.get('Content-type');
  const base64Data = Buffer.from(await fetchedImage.arrayBuffer()).toString(
    'base64',
  );
  return `data:${contentType};base64,${base64Data}`;
};

const validate = data => {
  const requiredFields = ['fullName', 'latestService']; // If there is no latestService, there is also no DoD ID

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

  // VA logo
  if (data.details.image) {
    const logoGraphic = await fetchImage(data.details.image.url);

    const logoImage = doc.image(
      logoGraphic,
      doc.page.margins.left,
      doc.page.margins.top,
      { width: 155, alt: data.details.image.title },
    );

    const logo = doc.struct('Figure', { alt: data.details.image.title }, [
      () => logoImage,
    ]);

    wrapper.add(logo);
  }

  doc.moveDown(0.5);

  // Heading
  const heading = createHeading(
    doc,
    'H1',
    config,
    'Proof of Veteran status card',
    {
      x: doc.page.margins.left,
      paragraphGap: 10,
    },
  );
  wrapper.add(heading);

  // description
  wrapper.add(
    doc.struct('P', () => {
      doc
        .font(config.paragraph.font)
        .fontSize(config.paragraph.size)
        .text(
          'You can use your Veteran status card to get discounts at stores, businesses, and restaurants.',
          doc.page.margins.left,
          doc.y,
          {
            lineGap: 4,
            width: 450,
          },
        );
    }),
  );

  // veteran status card
  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  doc.moveDown(1);
  const cardSection = doc.struct('Sect');
  wrapper.add(cardSection);

  const cardYPosition = doc.y;
  const cardXPosition = doc.x;
  const cardWidth = 252; // roughly results in a 2 x 3.5 inch rectangle
  const cardHeight = 144;
  const cardPadding = 12;

  // Add a dotted line to indicate where the card should be cut out
  const cardWrapper = doc.struct('Artifact', () => {
    doc
      .lineWidth(0.5)
      .roundedRect(doc.page.margins.left, doc.y, cardWidth, cardHeight, 8)
      .dash(3.5, { space: 3.5 })
      .stroke();
  });

  cardSection.add(cardWrapper);

  // Card title
  doc.moveDown(0.5);
  const cardHeading = doc.struct('H2', () => {
    doc
      .font(config.headings.H2.font)
      .fontSize(config.headings.H2.size)
      .text(
        'Proof of Veteran Status',
        doc.page.margins.left + cardPadding,
        doc.y,
      );
  });
  cardSection.add(cardHeading);

  // VA seal
  if (data.details.seal) {
    const sealGraphic = await fetchImage(data.details.seal.url);
    const sealWidth = 40;
    const sealImage = doc.image(
      sealGraphic,
      cardXPosition + cardWidth - cardPadding - sealWidth, // positioned relative to top-right corner
      cardYPosition + cardPadding,
      { width: sealWidth, alt: data.details.image.title },
    );
    const seal = doc.struct('Figure', { alt: data.details.seal.title }, [
      () => sealImage,
    ]);
    cardSection.add(seal);
  }

  // First column of info items
  doc.moveDown(0.25);
  const infoItems = [
    {
      heading: 'Name',
      content: data.details.fullName,
    },
    {
      heading: 'Latest period of service',
      content: `${data.details.latestService}`,
    },
    {
      heading: 'DoD ID Number',
      content: data.details.edipi,
    },
  ];

  let lastHeaderY;
  infoItems.forEach(item => {
    lastHeaderY = doc.y;
    const header = doc.struct('H2', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text(`${item.heading}`);
    });
    const content = doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(item.content)
        .moveDown(0.5);
    });
    cardSection.add(header);
    cardSection.add(content);
  });

  // Second column of info items
  const infoItems2 = [
    {
      heading: 'VA disability rating',
      content: `${data.details.totalDisabilityRating?.toString()}%`,
      condition: data.details.totalDisabilityRating,
    },
  ];
  infoItems2.forEach(item => {
    if (item.condition) {
      const header = doc.struct('H2', () => {
        doc
          .font(config.text.boldFont)
          .fontSize(config.text.size)
          .text(`${item.heading}`, doc.page.margins.left + 130, lastHeaderY);
      });
      const content = doc.struct('P', () => {
        doc
          .font(config.text.font)
          .fontSize(config.text.size)
          .text(item.content)
          .moveDown(0.5);
      });
      cardSection.add(header);
      cardSection.add(content);
    }
  });

  doc.moveDown(0.5);

  // Disclaimer text
  const disclaimerText = doc.struct('P', () => {
    doc
      .font(config.disclaimer.font)
      .fontSize(config.disclaimer.size)
      .text(
        "This card doesn't entitle you to any VA benefits.",
        doc.page.margins.left + cardPadding,
        cardYPosition + cardHeight - cardPadding - config.disclaimer.size, // position this text relative to the bottom of the card
      );
  });
  cardSection.add(disclaimerText);

  // Instructions
  doc.moveDown(3);
  const scissorsWidth = 10;
  if (data.details.scissors) {
    const scissorsGraphic = await fetchImage(data.details.scissors.url);
    const scissorsImage = doc.image(
      scissorsGraphic,
      doc.page.margins.left,
      doc.y,
      { width: scissorsWidth },
    );
    const scissors = doc.struct(
      'Figure',
      { alt: data.details.scissors.title },
      [() => scissorsImage],
    );
    wrapper.add(scissors);
  }

  const instructionText = doc.struct('P', () => {
    doc
      .font(config.instruction.font)
      .fontSize(config.instruction.size)
      .text(
        'Cut this card out and keep in your wallet.',
        doc.page.margins.left + scissorsWidth + 4,
        doc.y - scissorsWidth - 3, // position this text relative to the bottom of the card
      );
  });
  wrapper.add(instructionText);

  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
