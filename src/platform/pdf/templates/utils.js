/**
 * Template utils.
 */
import { unset } from 'lodash';
import { knownFonts, registerFonts } from '../registerFonts';

const pdfkit = require('pdfkit');

// Handle both node and browser environments.
const PDFDocument = pdfkit.default ?? pdfkit;

/**
 * Return the current X position, limited to the configured page margins.
 *
 * @param {Object} doc
 *
 * @returns {int} x position
 */
const getBoundedXPosition = doc => {
  if (doc.x < doc.page.margins.left) return doc.page.margins.left;

  const rightMargin = doc.page.width - doc.page.margins.right;
  if (doc.x > rightMargin) return rightMargin;

  return doc.x;
};

/**
 * Return the current Y position, limited to the configured page margins.
 *
 * @param {Object} doc
 *
 * @returns {int} y position
 */
const getBoundedYPosition = doc => {
  if (doc.y < doc.page.margins.top) return doc.page.margins.top;

  const bottomMargin = doc.page.height - doc.page.margins.bottom;
  if (doc.y > bottomMargin) return bottomMargin;

  return doc.y;
};

/**
 * Return the given font name, or if it doesn't exist, a safe default.
 *
 * @param {string} font
 *
 * @returns {string} safe font name
 */
const getSafeFont = font => {
  return knownFonts[font] ? font : 'SourceSansPro-Regular';
};

/**
 * Add a structure to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} struct
 * @param {string} font
 * @param {int} fontSize
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
export const createStruct = (doc, struct, font, fontSize, text, options) => {
  const x = options.x ?? getBoundedXPosition(doc);
  const y = options.y ?? getBoundedYPosition(doc);
  unset(options.x);
  unset(options.y);

  return doc.struct(struct, () => {
    doc
      .font(getSafeFont(font))
      .fontSize(fontSize)
      .text(text, x, y, options);
  });
};

/**
 * Add a horizontal rule to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {int} spaceFromEdge How far the right and left sides should be away from the edge (in px)
 * @param {int} linesAbove How much space should be above the HR (in lines)
 * @param {int} linesBelow How much space should be below the HR (in lines)
 *
 * @returns {Object}
 */
const addHorizontalRule = (
  doc,
  spaceFromEdge = 0,
  linesAbove = 0.5,
  linesBelow = 0.5,
) => {
  doc.markContent('Artifact');
  doc.moveDown(linesAbove);
  doc
    .moveTo(0 + spaceFromEdge, doc.y)
    .lineTo(doc.page.width - spaceFromEdge, doc.y)
    .stroke();

  doc.moveDown(linesBelow);
  doc.endMarkedContent();
  return doc;
};

