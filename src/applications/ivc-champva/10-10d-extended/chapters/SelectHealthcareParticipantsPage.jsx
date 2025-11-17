/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  titleUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomPageNavButtons } from '../../shared/components/CustomPageNavButtons';
import { toHash, nameWording } from '../../shared/utilities';

// This is the original schema that will be dynamically overrulled as soon
// as the user lands on this page. We need this since we won't have the
// applicants array at initial form load.
export const selectHealthcareParticipantsPage = {
  uiSchema: {
    ...titleUI('Applicant’s other health insurance'),
    healthcareParticipants: checkboxGroupUI({
      title: 'Which applicant(s) have this insurance plan?',
      hint: 'Check all that apply.',
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
      healthcareParticipants: checkboxGroupSchema(['na']),
    },
  },
};

/**
 * This function creates a checkbox schema/uiSchema that includes
 * dynamic checkbox labels/values based on the applicants array
 * available in the form data. It allows us to have a checkbox
 * button for each applicant outside the list loop and to dynamically
 * update the available buttons if applicant data changes.
 * @param {Object} data Full form data
 * @param {Object} item Current list item data
 * @returns Object containing a checkboxgroup uiSchema and schema
 */
function dynamicSchema(data, item) {
  let labels = data?.applicants?.map(app => {
    return {
      [toHash(app.applicantSSN)]: nameWording(app, false, false, false),
    };
  });

  // Combine all into a single object
  labels = Object.assign({}, ...labels);

  return {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        `${item.provider} other health insurance`,
      ),
      healthcareParticipants: checkboxGroupUI({
        title: 'Which applicant or applicants has this plan?',
        hint: 'Select all that apply',
        required: () => true,
        labels,
      }),
    },
    schema: {
      type: 'object',
      required: ['healthcareParticipants'],
      properties: {
        healthcareParticipants: checkboxGroupSchema(Object.keys(labels)),
      },
    },
  };
}

export function selectHealthcareParticipantsOnGoForward(props) {
  const insuranceWithApplicants = props?.fullData?.healthInsurance.map(ins => {
    return { ...ins, 'view:applicantObjects': props.fullData.applicants };
  });
  props.setFormData({
    ...props.fullData,
    healthInsurance: insuranceWithApplicants,
  });
}

/** @type {CustomPageType} */
export function SelectHealthcareParticipantsPage(props) {
  const sch = dynamicSchema(props?.fullData, props?.data);
  const navButtons = CustomPageNavButtons({
    ...props,
    onContinue: () => selectHealthcareParticipantsOnGoForward(props),
  });

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
        {navButtons}
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

SelectHealthcareParticipantsPage.propTypes = {
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
