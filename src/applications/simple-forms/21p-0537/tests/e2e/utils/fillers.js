import {
  fillTextWebComponent,
  fillFullNameWebComponentPattern,
  fillDateWebComponentPattern,
} from '../../../../shared/tests/e2e/helpers';

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
