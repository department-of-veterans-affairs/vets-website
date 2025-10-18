import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { ADL_OPTIONS } from '@bio-aquia/21-2680-house-bound-status/constants';

/**
 * ADL Assessment Page
 * Section VII Part A - Items 25-31: Activities of Daily Living assessment
 * @module pages/adl-assessment
 */
const ADLAssessmentPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      onSubmit: updateData => {
        updatePage(updateData);
        goForward();
      },
    },
  );

  const adlItems = [
    { key: 'adlDressing', label: 'Dressing', item: '25' },
    { key: 'adlBathing', label: 'Bathing', item: '26' },
    { key: 'adlFeeding', label: 'Feeding', item: '27' },
    { key: 'adlToileting', label: 'Toileting', item: '28' },
    { key: 'adlGrooming', label: 'Grooming', item: '29' },
    { key: 'adlTransferring', label: 'Transferring', item: '30' },
    { key: 'adlWalking', label: 'Walking', item: '31' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">
            Activities of Daily Living (ADL) assessment
          </h3>
        </legend>

        <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
          <p className="vads-u-margin--0">
            For each activity, indicate the level of assistance required by the
            patient.
          </p>
        </va-alert>

        <p>
          Please assess the patient’s ability to perform the following
          activities independently.
        </p>

        {adlItems.map(({ key, label, item }) => (
          <div key={key} className="vads-u-margin-bottom--3">
            <va-radio
              label={`Item ${item}: ${label}`}
              name={key}
              value={localData[key] || ''}
              onVaValueChange={e => handleFieldChange(key, e.detail.value)}
              error={errors[key]}
              required
            >
              <va-radio-option
                label={ADL_OPTIONS.INDEPENDENT}
                value="independent"
                description="Can perform without assistance"
              />
              <va-radio-option
                label={ADL_OPTIONS.NEEDS_ASSISTANCE}
                value="needs_assistance"
                description="Requires some help or supervision"
              />
              <va-radio-option
                label={ADL_OPTIONS.UNABLE}
                value="unable"
                description="Cannot perform even with assistance"
              />
            </va-radio>
          </div>
        ))}

        <va-alert status="warning" show-icon class="vads-u-margin-top--3">
          <p className="vads-u-margin--0">
            <strong>Important:</strong> If the patient needs assistance with 2
            or more ADLs, they may qualify for Aid and Attendance benefits.
          </p>
        </va-alert>
      </fieldset>

      <div className="vads-u-margin-top--4">
        <va-button back onClick={goBack}>
          Back
        </va-button>
        <va-button continue type="submit">
          Continue
        </va-button>
      </div>
    </form>
  );
};

ADLAssessmentPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ADLAssessmentPage;