/**
 * Add a span struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSpan = (doc, config, text, options) => {
  return createStruct(
    doc,
    'Span',
    config.text.font,
    config.text.size,
    text,
    options,
  );
};

/**
 * Add a text artifact struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createArtifactText = (doc, config, text, options) => {
  return createStruct(
    doc,
    'Artifact',
    config.text.font,
    config.text.size,
    text,
    options,
  );
};

/**
 * Generates Header Banner
 *
 * @param {Object} doc
 * @param {Object} header header struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateHeaderBanner = async (doc, header, data, config) => {
  const regularFaceFont = getSafeFont(config.text.font);
  const boldFaceFont = getSafeFont(config.text.boldFont);

  // eslint-disable-next-line no-param-reassign
  doc.page.margins = {
    top: 0,
    bottom: 0,
    left: 16.5,
    right: 16.5,
  };
  doc.moveDown(1);
  const currentHeight = doc.y;

  // Calculate text width
  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font = element.weight === 'bold' ? boldFaceFont : regularFaceFont;
    doc.font(getSafeFont(font));
    doc.fontSize(config.text.size);
  }

  // This math is based on US Letter page size and will have to be adjusted
  // if we ever offer document size as a parameter.
  const leftMargin = 22;

  for (let i = 0; i < data.headerBanner.length; i += 1) {
    const element = data.headerBanner[i];
    const font = element.weight === 'bold' ? boldFaceFont : regularFaceFont;
    const paragraphOptions = {};
    if (i < data.headerBanner.length) {
      paragraphOptions.continued = true;
    }

    header.add(
      doc.struct('Span', () => {
        doc
          .font(getSafeFont(font))
          .fontSize(config.text.size)
          .text(element.text, leftMargin, doc.y, paragraphOptions);
      }),
    );
  }

  const height = doc.y - currentHeight + 25;

  doc.rect(16.5, currentHeight - 4, 580, height).stroke();

  doc.moveDown(config.headerGap ?? 3);

  // This is an ugly hack that resets the document X position
  // so that the document header is shown correctly.
  header.add(
    doc.struct('Artifact', () => {
      doc.text('', config.margins.left, doc.y);
    }),
  );
};

/**
 * Generates Initial Header Content
 *
 * @param {Object} doc
 * @param {Object} parent parent struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateInitialHeaderContent = async (
  doc,
  parent,
  data,
  config,
  options = {},
) => {
  const { headerBannerOnly, nameDobOnly } = options;
  // Adjust page margins so that we can write in the header/footer area.
  // eslint-disable-next-line no-param-reassign
  doc.page.margins = {
    top: 0,
    bottom: 0,
    left: config.margins.left,
    right: config.margins.right,
  };

  const header = doc.struct('Div', {
    type: 'Pagination',
    title: 'Header',
    attached: 'Top',
  });
  parent.add(header);

  if (!headerBannerOnly) {
    const leftOptions = { continued: true, x: config.margins.left, y: 12 };
    header.add(createSpan(doc, config, data.headerLeft, leftOptions));
    const rightOptions = { align: 'right' };
    header.add(createSpan(doc, config, data.headerRight, rightOptions));
  }

  if (data.headerBanner && !nameDobOnly) {
    generateHeaderBanner(doc, header, data, config);
  }

  header.end();

  // eslint-disable-next-line no-param-reassign
  doc.page.margins = config.margins;
};

/**
 * Generates Final Header Content
 *
 * @param {Object} doc
 * @param {Object} data PDF data
 * @param {Object} config layout config
 *
 * @returns {void}
 */
const generateFinalHeaderContent = async (doc, data, config, startPage = 1) => {
  const pages = doc.bufferedPageRange();
  for (let i = startPage; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins so that we can write in the header/footer area.
    // eslint-disable-next-line no-param-reassign
    doc.page.margins = {
      top: 0,
      bottom: 0,
      left: config.margins.left,
      right: config.margins.right,
    };

    doc.markContent('Artifact');
    doc
      .font(getSafeFont(config.text.font))
      .fontSize(config.text.size)
      .text(data.headerLeft, config.margins.left, 12);
    doc.text(data.headerRight, config.margins.right, 12, { align: 'right' });
    doc.endMarkedContent();
  }
};

/**
 * Generates Footer Content
 *
 * @param {Object} doc
 * @param {Object} parent parent struct
 * @param {Object} data PDF data
 * @param {Object} config layout config
 * @param {Boolean} addSeparator line separating footer from content
 *
 * @returns {void}
 */
const generateFooterContent = async (
  doc,
  parent,
  data,
  config,
  addSeparator = false,
) => {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);

    // Adjust page margins so that we can write in the header/footer area.
    // eslint-disable-next-line no-param-reassign
    doc.page.margins = {
      top: 0,
      bottom: 0,
      left: config.margins.left,
      right: config.margins.right,
    };
    if (addSeparator) {
      doc.markContent('Artifact');
      doc
        .moveTo(config.margins.left, 766 - 12)
        .lineTo(doc.page.width - config.margins.right, 766 - 12)
        .stroke();
      doc.endMarkedContent();
    }
    // Only allow the last footer element to be read by screen readers
    const footer =
      i === pages.count - 1
        ? doc.markStructureContent('Div')
        : doc.markContent('Artifact');

    let footerRightText = data.footerRight.replace('%PAGE_NUMBER%', i + 1);
    footerRightText = footerRightText.replace('%TOTAL_PAGES%', pages.count);

    doc
      .font(getSafeFont(config.text.font))
      .fontSize(config.text.size)
      .text(data.footerLeft, config.margins.left, 766);
    doc.text(footerRightText, config.margins.left, 766, { align: 'right' });

    doc.endMarkedContent();

    // only structural content needs to be added to parent
    if (i === pages.count - 1) {
      parent.add(footer);
    }
  }
};

