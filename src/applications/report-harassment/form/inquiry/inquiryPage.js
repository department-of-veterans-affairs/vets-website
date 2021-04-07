import fullSchema from '../0873-schema.json';
import { incidentTypeTitle } from '../../constants/labels';

const {
  incidentType,
  facilityInformation,
  anonymousReport,
} = fullSchema.properties;

const formFields = {
  incidentType: 'incidentType',
  facilityInformation: 'facilityInformation',
  anonymousReport: 'anonymousReport',
};

const inquiryPage = {
  uiSchema: {
    [formFields.incidentType]: {
      'ui:title': incidentTypeTitle,
      'ui:widget': 'radio',
    },
    [formFields.facilityInformation]: {
      'ui:title': `At what facility did the incident occur?`,
      code: {
        'ui:title': 'Facility Code',
        'ui:widget': 'FacilityFinderWidget',
      },
    },
    [formFields.anonymousReport]: {
      'ui:title': `Report anonymously?`,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: [formFields.incidentType, formFields.anonymousReport],
    properties: {
      [formFields.incidentType]: incidentType,
      [formFields.facilityInformation]: facilityInformation,
      [formFields.anonymousReport]: anonymousReport,
    },
  },
};

export default inquiryPage;
