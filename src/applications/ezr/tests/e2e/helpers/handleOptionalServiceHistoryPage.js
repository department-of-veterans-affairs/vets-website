import {
  goToNextPage,
  selectDropdownWebComponent,
  fillDateWebComponentPattern,
} from '.';

export const fillServicePeriod = (historyData = {}) => {
  /* Default data for service history fields, can be overridden by passing in an object with any of the following properties:
  - lastServiceBranch
  - lastEntryDate
  - lastDischargeDate
  - dischargeType
  */
  const fillHistory = {
    lastServiceBranch: 'air force',
    lastEntryDate: '1999-01-01',
    lastDischargeDate: '2002-02-02',
    dischargeType: 'honorable',
    ...historyData,
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
  cy.injectAxeThenAxeCheck();
};

export const handleOptionalServiceHistoryPage = ({
  historyEnabled = false,
  hasTeraYes = false,
  hasServiceHistoryInfo = true,
  servicePeriodData = {},
  fillServiceHistory = false,
} = {}) => {
  const skipUpdateInfo = !(
    fillServiceHistory || Object.keys(servicePeriodData).length > 0
  );
  if (historyEnabled) {
    if (hasServiceHistoryInfo) {
      goToNextPage('/military-service/review-service-information');
      cy.selectYesNoVaRadioOption(
        'root_isServiceHistoryCorrect',
        skipUpdateInfo,
      );
    } else if (!hasServiceHistoryInfo || !skipUpdateInfo) {
      goToNextPage('/military-service/service-period');
      fillServicePeriod(servicePeriodData);
      goToNextPage('/military-service/additional-information');
    }
  }
  goToNextPage('/military-service/toxic-exposure');
  cy.selectYesNoVaRadioOption('root_hasTeraResponse', hasTeraYes);
};
