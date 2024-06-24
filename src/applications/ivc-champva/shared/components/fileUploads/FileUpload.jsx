import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import MissingFileOverview, { hasReq } from './MissingFileOverview';

export function FileFieldCustom(props) {
  const updateButton = (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  /* Run this to track missing uploads as we go - this is necessary
  so that we can conditionally skip displaying the file overview page
  later in the form (because to show or hide depends on logic that
  would have to run inside that component, so we run it earlier). */
  try {
    MissingFileOverview({
      contentAfterButtons: props.contentAfterButtons,
      data: props.contentAfterButtons.props.form.data,
      goBack: props.goBack,
      goForward: props.goForward,
      disableLinks: true,
      setFormData: props.setFormData,
      showConsent: false,
      requiredFiles: props.requiredFiles, // To be injected via wrapper class
    });
  } catch (e) {
    // Let it fail - if this trips it most likely means we're uploading a
    // sponsor file and applicants array won't be defined till later.
  }

  function uploadsMissing(data) {
    return (
      hasReq(data.applicants, true, true) ||
      hasReq(data.applicants, false, true) ||
      hasReq(data, true, true) ||
      hasReq(data, false, true)
    );
  }

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

  function onGoForward(args) {
    // Check if url is a review page
    const urlParams = new URLSearchParams(window?.location?.search);
    if (urlParams.get('fileReview') === 'true') {
      /* Have to use contentAfterButtons' data because we might have
      just received a single list-loop element as our props.data,
      which would then lead us to the wrong conclusions */
      if (uploadsMissing(props.contentAfterButtons.props.form.data)) {
        props.goToPath('/supporting-files');
      } else {
        // Since we just uploaded the last file, bypass files overview page
        props.goToPath('/review-and-submit');
      }
    } else {
      props.goForward(args);
    }
  }

  function onGoBack(args) {
    const urlParams = new URLSearchParams(window?.location?.search);
    // If fileReview is true we're in the special file review flow, so we should
    // actually return to the file overview screen, which is technically forward.
    if (urlParams.get('fileReview') === 'true') {
      onGoForward(args);
    } else {
      props.goBack(args);
    }
  }

  const navButtons = <FormNavButtons goBack={onGoBack} submitToContinue />;

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

FileFieldCustom.propTypes = {
  contentAfterButtons: PropTypes.any,
  contentBeforeButtons: PropTypes.any,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  name: PropTypes.string || PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  requiredFiles: PropTypes.any,
  schema: PropTypes.object,
  setFormData: PropTypes.func,
  title: PropTypes.any,
  trackingPrefix: PropTypes.string,
  uiSchema: PropTypes.object,
  updatePage: PropTypes.func,
  onChange: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
export default FileFieldCustom;
