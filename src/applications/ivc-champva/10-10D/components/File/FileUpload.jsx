import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';

export function FileFieldCustom(props) {
  const navButtons = <FormNavButtons goBack={props.goBack} submitToContinue />;
  // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
  const updateButton = <button type="submit">Update page</button>;

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
        data={props.data}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props}
        trackingPrefix={props.trackingPrefix}
        onChange={props.onChange}
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
  props: PropTypes.shape({
    schema: PropTypes.object,
    uiSchema: PropTypes.object,
    name: PropTypes.string || PropTypes.func,
    title: PropTypes.string || PropTypes.func,
    data: PropTypes.object,
    pagePerItemIndex: PropTypes.string || PropTypes.number,
    formContext: PropTypes.object,
    trackingPrefix: PropTypes.string,
    onChange: PropTypes.func,
    contentAfterButtons: PropTypes.any,
    contentBeforeButtons: PropTypes.any,
    setFormData: PropTypes.func,
    goToPath: PropTypes.func,
    goForward: PropTypes.func,
  }),
};
export default FileFieldCustom;
