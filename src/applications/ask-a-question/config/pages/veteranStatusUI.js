import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import sectionHeader from '../../content/SectionHeader';

const formFields = {
  veteranStatus: 'veteranStatus',
  isDependent: 'isDependent',
  relationshipToVeteran: 'relationshipToVeteran',
  veteranIsDeceased: 'veteranIsDeceased',
  dateOfDeath: 'dateOfDeath',
  branchOfService: 'branchOfService',
};

const requireVetRelationship = selectedVeteranStatus =>
  selectedVeteranStatus === 'behalf of vet' ||
  selectedVeteranStatus === 'dependent';

const requireServiceInfo = selectedVeteranStatus =>
  selectedVeteranStatus && selectedVeteranStatus !== 'general';

const hideDateOfDeath = selectedVeteranStatus =>
  selectedVeteranStatus === 'vet' || selectedVeteranStatus === 'general';

export const veteranStatusUI = {
  'ui:description': sectionHeader('Veteran Service Information'),
  [formFields.veteranStatus]: {
    'ui:title': 'My message is about benefits/services',
  },
  [formFields.isDependent]: {
    'ui:title': 'Are you the dependent?',
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      formData.veteranStatus.veteranStatus === 'dependent',
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: 'dependent',
    },
  },
  [formFields.relationshipToVeteran]: {
    'ui:title': 'Your relationship to the Veteran',
    'ui:required': formData =>
      requireVetRelationship(formData.veteranStatus.veteranStatus),
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: requireVetRelationship,
    },
  },
  [formFields.veteranIsDeceased]: {
    'ui:title': 'Is the Veteran deceased?',
    'ui:widget': 'yesNo',
    'ui:required': formData =>
      requireVetRelationship(formData.veteranStatus.veteranStatus),
    'ui:options': {
      expandUnder: 'veteranStatus',
      expandUnderCondition: requireVetRelationship,
    },
  },
  [formFields.dateOfDeath]: {
    ...currentOrPastDateUI('Date of Death if known'),
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
  [formFields.branchOfService]: {
    'ui:title': 'Branch of service',
    'ui:required': formData =>
      requireServiceInfo(formData.veteranStatus.veteranStatus),
    'ui:options': {
      hideIf: formData =>
        !requireServiceInfo(formData.veteranStatus.veteranStatus),
    },
  },
};
