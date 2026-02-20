import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  VaModal,
  VaAlert,
  VaCheckboxGroup,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/scroll';
import { checkValidations } from '../utils/submit';
import {
  hasVAEvidence,
  hasPrivateEvidence,
  getVaEvidence,
  getPrivateFacilities,
  getPrivateEvidenceUploads,
} from '../utils';
import {
  evidenceRequestAdditionalInfo,
  vaEvidenceContentForMedicalRecordsPage,
  privateEvidenceContentForMedicalRecordsPage,
  privateFacilityContentForMedicalRecordsPage,
  privateEvidenceContentCombined,
  alertMessage,
  renderFacilityList,
  renderFileList,
  missingSelectionErrorMessageMedicalRecordPage,
  medicalRecordQuestion,
} from '../content/evidenceRequest';

export const MedicalRecordsPage = ({
  data,
  setFormData,
  onReviewPage,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
  updatePage,
}) => {
  const shouldShowModal =
    (hasVAEvidence(data) === false && getVaEvidence(data).length > 0) ||
    (hasPrivateEvidence(data) === false &&
      (getPrivateEvidenceUploads(data).length > 0 ||
        getPrivateFacilities(data).length > 0));
  const [previousSelection, setPreviousSelection] = useState(null);
  const [hasError, setHasError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState([]);
  const alertRef = useRef(null);

  const missingSelection = (error, _fieldData, formData) => {
    if (!hasVAEvidence(formData) && !hasPrivateEvidence(formData)) {
      error.addError?.(missingSelectionErrorMessageMedicalRecordPage);
    }
  };

  useEffect(
    () => {
      if (alertVisible && alertRef.current) {
        alertRef.current.focus();
      }
    },
    [alertVisible],
  );
  const checkErrors = (formData = data) => {
    const error = checkValidations([missingSelection], data, formData);

    const result = error?.[0] || null;
    setHasError(result);

    return result;
  };

  const handlers = {
    onChangeAndRemove: () => {
      const updatedFormData = { ...data };

      if (hasVAEvidence(data) === false && getVaEvidence(data).length > 0) {
        delete updatedFormData.vaTreatmentFacilities;
        setAlertType(prevState => [...prevState, 'va']);
      }
      if (
        hasPrivateEvidence(data) === false &&
        (getPrivateEvidenceUploads(data).length > 0 ||
          getPrivateFacilities(data).length > 0)
      ) {
        if (getPrivateEvidenceUploads(data).length > 0) {
          delete updatedFormData.privateMedicalRecordAttachments;
          setAlertType(prevState => [...prevState, 'privateMedicalRecords']);
        }
        if (getPrivateFacilities(data).length > 0) {
          delete updatedFormData.providerFacility;
          setAlertType(prevState => [...prevState, 'privateFacility']);
        }
      }
      setFormData(updatedFormData);
      setPreviousSelection(null);
      setModalVisible(false);
      setAlertVisible(true);
    },
    onCancelChange: () => {
      if (previousSelection) {
        const updatedFormData = {
          ...data,
          'view:selectableEvidenceTypes': previousSelection,
        };
        setFormData(updatedFormData);
        setPreviousSelection(null);
      }
      setModalVisible(false);
    },
    onSelectionChange: event => {
      const { target } = event;
      const selection = event.target?.getAttribute('value');
      const updatedFormData = { ...data };
      if (target.checked) {
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          [selection]: true,
        };
      } else {
        setPreviousSelection(data['view:selectableEvidenceTypes']);

        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          [selection]: false,
        };
      }
      setFormData(updatedFormData);
      checkErrors(updatedFormData);
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError();
      } else if (shouldShowModal) {
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
      } else if (shouldShowModal) {
        setModalVisible(true);
      } else {
        setAlertVisible(false);
        updatePage(event);
      }
    },
  };

  return (
    <>
      <h3>Types of medical records</h3>
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={alertRef}
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
          <p className="vads-u-margin-y--0">{alertMessage(alertType)}</p>
        </VaAlert>
      </div>
      <VaModal
        clickToClose
        modalTitle="Change type of medical records?"
        onCloseEvent={handlers.onCancelChange}
        onPrimaryButtonClick={handlers.onChangeAndRemove}
        onSecondaryButtonClick={handlers.onCancelChange}
        visible={modalVisible}
        status="warning"
        primaryButtonText="Change and remove"
        secondaryButtonText="Cancel change"
      >
        {!hasVAEvidence(data) &&
          getVaEvidence(data).length > 0 && (
            <>
              {vaEvidenceContentForMedicalRecordsPage}
              {renderFacilityList(getVaEvidence(data), 'treatmentCenterName')}
            </>
          )}
        {!hasPrivateEvidence(data) &&
          getPrivateFacilities(data).length > 0 && (
            <>
              {privateFacilityContentForMedicalRecordsPage}
              {renderFacilityList(
                getPrivateFacilities(data),
                'providerFacilityName',
              )}
            </>
          )}
        {!hasPrivateEvidence(data) &&
          getPrivateEvidenceUploads(data).length > 0 && (
            <>
              {getPrivateFacilities(data).length > 0
                ? privateEvidenceContentCombined
                : privateEvidenceContentForMedicalRecordsPage}
              {renderFileList(getPrivateEvidenceUploads(data))}
            </>
          )}
      </VaModal>
      <form onSubmit={handlers.onSubmit}>
        <VaCheckboxGroup
          label={medicalRecordQuestion}
          required
          error={hasError}
          onVaChange={handlers.onSelectionChange}
        >
          <va-checkbox
            key="view:hasVaMedicalRecords"
            label="VA medical records"
            value="view:hasVaMedicalRecords"
            checked={hasVAEvidence(data)}
            uswds
          />
          <va-checkbox
            key="view:hasPrivateMedicalRecords"
            label="Private medical records"
            value="view:hasPrivateMedicalRecords"
            checked={hasPrivateEvidence(data)}
            uswds
          />
        </VaCheckboxGroup>
        {!onReviewPage && evidenceRequestAdditionalInfo}

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

MedicalRecordsPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
