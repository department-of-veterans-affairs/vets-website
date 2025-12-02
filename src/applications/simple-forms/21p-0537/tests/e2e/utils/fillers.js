import {
  selectYesNoWebComponent,
  fillTextWebComponent,
  fillFullNameWebComponentPattern,
  fillDateWebComponentPattern,
} from '../../../../shared/tests/e2e/helpers';

/**
 * Fill veteran's name on the veteran-name page
 */
export const fillVeteranName = testData => {
  fillFullNameWebComponentPattern('veteranFullName', testData.veteranFullName);
};

/**
 * Fill veteran's identification information (SSN and/or VA file number)
 */
export const fillVeteranIdentifier = testData => {
  if (testData.veteranIdentification?.ssn) {
    fillTextWebComponent(
      'veteranIdentification_ssn',
      testData.veteranIdentification.ssn,
    );
  }
  if (testData.veteranIdentification?.vaFileNumber) {
    fillTextWebComponent(
      'veteranIdentification_vaFileNumber',
      testData.veteranIdentification.vaFileNumber,
    );
  }
};

/**
 * Fill contact information (phone and email)
 */
export const fillContactInfo = testData => {
  if (testData.primaryPhone) {
    fillTextWebComponent('primaryPhone', testData.primaryPhone);
  }
  if (testData.secondaryPhone) {
    fillTextWebComponent('secondaryPhone', testData.secondaryPhone);
  }
  if (testData.emailAddress) {
    fillTextWebComponent('emailAddress', testData.emailAddress);
  }
};

/**
 * Answer the remarriage status question
 */
export const fillRemarriageStatus = testData => {
  selectYesNoWebComponent('hasRemarried', testData.hasRemarried);
};

/**
 * Fill marriage information details
 */
export const fillMarriageInfo = testData => {
  const { remarriage } = testData;

  fillDateWebComponentPattern(
    'remarriage_dateOfMarriage',
    remarriage.dateOfMarriage,
  );
  fillFullNameWebComponentPattern(
    'remarriage_spouseName',
    remarriage.spouseName,
  );
  fillDateWebComponentPattern(
    'remarriage_spouseDateOfBirth',
    remarriage.spouseDateOfBirth,
  );
  fillTextWebComponent('remarriage_ageAtMarriage', remarriage.ageAtMarriage);
};

/**
 * Answer spouse veteran status question
 */
export const fillSpouseVeteranStatus = testData => {
  selectYesNoWebComponent(
    'remarriage_spouseIsVeteran',
    testData.remarriage.spouseIsVeteran,
  );
};

/**
 * Fill spouse veteran identification information
 */
export const fillSpouseVeteranId = testData => {
  const { spouseVeteranId } = testData.remarriage;

  if (spouseVeteranId?.vaFileNumber) {
    fillTextWebComponent(
      'remarriage_spouseVeteranId_vaFileNumber',
      spouseVeteranId.vaFileNumber,
    );
  }
  if (spouseVeteranId?.ssn) {
    fillTextWebComponent('remarriage_spouseVeteranId_ssn', spouseVeteranId.ssn);
  }
};

/**
 * Answer remarriage termination status question
 */
export const fillTerminationStatus = testData => {
  selectYesNoWebComponent(
    'remarriage_hasTerminated',
    testData.remarriage.hasTerminated,
  );
};

/**
 * Fill remarriage termination details
 */
export const fillTerminationDetails = testData => {
  const { remarriage } = testData;

  fillDateWebComponentPattern(
    'remarriage_terminationDate',
    remarriage.terminationDate,
  );
  fillTextWebComponent(
    'remarriage_terminationReason',
    remarriage.terminationReason,
  );
};
