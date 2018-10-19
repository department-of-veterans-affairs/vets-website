import React from 'react';

import { get781Type } from '../utils';

export const getPtsdClassification = formData => {
  const formType = get781Type(formData);
  const classifications = formData['view:selectablePtsdTypes'];
  let incidentTitle;
  let incidentText;
  const is781 = formType === '781';

  switch (true) {
    case classifications['view:combatPtsdType'] &&
      classifications['view:noncombatPtsdType'] &&
      is781:
      incidentTitle =
        'Combat & Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';

      incidentText =
        'Combat and Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      break;

    case classifications['view:assaultPtsdType'] &&
      classifications['view:mstPtsdType'] &&
      !is781:
      incidentTitle = 'Personal Assault & Military Sexual Trauma';
      incidentText = 'Personal Assault and Military Sexual Trauma';
      break;

    case classifications['view:combatPtsdType'] && is781:
      incidentTitle = 'Combat';
      incidentText = 'Combat';
      break;

    case classifications['view:noncombatPtsdType'] && is781:
      incidentTitle =
        'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      incidentText =
        'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault';
      break;

    case classifications['view:assaultPtsdType'] && !is781:
      incidentTitle = 'Personal Assault';
      incidentText = 'Personal Assault';
      break;

    case classifications['view:mstPtsdType'] && !is781:
      incidentTitle = 'Military Sexual Trauma';
      incidentText = 'Military Sexual Trauma';
      break;

    default:
      incidentTitle = '';
      incidentText = '';
  }
  return { incidentTitle, incidentText };
};

export const PtsdNameTitle = ({ formData }) => {
  const { incidentTitle } = getPtsdClassification(formData);
  return (
    <legend className="schemaform-block-title schemaform-title-underline">
      {incidentTitle}
    </legend>
  );
};
