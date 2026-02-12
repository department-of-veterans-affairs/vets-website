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
import { hasVAEvidence, hasPrivateEvidence } from '../utils';
import {
  evidenceRequestAdditionalInfo,
  evidenceRequestQuestion,
  privateEvidenceContent,
  vaEvidenceContent,
  privateFacilityContent,
  alertMessageForCentersAndFiles,
  alertMessageForCenters,
  alertMessageForFiles,
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
  const missingSelectionErrorMessage = 'You must provide a response';
  const maxDisplayedItems = 3;
  const hasMedicalRecords = _.get('view:hasMedicalRecords', data, null);
  const vaEvidence = _.get('vaTreatmentFacilities', data, []);
  const privateFacility = _.get('providerFacility', data, []);
  const privateEvidenceUploads = _.get(
    'privateMedicalRecordAttachments',
    data,
    [],
  );
  const [hasError, setHasError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState([]);

  const hasEvidenceToRemove = () => {
    return (
      (hasVAEvidence(data) && vaEvidence.length > 0) ||
      (hasPrivateEvidence(data) && privateEvidenceUploads.length > 0) ||
      privateFacility.length > 0
    );
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

      if (hasVAEvidence(data)) {
        delete updatedFormData.vaTreatmentFacilities;
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          'view:hasVaMedicalRecords': false,
        };
        setAlertType(prevState => [...prevState, 'va']);
      }
      if (hasPrivateEvidence(data)) {
        const hasPrivateUploads = privateEvidenceUploads.length > 0;
        const hasPrivateFacilities = privateFacility.length > 0;
        if (hasPrivateUploads) {
          delete updatedFormData.privateMedicalRecordAttachments;
          setAlertType(prevState => [...prevState, 'privateMedicalRecords']);
        }
        if (hasPrivateFacilities) {
          delete updatedFormData.providerFacility;
          setAlertType(prevState => [...prevState, 'privateFacility']);
        }
        if (hasPrivateUploads || hasPrivateFacilities) {
          updatedFormData['view:selectableEvidenceTypes'] = {
            ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
            'view:hasPrivateMedicalRecords': false,
          };
        }
      } else if (privateFacility.length > 0) {
        delete updatedFormData.providerFacility;
        setAlertType(prevState => [...prevState, 'privateFacility']);
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          'view:hasPrivateMedicalRecords': false,
        };
      }
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
      } else if (hasMedicalRecords === false && hasVAEvidence(data)) {
        const updatedFormData = { ...data };
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          'view:hasVaMedicalRecords': false,
        };
        setFormData(updatedFormData);
        setAlertVisible(false);
      } else if (hasMedicalRecords === false && hasPrivateEvidence(data)) {
        const updatedFormData = { ...data };
        updatedFormData['view:selectableEvidenceTypes'] = {
          ...(updatedFormData['view:selectableEvidenceTypes'] || {}),
          'view:hasPrivateMedicalRecords': false,
        };
        setFormData(updatedFormData);
        setAlertVisible(false);
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

  const alertMessage = () => {
    if (
      alertType.includes('privateMedicalRecords') &&
      (alertType.includes('va') || alertType.includes('privateFacility'))
    ) {
      return alertMessageForCentersAndFiles;
    }
    if (
      (alertType.includes('va') || alertType.includes('privateFacility')) &&
      !alertType.includes('privateMedicalRecords')
    ) {
      return alertMessageForCenters;
    }
    if (
      alertType.includes('privateMedicalRecords') &&
      !alertType.includes('va') &&
      !alertType.includes('privateFacility')
    ) {
      return alertMessageForFiles;
    }
    return '';
  };
  const renderFacilityList = (facilities, nameKey) => {
    const showAll = facilities.length <= maxDisplayedItems + 1;
    const displayList = showAll
      ? facilities
      : facilities.slice(0, maxDisplayedItems);
    return (
      <ul>
        {displayList.map((facility, index) => (
          <li key={index}>
            {facility[nameKey] || 'Name of medical center wasn’t added'}
          </li>
        ))}
        {!showAll && (
          <li>{facilities.length - maxDisplayedItems} other medical centers</li>
        )}
      </ul>
    );
  };

  const renderFileList = files => {
    const showAll = files.length <= maxDisplayedItems + 1;
    const displayList = showAll ? files : files.slice(0, maxDisplayedItems);
    return (
      <ul>
        {displayList.slice(0, maxDisplayedItems).map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}

        {!showAll && (
          <li>{files.length - maxDisplayedItems} other medical records</li>
        )}
      </ul>
    );
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
          <p className="vads-u-margin-y--0">{alertMessage()}</p>
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
        {hasVAEvidence(data) &&
          vaEvidence.length > 0 && (
            <>
              {vaEvidenceContent}
              {renderFacilityList(vaEvidence, 'treatmentCenterName')}
            </>
          )}
        {hasPrivateEvidence(data) &&
          privateEvidenceUploads.length > 0 && (
            <>
              {privateEvidenceContent}
              {renderFileList(privateEvidenceUploads)}
            </>
          )}
        {privateFacility.length > 0 && (
          <>
            {privateFacilityContent}
            {renderFacilityList(privateFacility, 'providerFacilityName')}
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
