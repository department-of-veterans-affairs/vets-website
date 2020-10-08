import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  dateOfDeathTitle,
  isDeceasedTitle,
  isDependentTitle,
  relationshipToVeteranTitle,
  veteranStatusSectionDescription,
  veteranStatusTitle,
} from '../../content/labels';

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

export const requireServiceInfo = selectedVeteranStatus =>
  selectedVeteranStatus && selectedVeteranStatus !== 'general';

const hideDateOfDeath = selectedVeteranStatus =>
  selectedVeteranStatus === 'vet' || selectedVeteranStatus === 'general';

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
    'ui:required': formData =>
      requireVetRelationship(formData.veteranStatus.veteranStatus),
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: requireVetRelationship,
    },
  },
  [formFields.dateOfDeath]: {
    ...currentOrPastDateUI(dateOfDeathTitle),
    ...{
      'ui:options': {
        expandUnder: 'veteranStatus',
        hideIf: formData => {
          return !!(
            hideDateOfDeath(formData.veteranStatus.veteranStatus) ||
            !formData.veteranStatus.veteranIsDeceased
          );
        },
      },
    },
  },
};
