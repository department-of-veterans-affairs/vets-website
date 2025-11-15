/* eslint-disable react/sort-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomPageNavButtons } from '../../shared/components/CustomPageNavButtons';
import { nameWording, toHash } from '../../shared/utilities';

// similar to `toSpliced`, but simpler and actually works in testing framework
function dropItem(arr, targetIdx) {
  return arr.filter((_i, idx) => idx !== targetIdx);
}

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
  const otherMedicareEntries = dropItem(medicareData, idx) ?? [];

  // Return applicants not already selected for Medicare
  return applicants.filter(applicant => {
    const applicantHash = toHash(applicant.applicantSsn);
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
    [toHash(applicant.applicantSsn)]: nameWording(
      applicant,
      false,
      false,
      false,
    ),
  }));

  return Object.assign({}, ...labelObjects);
}

// This is the original schema that will be dynamically overridden as soon
// as the user lands on this page. We need this since we won't have the
// applicants array at initial form load.
export const selectMedicareParticipantPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI('Applicant Medicare plans'),
    medicareParticipant: {
      ...radioUI({
        title: 'Which applicant would you like to add Medicare insurance for?',
        hint:
          'If you have more applicants with Medicare plans, you can add them later in this form.',
        labels: {
          na: 'NA',
        },
        updateSchema: (
          formData,
          _schema,
          _uiSchema,
          index,
          _path,
          formContext,
        ) => {
          const fullData = formContext?.reviewMode
            ? formData
            : formContext || formData;
          const pagePerItemIndex = index;

          const eligibleApplicants = getEligibleApplicants(
            fullData,
            pagePerItemIndex,
          );
          const labels = createApplicantLabels(eligibleApplicants);

          return {
            enum: Object.keys(labels).length > 0 ? Object.keys(labels) : ['na'],
            enumNames:
              Object.keys(labels).length > 0
                ? Object.values(labels)
                : ['No eligible applicants'],
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['medicareParticipant'],
    properties: {
      medicareParticipant: radioSchema(['na']),
    },
  },
};

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
  const navButtons = CustomPageNavButtons({
    ...props,
    onContinue: () => {
      return selectMedicareParticipantOnGoForward(props);
    },
  });
  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      hint={props.hint}
      data={props.data}
      appStateData={props.appStateData}
      schema={props.schema}
      uiSchema={props.uiSchema}
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={{
        ...props.formContext,
        ...props.fullData,
        pagePerItemIndex: props.pagePerItemIndex,
      }}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {props.contentBeforeButtons}
        {navButtons}
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
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setFormData: PropTypes.func,
  title: PropTypes.string,
  hint: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
};
