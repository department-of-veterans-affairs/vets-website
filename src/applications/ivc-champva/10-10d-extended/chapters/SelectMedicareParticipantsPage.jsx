/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { toHash, nameWording } from '../../shared/utilities';

// This is the original schema that will be dynamically overrulled as soon
// as the user lands on this page. We need this since we won't have the
// applicants array at initial form load.
export const selectMedicareParticipantPage = {
  uiSchema: {
    ...titleUI('Applicant Medicare plans'),
    medicareParticipant: radioUI({
      title: 'Which applicant would you like to add Medicare insurance for?',
      hint:
        'If you have more applicants with Medicare plans you can add them later in this form.',
      required: () => true,
      labels: {
        na: 'NA',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      titleSchema,
      medicareParticipant: radioSchema(['na']),
    },
  },
};

/**
 * Gets applicants eligible for Medicare selection
 * @param {Object} data Form data
 * @param {number} idx Current index in medicare array
 * @returns {Array} Filtered array of eligible applicants
 */
function getEligibleApplicants(data, idx) {
  const applicants = data?.applicants ?? [];
  const medicareData = data?.medicare;

  // If no Medicare data exists, return all applicants
  if (!medicareData || medicareData.length === 0) {
    return applicants;
  }

  // Get Medicare entries excluding current one
  const otherMedicareEntries = medicareData.toSpliced(idx, 1) ?? [];

  // Return applicants not already selected for Medicare
  return applicants.filter(applicant => {
    const applicantHash = toHash(applicant.applicantSSN);
    const alreadySelected = otherMedicareEntries.some(
      entry => entry.medicareParticipant === applicantHash,
    );
    return !alreadySelected;
  });
}

/**
 * Creates labels object for radio buttons
 * @param {Array} applicants List of applicants
 * @returns {Object} Combined labels object
 */
function createApplicantLabels(applicants) {
  const labelObjects = applicants.map(applicant => ({
    [toHash(applicant.applicantSSN)]: nameWording(
      applicant,
      false,
      false,
      false,
    ),
  }));

  return Object.assign({}, ...labelObjects);
}

/**
 * Creates UI schema for the form
 * @param {string} title Form title
 * @param {Object} labels Label objects for radio buttons
 * @returns {Object} UI schema
 */
function createParticipantUiSchema(title, labels) {
  return {
    ...arrayBuilderItemSubsequentPageTitleUI('Applicant Medicare plans'),
    medicareParticipant: radioUI({
      title,
      hint:
        'If you have more applicants with Medicare plans you can add them later in this form.',
      required: () => true,
      labels,
    }),
  };
}

/**
 * Creates JSON schema for the form
 * @param {Object} labels Label objects for radio buttons
 * @returns {Object} JSON schema
 */
function createParticipantSchema(labels) {
  return {
    type: 'object',
    required: ['medicareParticipant'],
    properties: {
      titleSchema,
      medicareParticipant: radioSchema(Object.keys(labels)),
    },
  };
}

/**
 * This function creates a radio schema/uiSchema that includes
 * dynamic labels/values based on the applicants array available
 * in the form data. It allows us to have a radio
 * button for each applicant outside the list loop and to dynamically
 * update the available buttons if applicant data changes.
 * @param {Object} data Full form data
 * @param {Object} item Current list item data
 * @param {number} idx Current index in the medicare array
 * @returns {Object} Object containing a radio uiSchema and schema
 */
function dynamicParticipantSchema(data, item, idx) {
  // Get eligible applicants (those not already selected for Medicare)
  const eligibleApplicants = getEligibleApplicants(data, idx);

  // Create labels for radio buttons
  const labels = createApplicantLabels(eligibleApplicants);

  const title = 'Which applicant would you like to add Medicare insurance for?';

  return {
    uiSchema: createParticipantUiSchema(title, labels),
    schema: createParticipantSchema(labels),
  };
}

export function selectMedicareParticipantOnGoForward(props) {
  const medicareWithApplicants = props?.fullData?.medicare.map(med => {
    return {
      ...med,
      'view:applicantObjects': props.fullData.applicants,
    };
  });
  props.setFormData({
    ...props.fullData,
    medicare: medicareWithApplicants,
  });
}

/** @type {CustomPageType} */
export function SelectMedicareParticipantPage(props) {
  const sch = dynamicParticipantSchema(
    props?.fullData,
    props?.data,
    props?.pagePerItemIndex,
  );

  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      data={props.data}
      appStateData={props.appStateData}
      schema={sch.schema} // dynamically computed checkbox schema
      uiSchema={sch.uiSchema} // dynamically computed checkbox schema
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={props.formContext}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        <FormNavButtons
          goBack={props.goBack}
          goForward={() => selectMedicareParticipantOnGoForward(props)}
          submitToContinue
        />
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

SelectMedicareParticipantPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  fullData: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
};
