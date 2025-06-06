/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

/** @type {CustomPageType} */
export function CustomApplicantSSNPage(props) {
  const updateButton = (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  const customSetFormData = args => {
    // Update current applicant without losing all form data
    const newData = { ...props.data };
    newData.applicants[props.pagePerItemIndex] = args;
    return newData;
  };

  const fullData = props.fullData ?? props.data;

  // Depending on if we're in the form flow or on review page this value
  // should be different:
  let pageData = props.data.applicants
    ? props.data.applicants?.[props?.pagePerItemIndex]
    : props.data;

  // Add some view values useful in the validator func (since full form
  // data isn't available within validator funcs in list loop V1)
  pageData = {
    ...pageData,
    'view:applicantSSNArray': [
      ...fullData?.applicants?.map(a => a?.applicantSSN),
    ],
    'view:sponsorSSN': fullData?.ssn,
    'view:pagePerItemIndex': props.pagePerItemIndex,
  };

  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      data={pageData}
      appStateData={props.appStateData}
      schema={props.schema}
      uiSchema={props.uiSchema}
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={props.formContext}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onReviewPage ? customSetFormData : props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        {props.onReviewPage ? (
          updateButton
        ) : (
          <FormNavButtons goBack={props.goBack} submitToContinue />
        )}
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

CustomApplicantSSNPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  fullData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFormData: PropTypes.func,
  title: PropTypes.func,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
};
