import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import {
  titleUI,
  textUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import { medicalTreatmentRecordsFields } from '../definitions/constants';
import { DateRangeView } from '../components/viewElements';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: medicalTreatmentRecordsFields.parentObject,
  nounSingular: 'medical treatment record',
  nounPlural: 'medical treatment records',
  required: false,
  isItemIncomplete: item =>
    (!item?.[medicalTreatmentRecordsFields.doctorName] &&
      !item?.[medicalTreatmentRecordsFields.hospitalName]) ||
    (!item?.[medicalTreatmentRecordsFields.doctorAddress] &&
      !item?.[medicalTreatmentRecordsFields.hospitalAddress]),
  maxItems: 4,
  text: {
    getItemName: item =>
      item[medicalTreatmentRecordsFields.doctorName] ||
      item[medicalTreatmentRecordsFields.hospitalName] ||
      'Medical provider',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      'Medical Treatment Records',
      `In the next few questions, we'll ask you about your medical treatment records related to your disability. You may add up to ${
        options.maxItems
      } medical treatment records.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasMedicalTreatmentRecords': arrayBuilderYesNoUI(options, {
      title:
        "Have you been under a doctor's care and/or hospitalized within the past 12 months?",
    }),
    'view:treatmentAtNonVA': yesNoUI({
      title: 'Were you treated at a Non-VA hospital or VA hospital?',
      labels: {
        Y: 'Yes, I was treated at a Non-VA hospital',
        N: 'No, I was not treated at a Non-VA hospital',
      },
      errorMessages: {
        required: 'Please select if you were treated at a Non-VA hospital.',
      },
    }),
    'view:nonVAAuthorizationInfo': {
      'ui:description': () => (
        <div>
          <p>
            <strong>Important:</strong> You must authorize the release of non-VA
            medical information to VA using these forms:
          </p>
          <ul>
            <li>
              <va-link
                href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/introduction"
                text="VA Form 21-4142 - Authorization to Disclose Information to the Department of Veterans Affairs"
              />
            </li>
            <li>
              <va-link
                href="/find-forms/about-form-21-4142a/"
                text="VA Form 21-4142a - General Release for Medical Provider Information to the Department of Veterans Affairs"
              />
            </li>
          </ul>
          <p>
            These forms allow VA to request your medical records from non-VA
            healthcare providers.
          </p>
        </div>
      ),
      'ui:options': {
        expandUnder: 'view:treatmentAtNonVA',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasMedicalTreatmentRecords': arrayBuilderYesNoSchema,
      'view:treatmentAtNonVA': yesNoSchema,
      'view:nonVAAuthorizationInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['view:hasMedicalTreatmentRecords', 'view:treatmentAtNonVA'],
  },
};

/** @returns {PageSchema} */
const doctorInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Doctor information',
      nounSingular: options.nounSingular,
    }),
    /*...textUI(
      '',
      'Please provide information about the doctor who treated you. If you were not seen by a specific doctor, you can leave the doctor name field blank.',
    ),*/
    [medicalTreatmentRecordsFields.doctorName]: textUI({
      title: 'Name of doctor (if applicable)',
      hint: 'Leave blank if you were not treated by a specific doctor',
    }),
    [medicalTreatmentRecordsFields.doctorAddress]: addressNoMilitaryUI({
      title: 'Doctor address',
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [medicalTreatmentRecordsFields.doctorName]: {
        type: 'string',
        maxLength: 100,
      },
      [medicalTreatmentRecordsFields.doctorAddress]: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};

/** @returns {PageSchema} */
const hospitalInformationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Hospital information for ${formData[
          medicalTreatmentRecordsFields.doctorName
        ] || 'medical treatment'}`,
    ),

    [medicalTreatmentRecordsFields.hospitalName]: textUI({
      title: 'Name of hospital (if applicable)',
      hint: 'Leave blank if you were not treated at a hospital',
    }),
    [medicalTreatmentRecordsFields.hospitalAddress]: addressNoMilitaryUI({
      title: 'Hospital address',
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      [medicalTreatmentRecordsFields.hospitalName]: {
        type: 'string',
        maxLength: 100,
      },
      [medicalTreatmentRecordsFields.hospitalAddress]: addressNoMilitarySchema({
        omit: ['street3'],
      }),
    },
  },
};

