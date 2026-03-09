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
      size: 32,
    },
    H2: {
      font: 'Bitter-Bold',
      size: 14,
    },
  },
  paragraph: {
    font: 'SourceSansPro-Regular',
    size: 12,
  },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    size: 10,
  },
  disclaimer: {
    font: 'SourceSansPro-Regular',
    size: 11,
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
  // When using the new shared service, latestService is not required
  const requiredFields = data.useSharedService
    ? ['fullName']
    : ['fullName', 'latestService'];

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
  const heading = createHeading(doc, 'H1', config, 'Veteran Status Card', {
    x: doc.page.margins.left,
    paragraphGap: 10,
  });
  wrapper.add(heading);

  // description
  wrapper.add(
    doc.struct('P', () => {
      doc
        .font(config.paragraph.font)
        .fontSize(config.paragraph.size)
        .text(
          'This card makes it easy to prove your service and access Veteran discounts, all while keeping your personal information secure.',
          doc.page.margins.left,
          doc.y,
          {
            lineGap: 4,
            width: 520,
          },
        );
    }),
  );

  // veteran status card
  // Add content synchronously to ensure that reading order
  // is left intact for screen reader users.

  doc.moveDown(1.5);
  const cardSection = doc.struct('Sect');
  wrapper.add(cardSection);

  const cardYPosition = doc.y;
  const cardXPosition = doc.x;
  const cardWidth = 265;
  const cardHeight = 138;
  const cardPadding = 18;

  // Add a dotted line to indicate where the card should be cut out
  const cardWrapper = doc.struct('Artifact', () => {
    doc
      .lineWidth(0.5)
      .roundedRect(doc.page.margins.left, doc.y, cardWidth, cardHeight, 12)
      .dash(3.5, { space: 3.5 })
      .stroke();
  });

  cardSection.add(cardWrapper);

  // Card title
  const cardHeading = doc.struct('H2', () => {
    doc
      .font(config.headings.H2.font)
      .fontSize(config.headings.H2.size)
      .text(
        'Veteran Status Card',
        doc.page.margins.left + cardPadding,
        cardYPosition + 15,
      );
  });
  cardSection.add(cardHeading);

  // VA seal
  if (data.details.seal) {
    const sealGraphic = await fetchImage(data.details.seal.url);
    const sealWidth = 47;
    const sealImage = doc.image(
      sealGraphic,
      cardXPosition + 205,
      cardYPosition + 14,
      { width: sealWidth, alt: data.details.image.title },
    );
    const seal = doc.struct('Figure', { alt: data.details.seal.title }, [
      () => sealImage,
    ]);
    cardSection.add(seal);
  }

  const contentStartY = cardYPosition + 36;

  // Name section
  const nameHeader = doc.struct('H2', () => {
    doc
      .font(config.text.boldFont)
      .fontSize(config.text.size)
      .text('Name', doc.page.margins.left + cardPadding, contentStartY, {
        lineGap: 0,
      });
  });
  cardSection.add(nameHeader);

  const nameContent = doc.struct('P', () => {
    doc
      .font(config.text.font)
      .fontSize(config.text.size)
      .text(
        data.details.fullName,
        doc.page.margins.left + cardPadding,
        contentStartY + 13,
        { lineGap: 0 },
      );
  });
  cardSection.add(nameContent);

  // Latest period of service (only shown when not using shared service)
  if (!data.details.useSharedService && data.details.latestService) {
    const serviceHeader = doc.struct('H2', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text(
          'Latest period of service',
          doc.page.margins.left + cardPadding,
          contentStartY + 32,
          { lineGap: 0 },
        );
    });
    cardSection.add(serviceHeader);

    const serviceContent = doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          data.details.latestService,
          doc.page.margins.left + cardPadding,
          contentStartY + 48,
          { lineGap: 0 },
        );
    });
    cardSection.add(serviceContent);
  }

  // DOD ID Number and VA disability rating - side by side
  const dodRowY = contentStartY + 34;

  const dodHeader = doc.struct('H2', () => {
    doc
      .font(config.text.boldFont)
      .fontSize(config.text.size)
      .text('DoD ID Number', doc.page.margins.left + cardPadding, dodRowY, {
        lineGap: 0,
      });
  });
  cardSection.add(dodHeader);

  const dodValueY = dodRowY + 16;
  const dodContent = doc.struct('P', () => {
    doc
      .font(config.text.font)
      .fontSize(config.text.size)
      .text(
        data.details.edipi,
        doc.page.margins.left + cardPadding,
        dodValueY,
        { lineGap: 0 },
      );
  });
  cardSection.add(dodContent);

  // VA disability rating (second column, same row as DOD ID)
  if (
    data.details.totalDisabilityRating != null &&
    data.details.totalDisabilityRating >= 0
  ) {
    const ratingHeader = doc.struct('H2', () => {
      doc
        .font(config.text.boldFont)
        .fontSize(config.text.size)
        .text(
          'VA disability rating',
          doc.page.margins.left + cardPadding + 121,
          dodRowY,
          { lineGap: 0 },
        );
    });
    cardSection.add(ratingHeader);

    const ratingContent = doc.struct('P', () => {
      doc
        .font(config.text.font)
        .fontSize(config.text.size)
        .text(
          `${data.details.totalDisabilityRating}%`,
          doc.page.margins.left + cardPadding + 121,
          dodValueY,
          { lineGap: 0 },
        );
    });
    cardSection.add(ratingContent);
  }

  // Disclaimer text
  const disclaimerText = doc.struct('P', () => {
    doc
      .font(config.disclaimer.font)
      .fontSize(config.disclaimer.size)
      .text(
        "This card doesn't entitle you to any VA benefits.",
        doc.page.margins.left + cardPadding,
        cardYPosition + 113,
      );
  });
  cardSection.add(disclaimerText);

  // Instructions - position below the card
  const instructionY = cardYPosition + cardHeight + 25;
  const scissorsWidth = 10;
  if (data.details.scissors) {
    const scissorsGraphic = await fetchImage(data.details.scissors.url);
    const scissorsImage = doc.image(
      scissorsGraphic,
      doc.page.margins.left,
      instructionY,
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
        instructionY,
      );
  });
  wrapper.add(instructionText);

  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
