import {
  goToNextPage,
  selectDropdownWebComponent,
  fillDateWebComponentPattern,
} from '.';

const defaultServiceHistory = {
  lastServiceBranch: 'air force',
  lastEntryDate: '1999-01-01',
  lastDischargeDate: '2002-02-02',
  dischargeType: 'honorable',
  'view:hasPrefillServiceHistory': true,
};

export const fillServicePeriod = (servicePeriodData = {}) => {
  /* Default data for service history fields, can be overridden by passing in an object with any of the following properties:
  - lastServiceBranch
  - lastEntryDate
  - lastDischargeDate
  - dischargeType
  */
  const fillHistory = {
    ...defaultServiceHistory,
    ...servicePeriodData,
  };
  selectDropdownWebComponent(
    'lastServiceBranch',
    fillHistory.lastServiceBranch,
  );
  fillDateWebComponentPattern('lastEntryDate', fillHistory.lastEntryDate);
  fillDateWebComponentPattern(
    'lastDischargeDate',
    fillHistory.lastDischargeDate,
  );
  selectDropdownWebComponent('dischargeType', fillHistory.dischargeType);
};

export const handleOptionalServiceHistoryPage = ({
  historyEnabled = false,
  hasTeraYes = false,
  hasServiceHistoryInfo = true,
  servicePeriodData = {},
  fillServiceHistory = false,
  includeTera = true,
} = {}) => {
  if (historyEnabled) {
    if (hasServiceHistoryInfo) {
      goToNextPage('/military-service/review-service-information');
      cy.selectYesNoVaRadioOption(
        'root_isServiceHistoryCorrect',
        !fillServiceHistory,
      );
    }
    if (
      !hasServiceHistoryInfo ||
      (hasServiceHistoryInfo && fillServiceHistory)
    ) {
      goToNextPage('/military-service/service-period');
      fillServicePeriod(servicePeriodData);
      goToNextPage('/military-service/additional-information');
    }
  }
  goToNextPage('/military-service/toxic-exposure');
  cy.selectYesNoVaRadioOption('root_hasTeraResponse', hasTeraYes);
  if (
    includeTera &&
    (hasTeraYes ||
      (historyEnabled && (!hasServiceHistoryInfo || fillServiceHistory)))
  ) {
    goToNextPage('/military-service/upload-supporting-documents');
  }
};

export const withValidServiceHistory = prefill => {
  return {
    ...prefill,
    formData: {
      ...prefill.formData,
      ...defaultServiceHistory,
    },
  };
};