/**
 * Add a details item to the given PDFKit structure element.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {int} Y position
 * @param {Object} item
 *
 * @returns {Object} doc
 */
const createDetailItem = async (doc, config, x, item) => {
  const paragraphOptions = { lineGap: item.lineGap ?? 2 };
  let titleText = item.title ?? '';
  const content = [];
  const regularFaceFont = getSafeFont(config.text.font);
  const boldFaceFont = getSafeFont(config.text.boldFont);
  const monospaceFont = getSafeFont(config.text.monospaceFont);
  if (item.inline === true) {
    paragraphOptions.continued = true;
    titleText += ': ';
    content.push(
      doc.struct('P', () => {
        doc
          .font(boldFaceFont)
          .fontSize(config.text.size)
          .text(titleText, x, doc.y, paragraphOptions);
        doc
          .font(item.monospace ? monospaceFont : regularFaceFont)
          .fontSize(config.text.size)
          .text(item.value);
      }),
    );
  } else {
    const blockValueOptions = { lineGap: item.lineGap ?? 2 };
    paragraphOptions.lineGap = 2;
    if (titleText) {
      titleText += ' ';
      content.push(
        doc.struct('P', () => {
          doc
            .font(boldFaceFont)
            .fontSize(config.text.size)
            .text(titleText, x, doc.y, paragraphOptions);
        }),
      );
    }
    content.push(
      doc.struct('P', () => {
        doc
          .font(item.monospace ? monospaceFont : regularFaceFont)
          .fontSize(config.text.size)
          .text(item.value, x, doc.y, blockValueOptions);
      }),
    );
  }

  return content;
};

/**
 * Add a rich text details item to the given PDFKit structure element (inline is always false)
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {Object} item
 *
 * @returns {Array} content
 */
const createRichTextDetailItem = async (doc, config, x, item) => {
  const regularFaceFont = getSafeFont(config.text.font);
  const boldFaceFont = getSafeFont(config.text.boldFont);

  let titleText = item.title ?? '';
  const content = [];

  if (titleText) {
    titleText += ' ';
    content.push(
      doc.struct('P', () => {
        doc
          .font(boldFaceFont)
          .fontSize(config.text.size)
          .text(titleText, x, doc.y, {
            lineGap: 2,
            paragraphGap: item.paragraphGap ?? 2,
          });
      }),
    );
  }

  for (let i = 0; i < item.value.length; i += 1) {
    const element = item.value[i];
    let elementTitleText = element.title ?? '';
    const font = element.weight === 'bold' ? boldFaceFont : regularFaceFont;
    const paragraphOptions = {
      continued: !!element.continued,
      lineGap: item.lineGap || 2,
      ...(i === item.value.length - 1 && {
        paragraphGap: element?.paragraphGap ?? 2,
      }),
    };

    if (element?.itemSeperator) {
      if (doc.y > doc.page.height - doc.page.margins.bottom) {
        // eslint-disable-next-line no-await-in-loop
        await doc.addPage();
      }
      addHorizontalRule(doc, ...Object.values(element.itemSeperatorOptions));
    }

    if (Array.isArray(element.value)) {
      if (element.value.every(val => val.label)) {
        // Create a List container and add LI items to it.
        const listContainer = doc.struct('List');
        element.value.forEach(record => {
          const li = doc.struct('LI', () => {
            // Save the current x
            const originalX = doc.x;
            // Adjust the x coordinate:
            // eslint-disable-next-line no-param-reassign
            doc.x = config.indents.one;
            doc
              .font(boldFaceFont)
              .fontSize(config.text.size)
              .text(`${record.label}: `, { continued: true })
              .font(regularFaceFont)
              .fontSize(config.text.size)
              .text(record.value);
            // Restore the original x coordinate.
            // eslint-disable-next-line no-param-reassign
            doc.x = originalX;
          });
          listContainer.add(li);
        });
        // Add the list container to the section.
        // infoSection.add(listContainer);
        content.push(listContainer);
      } else {
        content.push(
          doc.struct('List', () => {
            doc.font(font).list(element.value, {
              ...paragraphOptions,
              listType: 'bullet',
              bulletRadius: 2,
              indent: element.indent ?? 15,
              baseline: 'hanging',
            });
          }),
        );
      }
    } else if (element.title) {
      elementTitleText += ': ';
      content.push(
        doc.struct('P', () => {
          doc
            .font(boldFaceFont)
            .fontSize(config.text.size)
            .text(elementTitleText, x, doc.y, {
              ...paragraphOptions,
              continued: true,
              indent: element.indent ?? 15,
            });
          doc
            .font(regularFaceFont)
            .fontSize(config.text.size)
            .text(element.value);
        }),
      );
    } else {
      content.push(
        doc.struct('Span', () => {
          doc
            .font(element?.font ?? font)
            .fontSize(config.text.size)
            .text(element.value, x, doc.y, paragraphOptions);
        }),
      );
    }
  }

  return content;
};

