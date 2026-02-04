import { createHeading } from '../../templates/utils';

export const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 65, right: 65 },
  text: {
    boldFont: 'SourceSansPro-Bold',
    font: 'SourceSansPro-Regular',
    monospaceFont: 'RobotoMono-Regular',
    size: 12,
    labelColor: '#757575',
    valueColor: '#000000',
    linkColor: '#0071BC',
  },
  headings: {
    H1: { font: 'Bitter-Bold', size: 30 },
    H2: { font: 'Bitter-Bold', size: 24 },
    H3: { font: 'Bitter-Bold', size: 16 },
    H4: { font: 'Bitter-Bold', size: 14 },
    H5: { font: 'Bitter-Bold', size: 12 },
  },
  graphicColors: {
    greenBar: '#00A91C',
    lightBlueBar: '#D9E8F6',
    horizontalLine: '#005EA2',
  },
};

/** Creates a labeled field with gray label and black value * */
export const createLabeledField = (doc, config, label, value, options = {}) => {
  const { lineGapLabel = 5, lineGapValue = 12 } = options;

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
export const addLabeledField = (
  section,
  doc,
  config,
  label,
  value,
  options = {},
) => {
  section.add(createLabeledField(doc, config, label, value, options));
};

/** Creates a section with heading and labeled fields * */
export const createFieldSection = (doc, wrapper, config, title, fields) => {
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

/** Adds a clickable phone number */
export const addPhone = (doc, phone, config) => {
  doc
    .fillColor(config.text.linkColor)
    .text(phone.number, {
      link: `tel:${phone.tel}`,
      underline: true,
      continued: true,
    })
    .fillColor(config.text.valueColor);
};

/** Adds a clickable TTY number */
export const addTTY = (doc, tty, config) => {
  doc
    .text(' (', { underline: false, continued: true })
    .fillColor(config.text.linkColor)
    .text(`TTY: ${tty.number}`, {
      link: `tel:${tty.tel}`,
      underline: true,
      continued: true,
    })
    .fillColor(config.text.valueColor)
    .text(')', { link: null, underline: false, continued: true });
};

/** Adds a web link */
export const addWebLink = (doc, text, url, config) => {
  doc
    .fillColor(config.text.linkColor)
    .text(text, { link: url, underline: true })
    .fillColor(config.text.valueColor)
    .text('', { link: null });
};

/** Draws a horizontal line */
export const drawHorizontalLine = (
  doc,
  config,
  color = '#005EA2',
  width = 2,
) => {
  doc
    .moveTo(config.margins.left, doc.y)
    .lineTo(doc.page.width - config.margins.right, doc.y)
    .lineWidth(width)
    .strokeColor(config.graphicColors.horizontalLine || color)
    .stroke();
};

/** Draws a numbered circle */
export const drawNumberedCircle = (doc, config, number, y) => {
  const circleRadius = 10;
  const circleIndent = 15;
  const circleX = config.margins.left + circleRadius + circleIndent;
  const circleCenterY = y + circleRadius;
  doc
    .circle(circleX, circleCenterY, circleRadius)
    .lineWidth(2)
    .strokeColor(config.text.valueColor)
    .stroke();
  doc
    .font(config.text.boldFont)
    .fontSize(config.text.size)
    .fillColor(config.text.valueColor)
    .text(number, circleX - 3, circleCenterY - 8);
  return { circleX, circleCenterY, circleRadius };
};

/** Draws a vertical connecting line between steps */
export const drawVerticalLine = (doc, circleX, startY, endY, config) => {
  doc
    .moveTo(circleX, startY)
    .lineTo(circleX, endY + 15)
    .lineWidth(4)
    .strokeColor(config.graphicColors.lightBlueBar)
    .stroke();
};
