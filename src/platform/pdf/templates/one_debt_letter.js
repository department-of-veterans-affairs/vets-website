import {
  createAccessibleDoc,
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFooterContent,
  createDetailItem,
} from './utils';
import vaLogoUrl from './va_logo.png';

const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 30, right: 30 },
  text: { font: 'SourceSansPro-Regular', boldFont: 'SourceSansPro-Bold', size: 12 },
};

const generate = async (data = {}, config = defaultConfig) => {
  const doc = createAccessibleDoc(
    { title: data.title || 'Debt Letter', ...data },
    config,
  );
  await registerVaGovFonts(doc);
  doc.addPage({ margins: config.margins });

  // Fetch logo as base64
  const response = await fetch(vaLogoUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64Image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;

  const wrapper = doc.struct('Document');
  doc.addStructure(wrapper);

  const headerData = {
    headerLeft: '',
    headerRight: '',
    footerLeft: 'VA.gov',
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    ...data,
  };
  await generateInitialHeaderContent(doc, wrapper, headerData, config);

  // Logo
  const logoWidth = 275;
  const logoX = (doc.page.width - logoWidth) / 2;
  wrapper.add(
    doc.struct('Figure', { alt: 'VA Logo' }, () => {
      doc.image(base64Image, logoX, 12, { width: logoWidth });
    }),
  );

  // Vet info
  const addressY = 100; // Adjusted to be below the logo
  doc.font(config.text.font).fontSize(config.text.size);
  wrapper.add(
    doc.struct('P', () => {
      doc.text('Travis Jones', config.margins.left, addressY);
      doc.text('123 MAIN', config.margins.left);
      doc.text('ST LOUIS MO 63049', config.margins.left);
    }),
  );

  // Doc info
  const rightSideX = doc.page.width - config.margins.right - 150;
  doc.font(config.text.font).fontSize(config.text.size);
  wrapper.add(
    doc.struct('P', () => {
      doc.text(data.date || '03/20/2025', rightSideX, addressY, { align: 'right' });
      doc.text('File Number: 796123018', rightSideX, addressY + 18, { align: 'right' });
      doc.text('Questions? https://ask.va.gov', rightSideX, addressY + 36, { align: 'right' });
    }),
  );

  // working
  // Table: VA Medical Center Copay Charges
  const tableTop = 175;
  const tableLeft = config.margins.left;
  const col1Width = 300;
  const col2Width = 100;
  const col3Width = 100;
  const rowHeight = 20;

  // const tableSection = doc.struct('Sect', { title: 'Copay Charges' });
  // wrapper.add(tableSection);
  //
  // doc.font(config.text.boldFont).fontSize(config.text.size);
  // tableSection.add(
  //   doc.struct('P', () => {
  //     doc.text('VA Medical Center Copay Charges', tableLeft, tableTop);
  //     doc.text('AMOUNT DUE', tableLeft + col1Width, tableTop, { continued: true });
  //     doc.text('COPAY BILLING REF#', tableLeft + col1Width + col2Width, tableTop);
  //   }),
  // );
  //
  // doc.moveTo(tableLeft, tableTop + rowHeight)
  //    .lineTo(tableLeft + col1Width + col2Width + col3Width, tableTop + rowHeight)
  //    .stroke();
  //
  //
  // const tableSection = doc.struct('Table', { title: 'Copay Charges' });

//   const tableTop = 175;
// const tableLeft = config.margins.left;
// const col1Width = 300;
// const col2Width = 100;
// const col3Width = 100;
// const rowHeight = 20;

doc.font(config.text.boldFont).fontSize(config.text.size);
wrapper.add(
  doc.struct('P', () => {
    doc.text('VA Medical Center Copay Charges', tableLeft, tableTop);
    doc.text('AMOUNT DUE', tableLeft + col1Width, tableTop, { continued: true });
    doc.text('COPAY BILLING REF#', tableLeft + col1Width + col2Width, tableTop);
  }),
);

const tableWidth = col1Width + col2Width + col3Width;
const tableHeight = rowHeight;
const tableBottom = tableTop + tableHeight;

// Top line
doc.moveTo(tableLeft, tableTop)
   .lineTo(tableLeft + tableWidth, tableTop)
   .stroke();

// Right line
doc.moveTo(tableLeft + tableWidth, tableTop)
   .lineTo(tableLeft + tableWidth, tableBottom)
   .stroke();


  // Intro text below table
  doc.moveDown(2);
  const introSection = doc.struct('Sect', { title: 'Introduction' });
  wrapper.add(introSection);
  introSection.add(
    doc.struct('P', () => {
      doc.font(config.text.font)
         .fontSize(config.text.size)
         .text(
           'You are receiving this billing statement because you are currently enrolled in a priority group requiring copayments for treatment of nonservice-connected conditions.',
           config.margins.left,
           doc.y
         );
    }),
  );

  await generateFooterContent(doc, wrapper, headerData, config);
  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
