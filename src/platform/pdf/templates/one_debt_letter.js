// import { format, isValid } from 'date-fns';
import {
  createAccessibleDoc,
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFooterContent,
} from './utils';
import vaLogoUrl from './va_logo.png';

const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 30, right: 30 },
  text: {
    font: 'SourceSansPro-Regular',
    boldFont: 'SourceSansPro-Bold',
    size: 12,
  },
};

// Helper to format numbers with commas (e.g., 1350.00 -> "1,350.00")
const formatCurrency = amount => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const generate = async (data = {}, config = defaultConfig) => {
  const { date, debts, copays, veteranContactInformation } = data;

  const doc = createAccessibleDoc(
    {
      title: 'VA medical copay charges, benefits overpayment, and obligations',
      author: 'U.S. Department of Veterans Affairs',
      subject:
        'VA medical copay charges, benefits overpayment, and obligations',
      lang: 'en',
      ...data,
    },
    config,
  );
  await registerVaGovFonts(doc);
  doc.addPage({ margins: config.margins });

  // Fetch logo as base64
  const response = await fetch(vaLogoUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64Image = `data:image/png;base64,${Buffer.from(
    arrayBuffer,
  ).toString('base64')}`;

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

  const hiddenH1 = doc.struct('H1', { hidden: true });
  wrapper.add(hiddenH1);
  hiddenH1.add(
    doc.struct('P', () => {
      // Save the current state of the graphics context
      doc.save();
      // Set opacity to 0 to make the text invisible
      doc.opacity(0);
      // Position the text off the page (e.g., at a negative coordinate)
      doc.text('Patient Information', -1000, -1000, { continued: false });
      // Restore the graphics state to reset opacity for subsequent content
      doc.restore();
    }),
  );

  // Logo
  const logoWidth = 275;
  const logoX = (doc.page.width - logoWidth) / 2;
  wrapper.add(
    doc.struct(
      'Figure',
      { alt: 'VA U.S Department of Veteran Affairs' },
      () => {
        doc.image(base64Image, logoX, 12, { width: logoWidth });
      },
    ),
  );

  // Veteran Contact Information
  const addressY = 100;
  const {
    veteranFullName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    fileNumber,
  } = veteranContactInformation;
  doc.font(config.text.font).fontSize(config.text.size);
  wrapper.add(
    doc.struct('P', () => {
      doc.text(veteranFullName, config.margins.left, addressY);
      doc.text(addressLine1, config.margins.left);
      if (addressLine2) doc.text(addressLine2, config.margins.left);
      if (addressLine3) doc.text(addressLine3, config.margins.left);
      doc.text(`${city}, ${stateCode} ${zipCode}`, config.margins.left);
    }),
  );

  // Doc info
  const rightSideX = doc.page.width - config.margins.right - 150;
  doc.font(config.text.font).fontSize(config.text.size);
  wrapper.add(
    doc.struct('P', () => {
      doc.text(date, rightSideX, addressY, { align: 'right' });
      doc.text(`File Number: ${fileNumber}`, rightSideX, addressY + 18, {
        align: 'right',
      });
      doc.text('Questions? https://ask.va.gov', rightSideX, addressY + 36, {
        align: 'right',
      });
    }),
  );

  // Table: VA Medical Center Copay Charges and Benefits Overpayment
  const tableTop = 175;
  const tableLeft = config.margins.left;
  const col1Width = 350;
  const col2Width = 100;
  const col3Width = 100;
  const tableWidth = col1Width + col2Width + col3Width;
  // TODO
  // add indent values so we can drop \u00A0

  let currentY = tableTop;

  const tableStruct = doc.struct('Table');
  wrapper.add(tableStruct);

  // Copay Header Row
  const headerRow = doc.struct('TR');
  tableStruct.add(headerRow);
  doc.font(config.text.boldFont).fontSize(10);
  const headerHeight = 30;
  const textHeight = doc.heightOfString('VA Medical Center Copay Charges', {
    font: config.text.boldFont,
    size: 10,
  });
  const headerY = tableTop + (headerHeight - textHeight) / 2;
  headerRow.add(
    doc.struct('TH', () => {
      doc.text('VA Medical Center Copay Charges', tableLeft + 5, headerY);
    }),
  );
  headerRow.add(
    doc.struct('TH', () => {
      doc.text('AMOUNT DUE', tableLeft + col1Width, headerY, {
        align: 'right',
        width: col2Width - 10,
      });
    }),
  );
  headerRow.add(
    doc.struct('TH', () => {
      doc.text(
        'COPAY BILLING REF#',
        tableLeft + col1Width + col2Width + 5,
        headerY,
      );
    }),
  );
  const headerBottomY = tableTop + headerHeight;
  doc
    .moveTo(tableLeft, headerBottomY)
    .lineTo(tableLeft + tableWidth, headerBottomY)
    .stroke();
  currentY = headerBottomY;

  // Copay Description Row
  const descRow = doc.struct('TR');
  tableStruct.add(descRow);
  const descriptionText =
    '– You are receiving this billing statement because you are currently enrolled in a priority group requiring copayments for treatment of nonservice-connected conditions.';
  doc.font(config.text.font).fontSize(8);
  descRow.add(
    doc.struct('TD', () => {
      doc.text(descriptionText, tableLeft + 5, currentY, {
        width: col1Width,
      });
    }),
  );
  descRow.add(doc.struct('TD'));
  descRow.add(doc.struct('TD'));
  const descHeight = doc.heightOfString(descriptionText, {
    width: col1Width,
    font: config.text.font,
    size: 8,
  });
  currentY += descHeight + 5;

  // All the copay data
  let totalCopay = 0;
  copays.forEach((copay, index) => {
    // Copay Station Row
    const stationRow = doc.struct('TR');
    tableStruct.add(stationRow);
    const stationDesc = `${index + 1}.   ${copay?.station?.facilityName || ''}`;
    stationRow.add(
      doc.struct('TD', () => {
        doc.text(stationDesc, tableLeft + 5, currentY, { width: col1Width });
      }),
    );
    stationRow.add(doc.struct('TD'));
    stationRow.add(doc.struct('TD'));
    const stationHeight = doc.heightOfString(stationDesc, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });
    currentY += stationHeight + 5;

    // statement date disclaimer bit -- this is likely different for each copay, so
    //    we can't have it above the table like the example

    // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
    // const parsedStatementDate = new Date(copay.pSStatementDateOutput);
    // const statementDate = isValid(parsedStatementDate)
    //   ? format(parsedStatementDate, 'MMMM d')
    //   : '';

    // const statementInfoLine = doc.struct('TR');
    // tableStruct.add(statementInfoLine);
    // const statementInfoDesc = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Statement reflects payments received by ${statementDate}`;
    // statementInfoLine.add(
    //   doc.struct('TD', () => {
    //     doc.text(statementInfoDesc, tableLeft + 5, currentY, {
    //       width: col1Width,
    //     });
    //   }),
    // );
    // statementInfoLine.add(doc.struct('TD'));
    // statementInfoLine.add(doc.struct('TD'));
    // const statementInfoHeight = doc.heightOfString(statementInfoDesc, {
    //   width: col1Width,
    //   font: config.text.font,
    //   size: 8,
    // });
    // currentY += statementInfoHeight + 5;

    // Copay Data Rows
    doc.font(config.text.font).fontSize(8);
    const copayDetails = copay?.details || [];

    // previous balance to help the math make sense
    const prevBalanceRow = doc.struct('TR');
    tableStruct.add(prevBalanceRow);
    const previousBalanceStr = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Previous Balance`;
    prevBalanceRow.add(
      doc.struct('TD', () => {
        doc.text(previousBalanceStr, tableLeft + 5, currentY, {
          width: col1Width,
        });
      }),
    );
    prevBalanceRow.add(
      doc.struct('TD', () => {
        doc.text(
          `$${formatCurrency(copay.pHPrevBal)}`,
          tableLeft + col1Width,
          currentY,
          { align: 'right', width: col2Width - 10 },
        );
      }),
    );
    prevBalanceRow.add(
      doc.struct('TD', () => {
        doc.text('', tableLeft + col1Width + col2Width + 35, currentY);
      }),
    );
    const prevBalanceRowHeight = doc.heightOfString(previousBalanceStr, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });
    currentY += prevBalanceRowHeight + 5;

    // TODO ... ?
    // Do we want to add payments received? We include that on the existing HTML statement page...
    //  it could also help with the math actually making sense

    // Adding copay detail charges
    copayDetails.forEach(detail => {
      const dataRow = doc.struct('TR');
      tableStruct.add(dataRow);
      const description = `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${detail.pDTransDescOutput.replace(
        /&nbsp;/g,
        '',
      )}`;
      dataRow.add(
        doc.struct('TD', () => {
          doc.text(description, tableLeft + 5, currentY, { width: col1Width });
        }),
      );
      dataRow.add(
        doc.struct('TD', () => {
          doc.text(
            `$${formatCurrency(
              parseFloat(
                detail.pDTransAmtOutput
                  .replace('&nbsp', '')
                  .replace('-', '')
                  .replace(/[^\d.-]/g, '') || 0,
              ),
            )}`,
            tableLeft + col1Width,
            currentY,
            { align: 'right', width: col2Width - 10 },
          );
        }),
      );
      dataRow.add(
        doc.struct('TD', () => {
          doc.text(
            detail.pDRefNo || '',
            tableLeft + col1Width + col2Width + 35,
            currentY,
          );
        }),
      );
      const rowHeight = doc.heightOfString(description, {
        width: col1Width,
        font: config.text.font,
        size: 8,
      });
      currentY += rowHeight + 5;
    });

    totalCopay += copay.pHAmtDue;
  });

  // Copay Total Row
  const totalRow = doc.struct('TR');
  tableStruct.add(totalRow);
  totalRow.add(doc.struct('TD'));
  totalRow.add(
    doc.struct('TD', () => {
      doc.text('Total Copayment Due', tableLeft + col1Width - 105, currentY, {
        align: 'right',
        width: 100,
      });
    }),
  );
  totalRow.add(
    doc.struct('TD', () => {
      doc.text(
        `$${formatCurrency(parseFloat(totalCopay))}`,
        tableLeft + col1Width,
        currentY,
        { align: 'right', width: col2Width - 10 },
      );
    }),
  );
  const totalHeight = doc.heightOfString('Total Copayment Due', {
    width: 100,
    font: config.text.font,
    size: 8,
  });
  currentY += totalHeight + 5;

  // Copay Payment Instructions Row
  // TODO ... ? Do we want to add Account number? Pretty sure it's necessary to make any of the following payments
  //  (and it's included on the existing HTML statement page)
  const paymentRow = doc.struct('TR');
  tableStruct.add(paymentRow);
  paymentRow.add(
    doc.struct('TD', () => {
      const lineHeight = 10;
      let yPos = currentY;

      doc.font(config.text.font).fontSize(8);
      doc.text('To Pay Your Copay Bills:', tableLeft + 5, yPos, {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('In Person:', tableLeft + 5, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(
        ' At your local Veteran Affairs Medical Center Agent Cashier’s Office',
        { width: col1Width },
      );
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('By Phone:', tableLeft + 5, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(' Contact VA at 1-888-827-4817', { width: col1Width });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('Online:', tableLeft + 5, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(
        ' Pay by ACH withdrawal from your bank account, or by debit or credit card at www.pay.gov',
        { width: col1Width },
      );
    }),
  );
  paymentRow.add(doc.struct('TD'));
  paymentRow.add(doc.struct('TD'));
  const paymentHeight = doc.heightOfString(
    'To Pay Your Copay Bills:\nIn Person: At your local Veteran Affairs Medical Center Agent Cashier’s Office\nBy Phone: Contact VA at 1-888-827-4817\nOnline: Pay by ACH withdrawal from your bank account, or by debit or credit card at www.pay.gov',
    { width: col1Width, font: config.text.font, size: 8 },
  );
  currentY += paymentHeight + 5;

  // Benefits Overpayment Header Row
  const overpaymentHeaderRow = doc.struct('TR');
  tableStruct.add(overpaymentHeaderRow);
  doc.font(config.text.boldFont).fontSize(10);
  // Draw border above the header
  doc
    .moveTo(tableLeft, currentY)
    .lineTo(tableLeft + tableWidth, currentY)
    .stroke();
  const overpaymentHeaderY = currentY + (headerHeight - textHeight) / 2;
  overpaymentHeaderRow.add(
    doc.struct('TH', () => {
      doc.text('Benefits Overpayment', tableLeft + 5, overpaymentHeaderY);
    }),
  );
  overpaymentHeaderRow.add(
    doc.struct('TH', () => {
      doc.text('AMOUNT DUE', tableLeft + col1Width, overpaymentHeaderY, {
        align: 'right',
        width: col2Width - 10,
      });
    }),
  );
  overpaymentHeaderRow.add(doc.struct('TH'));
  const overpaymentHeaderBottomY = currentY + headerHeight;
  doc
    .moveTo(tableLeft, overpaymentHeaderBottomY)
    .lineTo(tableLeft + tableWidth, overpaymentHeaderBottomY)
    .stroke();
  currentY = overpaymentHeaderBottomY;

  // Benefits Overpayment Description Row
  const overpaymentDescRow = doc.struct('TR');
  tableStruct.add(overpaymentDescRow);
  const overpaymentDescText =
    '– Veterans Benefits Administration overpayments are due to changes in your entitlement which result in you being paid more than you were entitled to receive.';
  doc.font(config.text.font).fontSize(8);
  overpaymentDescRow.add(
    doc.struct('TD', () => {
      doc.text(overpaymentDescText, tableLeft + 5, currentY, {
        width: col1Width,
      });
    }),
  );
  overpaymentDescRow.add(doc.struct('TD'));
  overpaymentDescRow.add(doc.struct('TD'));
  const overpaymentDescHeight = doc.heightOfString(overpaymentDescText, {
    width: col1Width,
    font: config.text.font,
    size: 8,
  });
  currentY += overpaymentDescHeight + 5;

  // Benefits Overpayment Data Rows
  const overpaymentDetails = debts || [];
  let totalOverpayment = 0;
  overpaymentDetails.forEach((debt, index) => {
    const overpaymentRow = doc.struct('TR');
    tableStruct.add(overpaymentRow);
    const description = debt.deductionCode
      ? `${index + 1}. ${debt.deductionCode} ${debt.benefitType}`
      : `${index + 1}. ${debt.benefitType}`;
    overpaymentRow.add(
      doc.struct('TD', () => {
        doc.text(description, tableLeft + 5, currentY, { width: col1Width });
      }),
    );
    overpaymentRow.add(
      doc.struct('TD', () => {
        doc.text(
          `$${formatCurrency(parseFloat(debt.originalAR || 0))}`,
          tableLeft + col1Width,
          currentY,
          { align: 'right', width: col2Width - 10 },
        );
      }),
    );
    overpaymentRow.add(doc.struct('TD'));
    const rowHeight = doc.heightOfString(description, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });
    currentY += rowHeight + 5;

    // Add payment received row if applicable
    if (debt.debtHistory?.length > 0) {
      const paymentReceivedRow = doc.struct('TR');
      tableStruct.add(paymentReceivedRow);
      const paymentDesc = `Payment received ${debt.debtHistory[0].date}`;
      paymentReceivedRow.add(doc.struct('TD'));
      paymentReceivedRow.add(
        doc.struct('TD', () => {
          doc.text(paymentDesc, tableLeft + col1Width - 105, currentY, {
            align: 'right',
            width: 100,
          });
        }),
      );
      paymentReceivedRow.add(doc.struct('TD'));
      const paymentRowHeight = doc.heightOfString(paymentDesc, {
        width: 100,
        font: config.text.font,
        size: 8,
      });
      currentY += paymentRowHeight + 5;
    }

    totalOverpayment += parseFloat(debt.originalAR || 0);
  });

  // Benefits Overpayment Total Row
  const overpaymentTotalRow = doc.struct('TR');
  tableStruct.add(overpaymentTotalRow);
  overpaymentTotalRow.add(doc.struct('TD'));
  overpaymentTotalRow.add(
    doc.struct('TD', () => {
      doc.text(
        'Total VBA Overpayment Due',
        tableLeft + col1Width - 105,
        currentY,
        { align: 'right', width: 100 },
      );
    }),
  );
  overpaymentTotalRow.add(
    doc.struct('TD', () => {
      doc.text(
        `$${formatCurrency(totalOverpayment)}`,
        tableLeft + col1Width,
        currentY,
        { align: 'right', width: col2Width - 10 },
      );
    }),
  );
  const overpaymentTotalHeight = doc.heightOfString(
    'Total VBA Overpayment Due',
    { width: 100, font: config.text.font, size: 8 },
  );
  currentY += overpaymentTotalHeight + 5;

  // Benefits Overpayment Payment Instructions Row
  const overpaymentPaymentRow = doc.struct('TR');
  tableStruct.add(overpaymentPaymentRow);
  overpaymentPaymentRow.add(
    doc.struct('TD', () => {
      const lineHeight = 10;
      let yPos = currentY;

      doc.font(config.text.font).fontSize(8);
      doc.text('To Pay Your VA Benefit Debt:', tableLeft + 5, yPos, {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('By Phone:', tableLeft + 5, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(' Contact VA’s Debt Management Center at 1-800-827-0648', {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('Online:', tableLeft + 5, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(
        ' Pay by ACH withdrawal from your bank account, or by debit or credit card at www.pay.va.gov',
        { width: col1Width },
      );
    }),
  );
  overpaymentPaymentRow.add(doc.struct('TD'));
  overpaymentPaymentRow.add(doc.struct('TD'));
  const overpaymentPaymentHeight = doc.heightOfString(
    'To Pay Your VA Benefit Debt:\nBy Phone: Contact VA’s Debt Management Center at 1-800-827-0648\nOnline: Pay by ACH withdrawal from your bank account, or by debit or credit card at www.pay.va.gov',
    { width: col1Width, font: config.text.font, size: 8 },
  );
  currentY += overpaymentPaymentHeight + 5;

  // Draw borders
  const tableBottom = currentY;
  doc
    .moveTo(tableLeft, tableTop)
    .lineTo(tableLeft + tableWidth, tableTop)
    .stroke(); // Top line
  doc
    .moveTo(tableLeft + tableWidth, tableTop)
    .lineTo(tableLeft + tableWidth, tableBottom)
    .stroke(); // Right line
  doc
    .moveTo(tableLeft + tableWidth, tableBottom)
    .lineTo(tableLeft, tableBottom)
    .stroke(); // Bottom line
  doc
    .moveTo(tableLeft, tableBottom)
    .lineTo(tableLeft, tableTop)
    .stroke(); // Left line
  doc
    .moveTo(tableLeft + col1Width, tableTop)
    .lineTo(tableLeft + col1Width, tableBottom)
    .stroke(); // First vertical line
  doc
    .moveTo(tableLeft + col1Width + col2Width, tableTop)
    .lineTo(tableLeft + col1Width + col2Width, tableBottom)
    .stroke(); // Second vertical line

  // Intro text below table
  const introY = tableBottom + 20;
  doc.font(config.text.font).fontSize(config.text.size);
  const introSection = doc.struct('Sect', { title: 'Introduction' });
  wrapper.add(introSection);
  introSection.add(
    doc.struct('P', () => {
      doc.text(
        'You are receiving this billing statement because you are currently enrolled in a priority group requiring copayments for treatment of nonservice-connected conditions.',
        config.margins.left,
        introY,
      );
    }),
  );

  await generateFooterContent(doc, wrapper, headerData, config);
  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
