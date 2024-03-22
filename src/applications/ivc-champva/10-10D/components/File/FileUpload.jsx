import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';

export function FileFieldCustom(props) {
  const navButtons = <FormNavButtons goBack={props.goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = (
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  function customSet(data) {
    if (props.pagePerItemIndex !== undefined) {
      // We're editing an array item (an applicant) on the review page
      const tmpData = props.data;
      tmpData.applicants[props.pagePerItemIndex] = data;
      props.setFormData(tmpData);
    } else {
      // Just update all the form data like normal
      props.setFormData(data);
    }
  }

  const onGoForward = args => {
    // Check if url is a review page
    const urlParams = new URLSearchParams(window?.location?.search);
    if (urlParams.get('fileReview') === 'true') {
      props.goToPath('/supporting-files');
    } else {
      props.goForward(args);
    }
  };

  return (
    <>
      <SchemaForm
        schema={props.schema}
        uiSchema={props.uiSchema}
        name={props.name}
        title={props.title}
        pagePerItemIndex={props.pagePerItemIndex}
        data={
          props.pagePerItemIndex !== undefined && props.onReviewPage
            ? props.data.applicants[props.pagePerItemIndex]
            : props.data
        }
        formContext={props}
        trackingPrefix={props.trackingPrefix}
        onChange={props.onReviewPage ? customSet : props.onChange}
        onSubmit={onGoForward}
      >
        <div className="vads-u-margin-top--4">
          {props.contentBeforeButtons}
          {props.onReviewPage ? updateButton : navButtons}
          {props.contentAfterButtons}
        </div>
      </SchemaForm>
    </>
  );
}

// TODO: update these:
FileFieldCustom.propTypes = {
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  name: PropTypes.string || PropTypes.func,
  onChange: PropTypes.func,
  // eslint-disable-next-line react/sort-prop-types
  onReviewPage: PropTypes.bool,
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  schema: PropTypes.object,
  title: PropTypes.string || PropTypes.func,
  trackingPrefix: PropTypes.string,
  uiSchema: PropTypes.object,
  contentAfterButtons: PropTypes.any,
  contentBeforeButtons: PropTypes.any,
  setFormData: PropTypes.func,
  goToPath: PropTypes.func,
  goForward: PropTypes.func,
};
export default FileFieldCustom;
