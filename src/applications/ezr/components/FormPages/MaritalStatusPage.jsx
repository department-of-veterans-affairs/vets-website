/* eslint-disable react/sort-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getFormContext } from 'platform/forms/save-in-progress/selectors';
import content from 'applications/ezr/locales/en/content.json';
import { replaceStrValues } from 'applications/ezr/utils/helpers/general';

/**
 * This page is used to change the marital status of the veteran.
 * It displays a modal to confirm the change.
 * It also updates the marital status in the form data.
 */
/** @type {CustomPageType} */
function MaritalStatusPage(props) {
  const {
    name,
    title,
    data,
    appStateData,
    schema,
    uiSchema,
    pagePerItemIndex,
    formContext,
    trackingPrefix,
    contentBeforeButtons,
    contentAfterButtons,
    onChange,
    onSubmit,
    NavButtons: FormNavButtons,
  } = props;
  const [modal, setModal] = useState(false);
  const [newMaritalStatus, setNewMaritalStatus] = useState(null);
  // Modal content.
  const modalTitle = content['household-spouse-status-change-modal-title'];
  const modalCancelDescription = replaceStrValues(
    content['household-spouse-status-change-modal-text'],
    newMaritalStatus,
  );
  const primaryButtonText =
    content['household-spouse-status-change-modal-continue-button-text'];
  const secondaryButtonText =
    content['household-spouse-status-change-modal-cancel-button-text'];

  const handlers = {
    onCancel: () => {
      setModal(false);
    },
    onConfirm: () => {
      setModal(false);
      onSubmit(data);
    },
    onChange: event => {
      onChange(event);
      setNewMaritalStatus(event['view:maritalStatus'].maritalStatus);
      setModal(true);
    },
    onSubmit: () => {
      onSubmit(data);
    },
    onGoForward: () => {
      onSubmit(data);
    },
    onGoBack: () => {
      // Handle go back logic if needed.
    },
  };

  return (
    <>
      <SchemaForm
        name={name}
        title={title}
        data={data}
        appStateData={appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={pagePerItemIndex}
        formContext={formContext}
        trackingPrefix={trackingPrefix}
        onChange={handlers.onChange}
        onSubmit={handlers.onSubmit}
      >
        {/* Modal for marital status change confirmation */}
        <VaModal
          modalTitle={modalTitle}
          visible={modal}
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          onPrimaryButtonClick={handlers.onConfirm}
          onSecondaryButtonClick={handlers.onCancel}
          onCloseEvent={handlers.onCancel}
          status="warning"
          clickToClose
          uswds
        >
          <p className="vads-u-margin--0">{modalCancelDescription}</p>
        </VaModal>
        {/* contentBeforeButtons = save-in-progress links */}
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handlers.onGoBack}
          goForward={handlers.onGoForward}
          submitToContinue
        />
        {contentAfterButtons}
      </SchemaForm>
    </>
  );
}

MaritalStatusPage.propTypes = {
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  formContext: PropTypes.object,
  pagePerItemIndex: PropTypes.number,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  NavButtons: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formContext: getFormContext(state),
});

export default connect(mapStateToProps)(MaritalStatusPage);
