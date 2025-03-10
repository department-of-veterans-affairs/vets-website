import {
  checkboxGroupSchema,
  checkboxGroupUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithTag, form0781HeadingTag } from '../../content/form0781';
import {
  supportingEvidenceDescription,
  supportingEvidenceNoneLabel,
  supportingEvidenceAdditionalInformation,
  supportingEvidencePageTitle,
  validateSupportingEvidenceSelections,
  supportingEvidenceBuddyStatement,
  supportingEvidenceValidationError,
  showConflictingAlert,
} from '../../content/form0781/supportingEvidencePage';
import {
  SUPPORTING_EVIDENCE_SUBTITLES,
  SUPPORTING_EVIDENCE_REPORT,
  SUPPORTING_EVIDENCE_RECORD,
  SUPPORTING_EVIDENCE_WITNESS,
  SUPPORTING_EVIDENCE_OTHER,
} from '../../constants';

export const uiSchema = {
  'ui:title': titleWithTag(supportingEvidencePageTitle, form0781HeadingTag),
  'ui:description': supportingEvidenceDescription,
  'view:conflictingResponseAlert': {
    'ui:description': supportingEvidenceValidationError,
    'ui:options': {
      hideIf: formData => showConflictingAlert(formData) === false,
    },
  },
  supportingEvidenceReports: checkboxGroupUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.reports,
    labelHeaderLevel: '4',
    labels: {
      ...SUPPORTING_EVIDENCE_REPORT,
    },
    required: false,
  }),
  supportingEvidenceRecords: checkboxGroupUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.records,
    labelHeaderLevel: '4',
    labels: {
      ...SUPPORTING_EVIDENCE_RECORD,
    },
    required: false,
  }),
  supportingEvidenceWitness: checkboxGroupUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.witness,
    labelHeaderLevel: '4',
    labels: {
      ...SUPPORTING_EVIDENCE_WITNESS,
    },
    required: false,
  }),
  supportingEvidenceOther: checkboxGroupUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.other,
    labelHeaderLevel: '4',
    labels: {
      ...SUPPORTING_EVIDENCE_OTHER,
    },
    required: false,
  }),
  supportingEvidenceUnlisted: textUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.unlisted,
  }),
  supportingEvidenceNoneCheckbox: checkboxGroupUI({
    title: SUPPORTING_EVIDENCE_SUBTITLES.none,
    labelHeaderLevel: '4',
    labels: {
      none: supportingEvidenceNoneLabel,
    },
    required: false,
  }),
  'view:supportingEvidenceBuddyStatement': {
    'ui:description': supportingEvidenceBuddyStatement,
  },
  'view:supportingEvidenceAdditionalInformation': {
    'ui:description': supportingEvidenceAdditionalInformation,
  },
  'ui:validations': [validateSupportingEvidenceSelections],
};

export const schema = {
  type: 'object',
  properties: {
    'view:conflictingResponseAlert': {
      type: 'object',
      properties: {},
    },
    supportingEvidenceReports: checkboxGroupSchema(
      Object.keys(SUPPORTING_EVIDENCE_REPORT),
    ),
    supportingEvidenceRecords: checkboxGroupSchema(
      Object.keys(SUPPORTING_EVIDENCE_RECORD),
    ),
    supportingEvidenceWitness: checkboxGroupSchema(
      Object.keys(SUPPORTING_EVIDENCE_WITNESS),
    ),
    supportingEvidenceOther: checkboxGroupSchema(
      Object.keys(SUPPORTING_EVIDENCE_OTHER),
    ),
    supportingEvidenceUnlisted: {
      type: 'string',
    },
    supportingEvidenceNoneCheckbox: checkboxGroupSchema(['none']),
    'view:supportingEvidenceBuddyStatement': {
      type: 'object',
      properties: {},
    },
    'view:supportingEvidenceAdditionalInformation': {
      type: 'object',
      properties: {},
    },
  },
};