/**
 * Add an image item to the given PDFKit structure element.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {int} X position
 * @param {Object} item
 *
 * @returns {Object}
 */
const createImageDetailItem = async (doc, config, x, item) => {
  let titleText = item.title ?? '';
  const content = [];

  if (titleText) {
    titleText += ' ';
    content.push(
      doc.struct('P', () => {
        doc
          .font(getSafeFont(config.text.boldFont))
          .fontSize(getSafeFont(config.text.size))
          .text(titleText, x, doc.y, { lineGap: 2 });
      }),
    );
  }
  let image = item.value.value;
  if (!item.value.isBase64) {
    const fetchedImage = await fetch(item.value.value);
    const contentType = fetchedImage.headers.get('Content-type');
    const imageBuffer = await fetchedImage.arrayBuffer();
    image = `data:${contentType};base64,${Buffer.from(imageBuffer).toString(
      'base64',
    )}`;
  }

  content.push(
    doc.struct('P', () => {
      doc.moveDown(0.5);
      doc.image(image, x, doc.y, item.value?.options);
      doc.moveDown(0.5);
    }),
  );

  return content;
};

/**
 * Add a heading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {string} headingLevel
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createHeading = (doc, headingLevel, config, text, options) => {
  return createStruct(
    doc,
    headingLevel,
    config.headings[headingLevel].font,
    config.headings[headingLevel].size,
    text,
    options,
  );
};

/**
 * Add a subHeading struct to the given PDFKit document.
 *
 * @param {Object} doc
 * @param {Object} config
 * @param {string} text
 * @param {Object} options
 *
 * @returns {Object} doc
 */
const createSubHeading = (doc, config, text, options) => {
  return createStruct(
    doc,
    'P',
    options.font || config.subHeading.font,
    options.size || config.subHeading.size,
    text,
    options,
  );
};

/**
 * Estimate a text block's height.
 *
 * @param {Object} doc
 * @param {Object} item
 * @param {boolean} initialBlock Whether or not this is the first block in the list.
 *
 * @returns {int}
 */
