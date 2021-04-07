import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  dateOfDeathTitle,
  generalError,
  isDeceasedTitle,
  isDependentTitle,
  relationshipToVeteranError,
  relationshipToVeteranTitle,
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
  [formFields.veteranStatus]: {
    'ui:title': veteranStatusTitle,
    'ui:errorMessages': {
      required: generalError,
    },
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
    'ui:errorMessages': {
      required: generalError,
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
    'ui:errorMessages': {
      required: relationshipToVeteranError,
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
    'ui:errorMessages': {
      required: generalError,
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
