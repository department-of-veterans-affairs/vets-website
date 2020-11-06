import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  dateOfDeathTitle,
  isDeceasedTitle,
  isDependentTitle,
  relationshipToVeteranTitle,
  veteranStatusSectionDescription,
  veteranStatusTitle,
} from '../../../constants/labels';

const formFields = {
  veteranStatus: 'veteranStatus',
  isDependent: 'isDependent',
  relationshipToVeteran: 'relationshipToVeteran',
  veteranIsDeceased: 'veteranIsDeceased',
  dateOfDeath: 'dateOfDeath',
};

const requireVetRelationship = selectedVeteranStatus =>
  selectedVeteranStatus === 'behalf of vet' ||
  selectedVeteranStatus === 'dependent';

const requireDeathInfo = formData => {
  const { veteranStatus, relationshipToVeteran } = formData.veteranStatus;

  if (relationshipToVeteran === 'Veteran') {
    return false;
  }

  return veteranStatus === 'dependent' || veteranStatus === 'behalf of vet';
};

export const requireServiceInfo = selectedVeteranStatus =>
  selectedVeteranStatus && selectedVeteranStatus !== 'general';

export const veteranStatusUI = {
  'ui:description': veteranStatusSectionDescription,
  [formFields.veteranStatus]: {
    'ui:title': veteranStatusTitle,
  },
  [formFields.isDependent]: {
    'ui:title': isDependentTitle,
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      formData.veteranStatus.veteranStatus === 'dependent',
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: 'dependent',
    },
  },
  [formFields.relationshipToVeteran]: {
    'ui:title': relationshipToVeteranTitle,
    'ui:required': formData =>
      requireVetRelationship(formData.veteranStatus.veteranStatus),
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: requireVetRelationship,
    },
  },
  [formFields.veteranIsDeceased]: {
    'ui:title': isDeceasedTitle,
    'ui:widget': 'yesNo',
    'ui:required': requireDeathInfo,
    'ui:options': {
      expandUnder: 'veteranStatus',
      hideIf: formData => {
        return !requireDeathInfo(formData);
      },
    },
  },
  [formFields.dateOfDeath]: {
    ...currentOrPastDateUI(dateOfDeathTitle),
    ...{
      'ui:options': {
        expandUnder: 'veteranStatus',
        hideIf: formData => {
          const showDateOfDeath =
            formData.veteranStatus.veteranIsDeceased &&
            requireDeathInfo(formData);

          return !showDateOfDeath;
        },
      },
    },
  },
};
