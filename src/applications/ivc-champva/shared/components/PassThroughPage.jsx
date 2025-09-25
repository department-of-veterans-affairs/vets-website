/**
 * generic passthrough custom page, useful for accessing full form data
 * in arraybuilder/list loop pages, and for attaching custom goforward/goback
 * logic to a page.
 */

import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { CustomPageNavButtons } from './CustomPageNavButtons';

/** @type {CustomPageType} */
export function PassThroughPage(props) {
  const updateButton = (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  const navButtons = CustomPageNavButtons(props);

  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      data={props.data}
      appStateData={props.appStateData}
      schema={props.schema}
      uiSchema={props.uiSchema}
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={props.formContext}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onReviewPage ? props.setFormData : props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        {props.onReviewPage ? updateButton : navButtons}
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

PassThroughPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
};
