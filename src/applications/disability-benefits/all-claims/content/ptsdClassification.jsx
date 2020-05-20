import React from 'react';
import _ from 'platform/utilities/data';

export const getPtsdClassification = (formData, formType) => {
  const isCombat = _.get(
    'view:selectablePtsdTypes.view:combatPtsdType',
    formData,
    false,
  );
  const isNonCombat = _.get(
    'view:selectablePtsdTypes.view:nonCombatPtsdType',
    formData,
    false,
  );
  const isAssault = _.get(
    'view:selectablePtsdTypes.view:assaultPtsdType',
    formData,
    false,
  );
  const isMst = _.get(
    'view:selectablePtsdTypes.view:mstPtsdType',
    formData,
    false,
  );
  let incidentTitle;
  let incidentText;
  const is781 = formType === '781';

  switch (true) {
    case isCombat && isNonCombat && is781:
      incidentTitle = 'Combat & non-combat';

      incidentText = 'combat and non-combat';
      break;

    case isAssault && isMst && !is781:
      incidentTitle = 'Personal assault & sexual trauma';
      incidentText = 'personal assault and sexual trauma';
      break;

    case isCombat && is781:
      incidentTitle = 'Combat';
      incidentText = 'combat';
      break;

    case isNonCombat && is781:
      incidentTitle = 'Non-combat';
      incidentText = 'non-combat';
      break;

    case isAssault && !is781:
      incidentTitle = 'Personal assault';
      incidentText = 'personal assault';
      break;

    case isMst && !is781:
      incidentTitle = 'Sexual trauma';
      incidentText = 'sexual trauma';
      break;

    default:
      incidentTitle = '';
      incidentText = '';
  }
  return { incidentTitle, incidentText };
};

export const PtsdNameTitle = ({ formData, formType }) => {
  const { incidentTitle } = getPtsdClassification(formData, formType);
  return (
    <legend className="schemaform-block-title schemaform-title-underline">
      {`PTSD: ${incidentTitle}`}
    </legend>
  );
};
export const ptsd781NameTitle = ({ formData }) => (
  <PtsdNameTitle formData={formData} formType="781" />
);

export const ptsd781aNameTitle = ({ formData }) => (
  <PtsdNameTitle formData={formData} formType="781a" />
);
