import { format, isValid } from 'date-fns';
import last from 'lodash/last';
import {
  createAccessibleDoc,
  registerVaGovFonts,
  generateInitialHeaderContent,
  generateFooterContent,
} from './utils';

const defaultConfig = {
  margins: { top: 40, bottom: 40, left: 30, right: 30 },
  text: {
    font: 'SourceSansPro-Regular',
    boldFont: 'SourceSansPro-Bold',
    size: 12,
  },
  table: {
    col1Width: 350,
    col2Width: 100,
    col3Width: 100,
  },
};

// Dropping this here for now. May try and fudge the debt objects as we pass them in here to include it, but want to turn this around quickly
// https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/benefits-memorials-2/engineering/front-end/architecture/static-codes.md
// let's try and keep these values updated there so it's easier for stakeholders to check them
export const deductionCodes = Object.freeze({
  '11': 'Post-9/11 GI Bill overpayment for books and supplies',
  '12': 'Post-9/11 GI Bill overpayment for books and supplies',
  '13': 'Post-9/11 GI Bill overpayment for books and supplies',
  '14': 'Post-9/11 GI Bill overpayment for books and supplies',
  '15': 'Post-9/11 GI Bill overpayment for books and supplies',
  '16': 'Post-9/11 GI Bill overpayment for housing',
  '17': 'Post-9/11 GI Bill overpayment for housing',
  '18': 'Post-9/11 GI Bill overpayment for housing',
  '19': 'Post-9/11 GI Bill overpayment for housing',
  '20': 'Post-9/11 GI Bill overpayment for housing',
  '27': 'Post-9/11 GI Bill overpayment for books and supplies',
  '28': 'Post-9/11 GI Bill overpayment for books and supplies',
  '30': 'Disability compensation and pension overpayment',
  '41': 'Chapter 34 education overpayment',
  '44': 'Chapter 35 education overpayment',
  '48': 'Post-9/11 GI Bill overpayment for housing',
  '49': 'Post-9/11 GI Bill overpayment for housing',
  '50': 'Post-9/11 GI Bill overpayment for housing',
  '51': 'Post-9/11 GI Bill overpayment for housing',
  '71': 'Post-9/11 GI Bill overpayment for books and supplies',
  '72': 'Post-9/11 GI Bill overpayment for housing',
  '73': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '74': 'Post-9/11 GI Bill overpayment for tuition',
  '75': 'Post-9/11 GI Bill overpayment for tuition (school liable)',
  '76': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '77': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '78': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '79': 'Education Ch 33-Ch1606/Ch30 Kickers',
});

// Helper to format numbers with commas (e.g., 1350.00 -> "1,350.00")
const formatCurrency = amount => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// Draw borders
// const tableBottom = currentY;
const drawBorders = (config, doc, tableTop, tableLeft, tableWidth) => {
  const {
    table: { col1Width, col2Width },
  } = config;
  const tableBottom = doc.page.height - config.margins.bottom;
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
};

// Helper function to handle page breaks and draw borders on new page(s)
const handlePageBreakWithBorders = (
  doc,
  currentY,
  config,
  spaceNeeded,
  tableLeft,
  tableWidth,
) => {
  if (currentY + spaceNeeded > doc.page.height - config.margins.bottom) {
    // Add a new page
    doc.addPage({ margins: config.margins });

    // Drawing borders on new page, so table top will be the top margin (for now)
    drawBorders(config, doc, config.margins.top, tableLeft, tableWidth);

    // Reset Y-coordinate for the new page
    //   padding with 5 for some breathing room after the border
    return config.margins.top + 5;
  }
  return currentY;
};

