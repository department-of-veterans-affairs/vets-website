import React from 'react';
import { LAST_YEAR } from '../../utils/constants';
import { includeSpousalInformation } from '../../utils/helpers/form-config';
import { formatCurrency } from '../../utils/helpers/general';
import content from '../../locales/en/content.json';

const SECTION_LABELS = {
  gross: content['household-financial-information-summary-gross-label'],
  net: content['household-financial-information-summary-net-label'],
  other: content['household-financial-information-summary-other-label'],
  medical: content['household-financial-information-summary-medical-label'],
  education: content['household-financial-information-summary-education-label'],
  funeral: content['household-financial-information-summary-funeral-label'],
};

const SECTION_FIELDS = {
  veteran: [
    ['veteranGrossIncome', SECTION_LABELS.gross],
    ['veteranNetIncome', SECTION_LABELS.net],
    ['veteranOtherIncome', SECTION_LABELS.other],
  ],
  spouse: [
    ['spouseGrossIncome', SECTION_LABELS.gross],
    ['spouseNetIncome', SECTION_LABELS.net],
    ['spouseOtherIncome', SECTION_LABELS.other],
  ],
  expenses: [
    ['deductibleMedicalExpenses', SECTION_LABELS.medical],
    ['deductibleEducationExpenses', SECTION_LABELS.education],
    ['deductibleFuneralExpenses', SECTION_LABELS.funeral],
  ],
};

const getValue = (item, key) => item?.[`view:${key}`]?.[key];
const hasAnyValue = value =>
  value !== null && value !== undefined && value !== '';

const renderList = (rows, keyPrefix) => (
  <ul className="no-bullets">
    {rows.map(({ key, label, value }) => (
      <li key={`${keyPrefix}-${key}`}>
        {label}: {formatCurrency(value)}
      </li>
    ))}
  </ul>
);

const FinancialSummaryCardDescription = (item, _index, formData) => {
  if (!item) return null;

  const isReviewPage = window?.location?.pathname.includes('review-and-submit');
  const Heading = isReviewPage ? 'h5' : 'h4';

  const buildRows = sectionKey =>
    SECTION_FIELDS[sectionKey].map(([key, label]) => ({
      key,
      label,
      value: getValue(item, key),
    }));

  const veteranRows = buildRows('veteran');
  const spouseRows = buildRows('spouse');
  const expenseRows = buildRows('expenses');

  const spouseHasIncome =
    includeSpousalInformation(formData) &&
    spouseRows.some(r => hasAnyValue(r.value));

  return (
    <>
      {/* The heading for this section comes from the ArrayBuilder's "itemName" attribute */}
      {renderList(veteranRows, 'veteran')}

      {spouseHasIncome && (
        <>
          <Heading>Spouse’s annual income from {LAST_YEAR}</Heading>
          {renderList(spouseRows, 'spouse')}
        </>
      )}

      <Heading>Deductible expenses from {LAST_YEAR}</Heading>
      {renderList(expenseRows, 'expenses')}
    </>
  );
};

export default FinancialSummaryCardDescription;
