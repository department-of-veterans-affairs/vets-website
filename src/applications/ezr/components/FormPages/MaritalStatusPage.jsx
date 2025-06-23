/* eslint-disable react/sort-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { replaceStrValues } from 'applications/ezr/utils/helpers/general';
import { useEditOrAddForm } from 'platform/forms-system/src/js/patterns/array-builder';
import { isVeteranMarriedOrSeparated } from 'applications/ezr/utils/helpers/household';
import { getFormContext } from 'platform/forms/save-in-progress/selectors';
import content from 'applications/ezr/locales/en/content.json';

/**
 * This page is used to change the marital status of a Veteran, and if the
 * Veteran marriage status is changed from married/separated to unmarried, or
 * from unmarried to married/separated, it displays a modal to confirm the
 * change. It also updates the marital status in the form data.
 *
 * @type {CustomPageType}
 *
 * @param {Object} props
 *   The props passed to the component.
 * @param {string} props.name
 *   The name of the form.
 * @param {string} props.title
 *   The title of the form.
 * @param {Object} props.appStateData
 *   The app state data.
 * @param {number} props.pagePerItemIndex
 *   The page per item index.
 * @param {Object} props.formContext
 *   The form context.
 * @param {string} props.trackingPrefix
 *   The tracking prefix.
 * @param {React.ReactNode} props.contentBeforeButtons
 *   The content before the buttons.
 * @param {React.ReactNode} props.contentAfterButtons
 *   The content after the buttons.
 * @param {() => void} props.goBack
 *   The function to go back.
 * @param {() => void} props.NavButtons
 */
function MaritalStatusPage(props) {
  const {
    name,
    title,
    appStateData,
    pagePerItemIndex,
    formContext,
    trackingPrefix,
    contentBeforeButtons,
    contentAfterButtons,
    goBack,
    NavButtons,
  } = props;
  const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
    isEdit: false,
    schema: props.schema,
    uiSchema: props.uiSchema,
    data: props.data,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
  });
  const [modal, setModal] = useState(false);
  const [pendingMaritalStatus, setPendingMaritalStatus] = useState(null);
  const [tempFormData, setTempFormData] = useState(null);
  const currentMaritalStatus = data['view:maritalStatus']?.maritalStatus || '';

  const modalTitle = content['household-spouse-status-change-modal-title'];
  const modalCancelDescription = replaceStrValues(
    content['household-spouse-status-change-modal-text'],
    pendingMaritalStatus,
  );
  const primaryButtonText =
    content['household-spouse-status-change-modal-continue-button-text'];
  const secondaryButtonText =
    content['household-spouse-status-change-modal-cancel-button-text'];

  /**
   * Determines if a modal should be shown based on the current and new marital
   * statuses.
   *
   * @param {string} currentStatus
   *   The current marital status of the Veteran.
   * @param {string} newStatus
   *   The new marital status of the Veteran.
   *
   * @returns {boolean}
   *   True if the modal should be shown, false otherwise.
   */
  const shouldShowModal = (currentStatus, newStatus) => {
    if (currentStatus.length === 0 || newStatus.length === 0) {
      return false;
    }
    const isCurrentlyMarried = isVeteranMarriedOrSeparated(currentStatus);
    const isNewlyMarried = isVeteranMarriedOrSeparated(newStatus);
    const statusChanged = currentStatus !== newStatus;
    const isMaritalStatusTransition = isCurrentlyMarried !== isNewlyMarried;
    return statusChanged && isMaritalStatusTransition;
  };

  /**
   * Form event handlers. Not to be confused with methods provided by
   * useEditOrAddForm().
   */
  const handlers = {
    onCancel: () => {
      setModal(false);
      setPendingMaritalStatus(null);
      setTempFormData(null);
    },
    onConfirm: () => {
      // User confirmed the change, apply the temporary data.
      if (tempFormData) {
        onChange(tempFormData);
      }
      setModal(false);
      setPendingMaritalStatus(null);
      setTempFormData(null);
    },
    onChange: eventData => {
      const incomingMaritalStatus =
        eventData?.['view:maritalStatus']?.maritalStatus;

      const shouldShow = shouldShowModal(
        currentMaritalStatus,
        incomingMaritalStatus,
      );

      if (shouldShow) {
        setPendingMaritalStatus(incomingMaritalStatus);
        setTempFormData(eventData);
        setModal(true);
      } else {
        onChange(eventData);
      }
    },
  };

  return (
    <>
      <SchemaForm
        name={name}
        title={title}
        data={tempFormData || data}
        appStateData={appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={pagePerItemIndex}
        formContext={formContext}
        trackingPrefix={trackingPrefix}
        onChange={handlers.onChange}
        onSubmit={onSubmit}
      >
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
        {contentBeforeButtons}
        <NavButtons goBack={goBack} submitToContinue />
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
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  NavButtons: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formContext: getFormContext(state),
});

export default connect(mapStateToProps)(MaritalStatusPage);
