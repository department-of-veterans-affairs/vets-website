import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaButton,
  VaCheckboxGroup,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';
import {
  preparerIdentifications,
  submissionApis,
  survivingDependentBenefits,
  veteranBenefits,
} from '../definitions/constants';

function createExpirationDate() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
}

function createIntentObject(val) {
  return val
    ? {
        expirationDate: createExpirationDate(),
        status: 'active',
      }
    : undefined;
}

export const DevOnlyTestVariations = ({
  formData,
  setFormData,
  submissionResponse,
  setSubmissionResponse,
  submitDate,
  setSubmitDate,
}) => {
  const [newFormData, setNewFormData] = useState(formData);
  const [newSubmissionApi, setNewSubmissionApi] = useState(
    submissionResponse?.submissionApi || submissionApis.INTENT_TO_FILE,
  );
  const [newConfirmationNumber, setNewConfirmationNumber] = useState(
    submissionResponse?.confirmationNumber,
  );

  const onSimulateSubmission = () => {
    setSubmitDate(submitDate || Date.now());
    setFormData(newFormData);
    setSubmissionResponse({
      ...submissionResponse,
      confirmationNumber: newConfirmationNumber || '123456789',
      submissionApi: newSubmissionApi,
      expirationDate: createExpirationDate(),
      compensationIntent: createIntentObject(
        newFormData.benefitSelection?.[veteranBenefits.COMPENSATION],
      ),
      pensionIntent: createIntentObject(
        newFormData.benefitSelection?.[veteranBenefits.PENSION],
      ),
      survivorIntent: createIntentObject(
        newFormData.benefitSelection?.[survivingDependentBenefits.SURVIVOR],
      ),
      pdfUrl:
        newSubmissionApi === submissionApis.BENEFITS_INTAKE ? '/' : undefined,
    });
  };

  if (!(environment.isLocalhost() || environment.isDev())) {
    return null;
  }

  return (
    <div className="vads-u-margin-bottom--4">
      <va-additional-info
        trigger="Simulate submission options (dev only)"
        disable-border="true"
        disable-analytics="true"
      >
        <h2>Development only</h2>
        <div className="vads-u-margin-bottom--4">
          <VaRadio
            label="Submission type"
            onVaValueChange={event => {
              const newVal = event.detail.value ?? undefined;
              setNewSubmissionApi(newVal);
              setNewConfirmationNumber(
                newVal === submissionApis.INTENT_TO_FILE
                  ? '123456789'
                  : 'b71d3ef4-f5fe-4943-aa26-8b8e2b758ffd',
              );
            }}
          >
            <va-radio-option
              label="Benefits claim"
              value={submissionApis.INTENT_TO_FILE}
              checked={newSubmissionApi === submissionApis.INTENT_TO_FILE}
            />
            <va-radio-option
              label="Benefits intake"
              value={submissionApis.BENEFITS_INTAKE}
              checked={newSubmissionApi === submissionApis.BENEFITS_INTAKE}
            />
          </VaRadio>
        </div>
        <div className="vads-u-margin-bottom--4">
          <VaRadio
            label="Preparer type"
            onVaValueChange={event => {
              const newVal = event.detail.value ?? undefined;
              setNewFormData({
                ...newFormData,
                preparerIdentification: newVal,
              });
            }}
          >
            <va-radio-option
              label="Veteran"
              value={preparerIdentifications.veteran}
              checked={
                newFormData.preparerIdentification ===
                preparerIdentifications.veteran
              }
            />
            <va-radio-option
              label="Surviving dependent"
              value={preparerIdentifications.survivingDependent}
              checked={
                newFormData.preparerIdentification ===
                preparerIdentifications.survivingDependent
              }
            />
            <va-radio-option
              label="Third party veteran"
              value={preparerIdentifications.thirdPartyVeteran}
              checked={
                newFormData.preparerIdentification ===
                preparerIdentifications.thirdPartyVeteran
              }
            />
            <va-radio-option
              label="Third party surviving dependent"
              value={preparerIdentifications.thirdPartySurvivingDependent}
              checked={
                newFormData.preparerIdentification ===
                preparerIdentifications.thirdPartySurvivingDependent
              }
            />
          </VaRadio>
        </div>
        <div className="vads-u-margin-bottom--4">
          <VaCheckboxGroup
            label="Benefits selection"
            onVaChange={event => {
              const checkboxKey = event.target.dataset.key;
              const value = event.detail.checked;

              setNewFormData({
                ...newFormData,
                benefitSelection: {
                  ...newFormData.benefitSelection,
                  [checkboxKey]: value,
                },
              });
            }}
          >
            <va-checkbox
              label="Compensation"
              data-key={veteranBenefits.COMPENSATION}
              checked={
                !!newFormData.benefitSelection?.[veteranBenefits.COMPENSATION]
              }
            />
            <va-checkbox
              label="Pension"
              data-key={veteranBenefits.PENSION}
              checked={
                !!newFormData.benefitSelection?.[veteranBenefits.PENSION]
              }
            />
            <va-checkbox
              label="Survivor"
              data-key={survivingDependentBenefits.SURVIVOR}
              checked={
                !!newFormData.benefitSelection?.[
                  survivingDependentBenefits.SURVIVOR
                ]
              }
            />
          </VaCheckboxGroup>
        </div>
        <div className="vads-u-margin-bottom--4">
          <VaCheckboxGroup
            label="Already active benefits"
            className="vads-u-margin-bottom--4"
            onVaChange={event => {
              const checkboxKey = event.target.dataset.key;
              const value = event.detail.checked;

              setNewFormData({
                ...newFormData,
                [checkboxKey]: createIntentObject(value),
              });
            }}
          >
            <va-checkbox
              label="Compensation"
              data-key="view:activeCompensationITF"
              checked={!!newFormData['view:activeCompensationITF']}
            />
            <va-checkbox
              label="Pension"
              data-key="view:activePensionITF"
              checked={!!newFormData['view:activePensionITF']}
            />
          </VaCheckboxGroup>
        </div>
        <VaButton onClick={onSimulateSubmission} text="Simulate submission" />
      </va-additional-info>
    </div>
  );
};

DevOnlyTestVariations.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  setSubmissionResponse: PropTypes.func,
  setSubmitDate: PropTypes.func,
  submissionResponse: PropTypes.object,
  submitDate: PropTypes.any,
};
