import React from 'react';
import _ from '../../../../platform/utilities/data';

export const getPtsdClassification = (formData, formType) => {
  const isCombat = _.get(
    'view:selectablePtsdTypes.view:combatPtsdType',
    formData,
    false,
  );
  const isNonCombat = _.get(
    'view:selectablePtsdTypes.view:noncombatPtsdType',
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
      incidentTitle =
        'Combat & Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';

      incidentText =
        'Combat and Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      break;

    case isAssault && isMst && !is781:
      incidentTitle = 'Personal Assault & Military Sexual Trauma';
      incidentText = 'Personal Assault and Military Sexual Trauma';
      break;

    case isCombat && is781:
      incidentTitle = 'Combat';
      incidentText = 'Combat';
      break;

    case isNonCombat && is781:
      incidentTitle =
        'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      incidentText =
        'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      break;

    case isAssault && !is781:
      incidentTitle = 'Personal Assault';
      incidentText = 'Personal Assault';
      break;

    case isMst && !is781:
      incidentTitle = 'Military Sexual Trauma';
      incidentText = 'Military Sexual Trauma';
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
      {incidentTitle}
    </legend>
  );
};
