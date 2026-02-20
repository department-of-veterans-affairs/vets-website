import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaRadio,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import _ from 'platform/utilities/data';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/scroll';
import { checkValidations } from '../utils/submit';
import { getAdditionalDocuments } from '../utils';
import { renderFileList } from '../content/evidenceRequest';
import {
  evidenceChoiceIntroDescriptionContent,
  evidenceChoiceIntroQuestion,
  evidenceChoiceIntroTitle,
  additionalEvidenceModalContent,
  missingSelectionErrorMessage,
} from '../content/form0781/supportingEvidenceEnhancement/evidenceChoiceIntroPage';
import { mentalHealthSupportAlert } from '../content/form0781';

export const AdditionalEvidenceIntroPage = ({
  data,
  setFormData,
  onReviewPage,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
  updatePage,
}) => {
  const selectionField = 'view:hasEvidenceChoice';
  const hasEvidenceChoice = _.get('view:hasEvidenceChoice', data, null);
  const [hasError, setHasError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const hasEvidenceToRemove = () => {
    return getAdditionalDocuments(data).length > 0;
  };
  const missingSelection = (error, _fieldData, formData) => {
    const value = formData?.[selectionField];
    if (value !== true && value !== false) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  const checkErrors = (formData = data) => {
    const error = checkValidations(
      [missingSelection],
      data?.[selectionField],
      formData,
    );

    const result = error?.[0] || null;
    setHasError(result);

    return result;
  };

  const handlers = {
    onChangeAndRemove: () => {
      const updatedFormData = { ...data };
      delete updatedFormData.evidenceChoiceAdditionalDocuments;
      setFormData(updatedFormData);
      setModalVisible(false);
      setAlertVisible(true);
    },
    onCancelChange: () => {
      const updatedFormData = {
        ...data,
        [selectionField]: true,
      };
      setFormData(updatedFormData);
      setModalVisible(false);
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      const booleanValue = value === true || value === 'true';
      const formData = {
        ...data,
        [selectionField]: booleanValue,
      };
      setFormData(formData);
      checkErrors(formData);
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError();
      } else if (hasEvidenceChoice === false && hasEvidenceToRemove()) {
        setModalVisible(true);
      } else {
        setAlertVisible(false);
        goForward(data);
      }
    },
    onUpdatePage: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError();
      } else if (hasEvidenceChoice === false && hasEvidenceToRemove()) {
        setModalVisible(true);
      } else {
        setAlertVisible(false);
        updatePage(event);
      }
    },
  };

  return (
    <>
      <h3>{evidenceChoiceIntroTitle}</h3>
      {evidenceChoiceIntroDescriptionContent}
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={() => setAlertVisible(false)}
          fullWidth="false"
          slim
          status="success"
          visible={alertVisible}
          uswds
          tabIndex="-1"
        >
          <p className="vads-u-margin-y--0">
            We’ve deleted the documents you uploaded supporting your claim.
          </p>
        </VaAlert>
      </div>
      <VaModal
        clickToClose
        modalTitle="Cancel uploading files?"
        onCloseEvent={handlers.onCancelChange}
        onPrimaryButtonClick={handlers.onChangeAndRemove}
        onSecondaryButtonClick={handlers.onCancelChange}
        visible={modalVisible}
        status="warning"
        primaryButtonText="Change and delete"
        secondaryButtonText="Keep files"
      >
        {getAdditionalDocuments(data).length > 0 && (
          <>
            {additionalEvidenceModalContent}
            {renderFileList(getAdditionalDocuments(data), true)}
          </>
        )}
      </VaModal>
      <form onSubmit={handlers.onSubmit}>
        <VaRadio
          label={evidenceChoiceIntroQuestion}
          required
          uswds="true"
          class="rjsf-web-component-field hydrated"
          aria-invalid={hasError ? 'true' : 'false'}
          onVaValueChange={handlers.onSelection}
          error={hasError}
        >
          <va-radio-option
            label="Yes"
            name="private"
            checked={hasEvidenceChoice === true}
            value="true"
          />
          <va-radio-option
            label="No"
            name="private"
            checked={hasEvidenceChoice === false}
            value="false"
          />
        </VaRadio>
        {!onReviewPage && mentalHealthSupportAlert()}
        {onReviewPage ? (
          /**
           * Does not use web component for design consistency on all pages.
           * @see https://github.com/department-of-veterans-affairs/vets-website/pull/35911
           */
          // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
          <button
            className="usa-button-primary"
            type="button"
            onClick={event => handlers.onUpdatePage(event)}
          >
            Update page
          </button>
        ) : (
          <>
            {contentBeforeButtons}
            <FormNavButtons
              goBack={goBack}
              goForward={handlers.onSubmit}
              submitToContinue
            />
            {contentAfterButtons}
          </>
        )}
      </form>
    </>
  );
};

AdditionalEvidenceIntroPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