const getTestResultBlockHeight = (doc, item, initialBlock = false) => {
  let height = 0;

  // Account for height of horizontal rule.
  if (!initialBlock) {
    height += 16;
  }

  if (item.header) {
    height += 36;
  }

  item.items.forEach(resultItem => {
    // This is a gross hack that's necessary because the heightOfString doesn't always
    // return the correct height. See e.g. https://github.com/foliojs/pdfkit/issues/1438
    // TODO: account for longer lines.
    height += 24;
    if (resultItem.inline === false) {
      height += 24;
    }
    /**
     * Potential improved solution if issues with heightOfString are fixed:
     *
    if (resultItem.inline === true) {
      height += doc.heightOfString(`${resultItem.title}: ${resultItem.value}`, 44, 0, {
        // Using regular weight is a bit of a fudge but should be
        // more accurate than using bold for the whole string.
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    } else {
      height += doc.heightOfString(`${resultItem.title}`, 44, 0, {
        font: 'SourceSansPro-Bold',
        fontSize: 16,
        lineGap: 0,
      });
      height += doc.heightOfString(resultItem.value, 44, 0, {
        font: 'SourceSansPro-Regular',
        fontSize: 16,
        lineGap: 0,
      });
    }
    */
  });

  return height;
};

/**
 * Create a PDFKit document with the correct parameters set for accessibility.
 *
 * @param {string} title
 *
 * @returns {Object}
 */
const createAccessibleDoc = (data, config) => {
  return new PDFDocument({
    pdfVersion: '1.7',
    lang: data.lang ?? 'en-US',
    tagged: true,
    displayTitle: true,
    info: {
      Author: data.author ?? 'Department of Veterans Affairs',
      Subject: data.subject ?? '',
      Title: data.title,
    },
    autoFirstPage: false,
    bufferPages: true,
    margins: config.margins,
  });
};

/**
 * Register the custom fonts used for VA.gov to the given PDFKit document.
 *
 * @param {Object} doc
 *
 * @returns {void}
 */
const registerVaGovFonts = async doc => {
  await registerFonts(doc, [
    'Bitter-Bold',
    'Bitter-Regular',
    'SourceSansPro-Bold',
    'SourceSansPro-Regular',
    'RobotoMono-Regular',
  ]);
};

/**
 * Draw a semantic List struct with perfectly centered bullets.
 *
 * @param {Object} section     The parent struct (e.g. infoSection)
 * @param {PDFDocument} doc
 * @param {string[]} items     Array of list‐item strings
 * @param {Object} config      Your layout config (for fonts, indents, margins)
 * @param {Object} [opts]
 * @param {number} [opts.bulletRadius=2]
 * @param {number} [opts.bulletIndent=config.indents.one]
 * @param {number} [opts.paragraphGap=4]
 * @param {number} [opts.textOffset=4]
 */
export const addBulletList = (
  section,
  doc,
  items,
  config,
  {
    bulletRadius = 2,
    bulletIndent = config.margins.left,
    paragraphGap = 4,
    textOffset = 4, // space after the bullet
  } = {},
) => {
  // wrap everything in a List struct for accessibility
  section.add(
    doc.struct('List', () => {
      // set the font/size once
      doc.font(getSafeFont(config.text.font)).fontSize(config.text.size);

      // grab safe starting coords
      const startX = getBoundedXPosition(doc);
      let y = getBoundedYPosition(doc);

      items.forEach(text => {
        const lineHeight = doc.currentLineHeight();
        const centerY = y + lineHeight / 2;

        // draw the bullet
        doc.circle(startX + bulletIndent, centerY, bulletRadius).fill('black');

        // draw & wrap the text
        const textX = startX + bulletIndent + bulletRadius * 2 + textOffset;
        const maxWidth = doc.page.width - doc.page.margins.right - textX;
        doc.text(text, textX, y, { width: maxWidth });

        // move down for next item
        y += lineHeight + paragraphGap;
      });

      // update cursor for whatever comes next
      // eslint-disable-next-line no-param-reassign
      doc.y = y;
    }),
  );
};

export {
  addHorizontalRule,
  createAccessibleDoc,
  createArtifactText,
  createDetailItem,
  createRichTextDetailItem,
  createHeading,
  createSpan,
  createSubHeading,
  getTestResultBlockHeight,
  registerVaGovFonts,
  createImageDetailItem,
  generateHeaderBanner,
  generateInitialHeaderContent,
  generateFinalHeaderContent,
  generateFooterContent,
};
