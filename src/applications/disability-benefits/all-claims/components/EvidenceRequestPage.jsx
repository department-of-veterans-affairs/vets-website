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
import {
  getVaEvidence,
  getPrivateFacilities,
  getPrivateEvidenceUploads,
} from '../utils';
import {
  evidenceRequestAdditionalInfo,
  evidenceRequestQuestion,
  privateEvidenceContent,
  vaEvidenceContent,
  privateFacilityContent,
  alertMessage,
  renderFacilityList,
  renderFileList,
  missingSelectionErrorMessageEvidenceRequestPage,
} from '../content/evidenceRequest';

export const EvidenceRequestPage = ({
  data,
  setFormData,
  onReviewPage,
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
  updatePage,
}) => {
  const selectionField = 'view:hasMedicalRecords';
  const hasMedicalRecords = _.get('view:hasMedicalRecords', data, null);
  const [hasError, setHasError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState([]);

  const hasEvidenceToRemove = () => {
    return (
      getVaEvidence(data).length > 0 ||
      getPrivateEvidenceUploads(data).length > 0 ||
      getPrivateFacilities(data).length > 0
    );
  };
  const missingSelection = (error, _fieldData, formData) => {
    const value = formData?.[selectionField];
    if (value !== true && value !== false) {
      error.addError?.(missingSelectionErrorMessageEvidenceRequestPage);
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
      const selectableEvidenceTypes = {
        ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
      };

      if (getVaEvidence(data).length > 0) {
        delete updatedFormData.vaTreatmentFacilities;
        selectableEvidenceTypes['view:hasVaMedicalRecords'] = false;
        setAlertType(prevState => [...prevState, 'va']);
      }
      if (getPrivateEvidenceUploads(data).length > 0) {
        delete updatedFormData.privateMedicalRecordAttachments;
        selectableEvidenceTypes['view:hasPrivateMedicalRecords'] = false;
        setAlertType(prevState => [...prevState, 'privateMedicalRecords']);
      }
      if (getPrivateFacilities(data).length > 0) {
        delete updatedFormData.providerFacility;
        selectableEvidenceTypes['view:hasPrivateMedicalRecords'] = false;
        setAlertType(prevState => [...prevState, 'privateFacility']);
      }
      updatedFormData['view:selectableEvidenceTypes'] = selectableEvidenceTypes;
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
      } else if (hasMedicalRecords === false && hasEvidenceToRemove()) {
        setModalVisible(true);
      } else if (hasMedicalRecords === false) {
        const updatedFormData = { ...data };
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          'view:hasVaMedicalRecords': false,
          'view:hasPrivateMedicalRecords': false,
        };
        updatedFormData.patient4142Acknowledgement = false;
        setFormData(updatedFormData);
        setAlertVisible(false);
        goForward(updatedFormData);
      } else {
        setAlertVisible(false);
        goForward(data);
      }
    },
    onUpdatePage: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError();
      } else if (hasMedicalRecords === false && hasEvidenceToRemove()) {
        setModalVisible(true);
      } else {
        setAlertVisible(false);
        updatePage(event);
      }
    },
  };

  return (
    <>
      <h3>Medical records that support your disability claim</h3>
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
          <p className="vads-u-margin-y--0">{alertMessage(alertType)}</p>
        </VaAlert>
      </div>
      <VaModal
        clickToClose
        modalTitle="Change your medical records?"
        onCloseEvent={handlers.onCancelChange}
        onPrimaryButtonClick={handlers.onChangeAndRemove}
        onSecondaryButtonClick={handlers.onCancelChange}
        visible={modalVisible}
        status="warning"
        primaryButtonText="Change and remove"
        secondaryButtonText="Cancel change"
      >
        {getVaEvidence(data).length > 0 && (
          <>
            {vaEvidenceContent}
            {renderFacilityList(getVaEvidence(data), 'treatmentCenterName')}
          </>
        )}
        {getPrivateEvidenceUploads.length > 0 && (
          <>
            {privateEvidenceContent}
            {renderFileList(getPrivateEvidenceUploads(data), 'fileName')}
          </>
        )}
        {getPrivateFacilities(data).length > 0 && (
          <>
            {privateFacilityContent}
            {renderFacilityList(
              getPrivateFacilities(data),
              'providerFacilityName',
            )}
          </>
        )}
      </VaModal>
      <form onSubmit={handlers.onSubmit}>
        <VaRadio
          label={evidenceRequestQuestion.label}
          hint={evidenceRequestQuestion.hint}
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
            checked={hasMedicalRecords === true}
            value="true"
          />
          <va-radio-option
            label="No"
            name="private"
            checked={hasMedicalRecords === false}
            value="false"
          />
        </VaRadio>
        {evidenceRequestAdditionalInfo}

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

EvidenceRequestPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