const generate = async (data = {}, config = defaultConfig) => {
  const { debts, details, copays, veteranContactInformation } = data;
  const downloadDate = format(new Date(), 'MM/dd/yyyy');

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

  // VA Logo
  if (details?.logoUrl) {
    // Fetch logo as base64
    const response = await fetch(details?.logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(
      arrayBuffer,
    ).toString('base64')}`;
    const logoWidth = 275;

    // right align logo
    const logoX = doc.page.width - config.margins.right - logoWidth;
    wrapper.add(
      doc.struct(
        'Figure',
        { alt: 'VA U.S Department of Veteran Affairs' },
        () => {
          doc.image(base64Image, logoX, 12, { width: logoWidth });
        },
      ),
    );
  }

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

  const veteranDisplayName = `${veteranFullName?.first ||
    ''} ${veteranFullName?.middle || ''} ${veteranFullName?.last || ''}${
    veteranFullName?.suffix ? `, ${veteranFullName?.suffix}` : ''
  }`;

  doc.font(config.text.font).fontSize(config.text.size);
  wrapper.add(
    doc.struct('P', () => {
      doc.text(veteranDisplayName, config.margins.left, addressY);
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
      doc.text(downloadDate, rightSideX, addressY, { align: 'right' });
      if (fileNumber) {
        doc.text(`File Number: ${fileNumber}`, rightSideX, addressY + 18, {
          align: 'right',
        });
      }
      doc.text('Questions? https://ask.va.gov', rightSideX, addressY + 36, {
        align: 'right',
      });
    }),
  );

  // Table: VA Medical Center Copay Charges and Benefits Overpayment
  const tableTop = 175;
  const tableLeft = config.margins.left;
  const { table } = config;
  const { col1Width, col2Width, col3Width } = table;
  const tableWidth = col1Width + col2Width + col3Width;
  const col1Indent = {
    first: tableLeft + 5,
    second: tableLeft + 5 + 15,
  };

  // TODO
  // [x] Add indent values so we can drop \u00A0
  // [ ] Add standardized line height to replace stuff like `heightOfString`
  // [ ] We can probably make some helper functions for adding to each column, the spacing is pretty consistent
  //      trying to get this out the door for now, but it'll be some fun tech debt to address later
  // [ ]

  // draw borders after header stuffs
  drawBorders(config, doc, tableTop, tableLeft, tableWidth);

  // resetting position after table is drawn
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
      doc.text('VA Medical Center Copay Charges', col1Indent.first, headerY);
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
  currentY = headerBottomY + 5;

  // Copay Description Row
  const descRow = doc.struct('TR');
  tableStruct.add(descRow);
  const descriptionText =
    '– You are receiving this billing statement because you are currently enrolled in a priority group requiring copayments for treatment of nonservice-connected conditions.';
  doc.font(config.text.font).fontSize(8);
  descRow.add(
    doc.struct('TD', () => {
      doc.text(descriptionText, col1Indent.first, currentY, {
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
    const stationDesc = `${index + 1}.  ${copay?.station?.facilityName || ''}`;
    stationRow.add(
      doc.struct('TD', () => {
        doc.text(stationDesc, col1Indent.first, currentY, { width: col1Width });
      }),
    );
    stationRow.add(doc.struct('TD'));
    stationRow.add(doc.struct('TD'));
    const stationHeight = doc.heightOfString(stationDesc, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + stationHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Account Number Row
    const accountNumberRow = doc.struct('TR');
    tableStruct.add(accountNumberRow);
    const accountNumberDesc = `Account Number: `;
    doc.font(config.text.boldFont);
    accountNumberRow.add(
      doc.struct('TD', () => {
        doc.text(accountNumberDesc, col1Indent.second, currentY, {
          width: col1Width,
          continued: true,
        });
        doc.font(config.text.font);
        doc.text(`${copay?.accountNumber || copay?.pHAccountNumber}`, {
          width: col1Width,
          continued: false,
        });
      }),
    );
    doc.font(config.text.font);
    const accountNumberHeight = doc.heightOfString(accountNumberDesc, {
      width: col1Width,
      size: 8,
    });

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + accountNumberHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Statement Date Disclaimer bit
    const parsedStatementDate = new Date(copay.pSStatementDateOutput);
    //  using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
    const statementDate = isValid(parsedStatementDate)
      ? format(parsedStatementDate, 'MMMM d')
      : '';

    const statementInfoLine = doc.struct('TR');
    tableStruct.add(statementInfoLine);
    const statementInfoDesc = `Statement reflects payments received by ${statementDate}`;
    statementInfoLine.add(
      doc.struct('TD', () => {
        doc.text(statementInfoDesc, col1Indent.second, currentY, {
          width: col1Width,
        });
      }),
    );
    const statementInfoHeight = doc.heightOfString(statementInfoDesc, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + statementInfoHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Copay Data Rows
    doc.font(config.text.font).fontSize(8);
    const copayDetails = copay?.details || [];

    // Previous Balance to help the math make sense
    const prevBalanceRow = doc.struct('TR');
    tableStruct.add(prevBalanceRow);
    const previousBalanceStr = `Previous Balance`;
    prevBalanceRow.add(
      doc.struct('TD', () => {
        doc.text(previousBalanceStr, col1Indent.second, currentY, {
          width: col1Width,
        });
      }),
    );
    prevBalanceRow.add(
      doc.struct('TD', () => {
        doc.text(
          `$${formatCurrency(copay.pHPrevBal || 0)}`,
          tableLeft + col1Width,
          currentY,
          { align: 'right', width: col2Width - 10 },
        );
      }),
    );
    const prevBalanceRowHeight = doc.heightOfString(previousBalanceStr, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + prevBalanceRowHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Payments Received Row to help with maths
    const paymentsReceivedRow = doc.struct('TR');
    tableStruct.add(paymentsReceivedRow);
    const paymentsReceivedDesc = `Payments Received`;
    paymentsReceivedRow.add(
      doc.struct('TD', () => {
        doc.text(paymentsReceivedDesc, col1Indent.second, currentY, {
          width: col1Width,
        });
      }),
    );
    paymentsReceivedRow.add(
      doc.struct('TD', () => {
        doc.text(
          `$${formatCurrency(copay.pHTotCredits || 0)}`,
          tableLeft + col1Width,
          currentY,
          { align: 'right', width: col2Width - 10 },
        );
      }),
    );
    const paymentsReceivedRowHeight = doc.heightOfString(paymentsReceivedDesc, {
      width: col1Width,
      font: config.text.font,
      size: 8,
    });

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + paymentsReceivedRowHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Adding copay detail charges
    copayDetails.forEach(detail => {
      const dataRow = doc.struct('TR');
      tableStruct.add(dataRow);
      const description = `${detail.pDTransDescOutput.replace(/&nbsp;/g, '')}`;
      dataRow.add(
        doc.struct('TD', () => {
          doc.text(description, col1Indent.second, currentY, {
            width: col1Width,
          });
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

      currentY = handlePageBreakWithBorders(
        doc,
        currentY + rowHeight + 5,
        config,
        25,
        tableLeft,
        tableWidth,
      );
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

  // space needed for Instructions Rows is closer to 45 for all the lines
  currentY = handlePageBreakWithBorders(
    doc,
    currentY + totalHeight + 5,
    config,
    45,
    tableLeft,
    tableWidth,
  );

  // Copay Payment Instructions Row
  const paymentRow = doc.struct('TR');
  tableStruct.add(paymentRow);
  paymentRow.add(
    doc.struct('TD', () => {
      const lineHeight = 10;
      let yPos = currentY;

      doc.font(config.text.font).fontSize(8);
      doc.text('To Pay Your Copay Bills:', col1Indent.first, yPos, {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('In Person:', col1Indent.first, yPos, {
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
      doc.text('By Phone:', col1Indent.first, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(' Contact VA at 1-888-827-4817', { width: col1Width });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('Online:', col1Indent.first, yPos, {
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

  // making sure we have enough space for the header and Benefits Overpayment Description Row
  currentY = handlePageBreakWithBorders(
    doc,
    currentY + paymentHeight + 5,
    config,
    headerHeight + 30,
    tableLeft,
    tableWidth,
  );

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
      doc.text('Benefits Overpayment', col1Indent.first, overpaymentHeaderY);
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
  currentY = overpaymentHeaderBottomY + 5;

  // Benefits Overpayment Description Row
  const overpaymentDescRow = doc.struct('TR');
  tableStruct.add(overpaymentDescRow);
  const overpaymentDescText =
    '– Veterans Benefits Administration overpayments are due to changes in your entitlement which result in you being paid more than you were entitled to receive.';
  doc.font(config.text.font).fontSize(8);
  overpaymentDescRow.add(
    doc.struct('TD', () => {
      doc.text(overpaymentDescText, col1Indent.first, currentY, {
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

  currentY = handlePageBreakWithBorders(
    doc,
    currentY + overpaymentDescHeight + 5,
    config,
    20,
    tableLeft,
    tableWidth,
  );

  // Debt update disclaimer
  const debtUpdateDisclaimerRow = doc.struct('TR');
  tableStruct.add(debtUpdateDisclaimerRow);
  const debtUpdateDisclaimerText =
    'Please note that payments may take up to 4 business days to reflect after processing.';
  doc.font(config.text.font).fontSize(8);
  debtUpdateDisclaimerRow.add(
    doc.struct('TD', () => {
      doc.text(debtUpdateDisclaimerText, col1Indent.first, currentY, {
        width: col1Width,
      });
    }),
  );
  const debtUpdateDisclaimerHeight = doc.heightOfString(
    debtUpdateDisclaimerText,
    {
      width: col1Width,
      font: config.text.font,
      size: 8,
    },
  );
  currentY += debtUpdateDisclaimerHeight + 5;

  // Benefits Overpayment Data Rows
  const overpaymentDetails = debts || [];
  let totalOverpayment = 0;
  overpaymentDetails.forEach((debt, index) => {
    // checking currentY so we can group the overpaymentRow with the
    //   corresponding Updated on line
    currentY = handlePageBreakWithBorders(
      doc,
      currentY,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    const overpaymentRow = doc.struct('TR');
    tableStruct.add(overpaymentRow);
    const description = deductionCodes[debt.deductionCode]
      ? `${index + 1}.  ${deductionCodes[debt.deductionCode]} (${
          debt.benefitType
        })`
      : `${index + 1}.  ${debt.benefitType}`;
    overpaymentRow.add(
      doc.struct('TD', () => {
        doc.text(description, col1Indent.first, currentY, { width: col1Width });
      }),
    );
    overpaymentRow.add(
      doc.struct('TD', () => {
        doc.text(
          `$${formatCurrency(parseFloat(debt.currentAr || 0))}`,
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

    currentY = handlePageBreakWithBorders(
      doc,
      currentY + rowHeight + 5,
      config,
      25,
      tableLeft,
      tableWidth,
    );

    // Overpayment 'Updated on' line
    const dateUpdated = last(debt.debtHistory)?.date;
    const newDate =
      typeof dateUpdated === 'string'
        ? new Date(dateUpdated.replace(/-/g, '/'))
        : dateUpdated;
    const formattedDateUpdated = isValid(newDate)
      ? format(new Date(newDate), 'MMMM d, y')
      : null;

    if (dateUpdated) {
      const debtUpdatedLine = doc.struct('TR');
      tableStruct.add(debtUpdatedLine);
      const debtUpdatedDesc = `Updated on ${formattedDateUpdated}`;
      debtUpdatedLine.add(
        doc.struct('TD', () => {
          doc.text(debtUpdatedDesc, col1Indent.second, currentY, {
            width: col1Width,
          });
        }),
      );
      const debtUpdatedHeight = doc.heightOfString(debtUpdatedDesc, {
        width: col1Width,
        font: config.text.font,
        size: 8,
      });

      currentY = handlePageBreakWithBorders(
        doc,
        currentY + debtUpdatedHeight + 5,
        config,
        25,
        tableLeft,
        tableWidth,
      );
    }

    // Overpayment Details - Payee number
    if (debt.payeeNumber) {
      const payeeNumberLine = doc.struct('TR');
      tableStruct.add(payeeNumberLine);
      const payeeNumberDesc = `Payee Number: ${debt.payeeNumber}`;
      payeeNumberLine.add(
        doc.struct('TD', () => {
          doc.text(payeeNumberDesc, col1Indent.second, currentY, {
            width: col1Width,
          });
        }),
      );
      const payeeNumberHeight = doc.heightOfString(payeeNumberDesc, {
        width: col1Width,
        font: config.text.font,
        size: 8,
      });

      currentY = handlePageBreakWithBorders(
        doc,
        currentY + payeeNumberHeight + 5,
        config,
        25,
        tableLeft,
        tableWidth,
      );
    }

    // Overpayment Details - Person entitled
    if (debt.personEntitled) {
      const personEntitledLine = doc.struct('TR');
      tableStruct.add(personEntitledLine);
      const personEntitledDesc = `Person entitled: ${debt.personEntitled}`;
      personEntitledLine.add(
        doc.struct('TD', () => {
          doc.text(personEntitledDesc, col1Indent.second, currentY, {
            width: col1Width,
          });
        }),
      );
      const personEntitledHeight = doc.heightOfString(personEntitledDesc, {
        width: col1Width,
        font: config.text.font,
        size: 8,
      });

      currentY = handlePageBreakWithBorders(
        doc,
        currentY + personEntitledHeight + 5,
        config,
        25,
        tableLeft,
        tableWidth,
      );
    }

    // Overpayment Details - Deduction code
    if (debt.deductionCode) {
      const deductionCodeLine = doc.struct('TR');
      tableStruct.add(deductionCodeLine);
      const deductionCodeDesc = `Deduction code: ${debt.deductionCode}`;
      deductionCodeLine.add(
        doc.struct('TD', () => {
          doc.text(deductionCodeDesc, col1Indent.second, currentY, {
            width: col1Width,
          });
        }),
      );
      const deductionCodeHeight = doc.heightOfString(deductionCodeDesc, {
        width: col1Width,
        font: config.text.font,
        size: 8,
      });

      currentY = handlePageBreakWithBorders(
        doc,
        currentY + deductionCodeHeight + 5,
        config,
        25,
        tableLeft,
        tableWidth,
      );
    }

    totalOverpayment += parseFloat(debt.currentAr || 0);
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

  // space needed for Instructions Rows is closer to 35 for all the lines
  currentY = handlePageBreakWithBorders(
    doc,
    currentY + overpaymentTotalHeight + 5,
    config,
    35,
    tableLeft,
    tableWidth,
  );

  // Benefits Overpayment Payment Instructions Row
  const overpaymentPaymentRow = doc.struct('TR');
  tableStruct.add(overpaymentPaymentRow);
  overpaymentPaymentRow.add(
    doc.struct('TD', () => {
      const lineHeight = 10;
      let yPos = currentY;

      doc.font(config.text.font).fontSize(8);
      doc.text('To Pay Your VA Benefit Debt:', col1Indent.first, yPos, {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('By Phone:', col1Indent.first, yPos, {
        width: col1Width,
        continued: true,
      });
      doc.font(config.text.font);
      doc.text(' Contact VA’s Debt Management Center at 1-800-827-0648', {
        width: col1Width,
      });
      yPos += lineHeight;

      doc.font(config.text.boldFont);
      doc.text('Online:', col1Indent.first, yPos, {
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

  await generateFooterContent(doc, wrapper, headerData, config);
  wrapper.end();
  doc.flushPages();
  return doc;
};

export { generate };
