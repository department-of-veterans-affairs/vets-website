/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  titleUI,
  titleSchema,
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

// This is the original schema that will be dynamically overrulled as soon
// as the user lands on this page. We need this since we won't have the
// applicants array at initial form load.
export const selectHealthcareParticipantsPage = {
  uiSchema: {
    ...titleUI('Select healthcare participants', 'We demand data'),
    healthcareParticipants: checkboxGroupUI({
      title: 'Which participants are on this healthcare?',
      hint: 'More data, please',
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
 * @param {Object} data Form data
 * @returns Object containing a checkboxgroup uiSchema and schema
 */
function dynamicSchema(data) {
  let labels = data.applicants.map(app => {
    // Regretable, but applicantSSN is the only guaranteed unique key we could
    // use in this context. Since the SSNs are just floating around in the
    // form data already it's not really any less secure to use them here...
    return {
      [app.applicantSSN]: app.applicantName.first,
    };
  });

  // Combine all into a single object
  labels = Object.assign({}, ...labels);

  return {
    uiSchema: {
      ...titleUI('Select healthcare participants', 'We demand data'),
      healthcareParticipants: checkboxGroupUI({
        title: 'Which participants are on this healthcare?',
        hint: 'More data, please',
        required: () => true,
        labels,
      }),
    },
    schema: {
      type: 'object',
      required: [],
      properties: {
        titleSchema,
        healthcareParticipants: checkboxGroupSchema(Object.keys(labels)),
      },
    },
  };
}

export function selectHealthcareParticipantsOnGoForward(props) {
  // TODO: if any modifications to data need to happen, this is
  // where we would do it. (e.g., use the checkbox values to populate
  // a second list loop with health insurance info)
  const formData = props.data; // changes made here will reflect in global formData;
}

/** @type {CustomPageType} */
export function SelectHealthcareParticipantsPage(props) {
  const updateButton = (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  const sch = dynamicSchema(props.data);

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
      onChange={props.onReviewPage ? props.setFormData : props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        {props.onReviewPage ? (
          updateButton
        ) : (
          <FormNavButtons
            goBack={props.goBack}
            goForward={() => selectHealthcareParticipantsOnGoForward(props)}
            submitToContinue
          />
        )}
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