/** @returns {PageSchema} */
const treatmentDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Treatment dates for ${formData[
          medicalTreatmentRecordsFields.doctorName
        ] ||
          formData[medicalTreatmentRecordsFields.hospitalName] ||
          'medical provider'}`,
    ),

    /*  ...textUI(
      'Please provide information about the hospital where you were treated. If you were not treated you do not need to add a date range. Maybe add up to two treatment dates, any additional dates should be added in Section 5 - Remarks under additional information',
    ),*/
    treatmentDates: {
      'ui:options': {
        itemName: 'Treatment Date',
        viewField: DateRangeView,
        customTitle: 'Your treatment dates',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this treatment date?',
        addAnotherText: 'Add another treatment date',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        startDate: currentOrPastDateUI('Start date'),
        endDate: {
          ...currentOrPastDateUI('End date (if applicable)'),
          'ui:required': () => false,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      treatmentDates: {
        type: 'array',
        minItems: 0,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate'],
        },
      },
    },
  },
};

/** @returns {PageSchema} */
const hospitalizationDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `Hospitalization dates for ${formData[
          medicalTreatmentRecordsFields.doctorName
        ] ||
          formData[medicalTreatmentRecordsFields.hospitalName] ||
          'medical provider'}`,
    ),
    /* ...textUI(
      'Please provide dates for your hospitalization. If you were not hospitalized then you do not need to add a date range. May add up to two treatment dates, any additional dates should be added in Section 5 - Remarks under additional information',
    ),*/
    hospitalizationDates: {
      'ui:options': {
        itemName: 'Hospitalization Date',
        viewField: DateRangeView,
        customTitle: 'Your hospitalization dates',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this hospitalization date?',
        addAnotherText: 'Add another hospitalization date',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        startDate: currentOrPastDateUI('Start date'),
        endDate: {
          ...currentOrPastDateUI('End date (if applicable)'),
          'ui:required': () => false,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hospitalizationDates: {
        type: 'array',
        minItems: 0,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate'],
        },
      },
    },
  },
};

export default arrayBuilderPages(options, pageBuilder => ({
  medicalTreatmentRecordsIntro: pageBuilder.introPage({
    title: 'Medical treatment records',
    path: 'medical-treatment-records',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  medicalTreatmentRecordsSummary: pageBuilder.summaryPage({
    title: 'Review your medical treatment records',
    path: 'medical-treatment-records-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  medicalTreatmentRecordsDoctorPage: pageBuilder.itemPage({
    title: 'Doctor Information',
    path: 'medical-treatment-records/:index/doctor-information',
    uiSchema: doctorInformationPage.uiSchema,
    schema: doctorInformationPage.schema,
  }),
  medicalTreatmentRecordsHospitalPage: pageBuilder.itemPage({
    title: 'Hospital Information',
    path: 'medical-treatment-records/:index/hospital-information',
    uiSchema: hospitalInformationPage.uiSchema,
    schema: hospitalInformationPage.schema,
  }),
  medicalTreatmentRecordsTreatmentDatesPage: pageBuilder.itemPage({
    title: 'Treatment Dates',
    path: 'medical-treatment-records/:index/treatment-dates',
    uiSchema: treatmentDatesPage.uiSchema,
    schema: treatmentDatesPage.schema,
  }),
  medicalTreatmentRecordsHospitalizationDatesPage: pageBuilder.itemPage({
    title: 'Hospitalization Dates',
    path: 'medical-treatment-records/:index/hospitalization-dates',
    uiSchema: hospitalizationDatesPage.uiSchema,
    schema: hospitalizationDatesPage.schema,
  }),
}));
