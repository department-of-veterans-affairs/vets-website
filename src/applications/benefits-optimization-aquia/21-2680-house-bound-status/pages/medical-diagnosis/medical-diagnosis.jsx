import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { TextareaField } from '@bio-aquia/shared/components/atoms';

/**
 * Medical Diagnosis Page
 * Section VI Part B - Items 20-24: Medical conditions and diagnoses
 * @module pages/medical-diagnosis
 */
export const MedicalDiagnosisPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medical diagnoses"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      sectionName="medicalDiagnosis"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        medicalDiagnoses: '',
        isPermanentlyDisabled: '',
        permanentDisabilityDescription: '',
        lossOfUseNone: false,
        lossOfUseBothFeet: false,
        lossOfUseHandFoot: false,
        lossOfUseBothHands: false,
        lossOfUseBothLegs: false,
        isLegallyBlind: '',
        visualAcuityRight: '',
        visualAcuityLeft: '',
        requiresNursingHome: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">Medical diagnoses</h3>
            </legend>

            <p>
              List all medical conditions affecting the patient’s ability to
              perform activities of daily living or that result in being
              housebound.
            </p>

            {/* Item 20 - Primary diagnoses */}
            <TextareaField
              label="List all current medical diagnoses"
              name="medicalDiagnoses"
              value={localData.medicalDiagnoses || ''}
              onChange={handleFieldChange}
              error={errors.medicalDiagnoses}
              forceShowError={formSubmitted}
              required
              hint="Include ICD codes if available"
              rows={5}
              schema={null}
            />

            {/* Item 21 - Permanent total disability */}
            <va-radio
              label="Is the patient permanently and totally disabled?"
              name="isPermanentlyDisabled"
              value={localData.isPermanentlyDisabled || ''}
              onVaValueChange={e =>
                handleFieldChange('isPermanentlyDisabled', e.detail.value)
              }
              error={errors.isPermanentlyDisabled}
              required
            >
              <va-radio-option label="Yes" value="yes" />
              <va-radio-option label="No" value="no" />
            </va-radio>

            {localData.isPermanentlyDisabled === 'yes' && (
              <TextareaField
                label="Describe the nature and extent of permanent disability"
                name="permanentDisabilityDescription"
                value={localData.permanentDisabilityDescription || ''}
                onChange={handleFieldChange}
                error={errors.permanentDisabilityDescription}
                forceShowError={formSubmitted}
                required
                rows={4}
                schema={null}
              />
            )}

            {/* Item 22 - Loss of use */}
            <va-checkbox-group
              label="Does the patient have loss of use of any of the following? (Check all that apply)"
              error={errors.lossOfUse}
            >
              <va-checkbox
                label="No loss of use"
                name="lossOfUseNone"
                checked={localData.lossOfUseNone || false}
                onVaChange={e =>
                  handleFieldChange('lossOfUseNone', e.detail.checked)
                }
              />
              <va-checkbox
                label="Loss of use of both feet"
                name="lossOfUseBothFeet"
                checked={localData.lossOfUseBothFeet || false}
                onVaChange={e =>
                  handleFieldChange('lossOfUseBothFeet', e.detail.checked)
                }
              />
              <va-checkbox
                label="Loss of use of one hand and one foot"
                name="lossOfUseHandFoot"
                checked={localData.lossOfUseHandFoot || false}
                onVaChange={e =>
                  handleFieldChange('lossOfUseHandFoot', e.detail.checked)
                }
              />
              <va-checkbox
                label="Loss of use of both hands"
                name="lossOfUseBothHands"
                checked={localData.lossOfUseBothHands || false}
                onVaChange={e =>
                  handleFieldChange('lossOfUseBothHands', e.detail.checked)
                }
              />
              <va-checkbox
                label="Loss of use of both legs"
                name="lossOfUseBothLegs"
                checked={localData.lossOfUseBothLegs || false}
                onVaChange={e =>
                  handleFieldChange('lossOfUseBothLegs', e.detail.checked)
                }
              />
            </va-checkbox-group>

            {/* Item 23 - Vision status */}
            <h4>Vision status</h4>

            <va-radio
              label="Is the patient legally blind?"
              name="isLegallyBlind"
              value={localData.isLegallyBlind || ''}
              onVaValueChange={e =>
                handleFieldChange('isLegallyBlind', e.detail.value)
              }
              error={errors.isLegallyBlind}
              required
            >
              <va-radio-option label="Yes" value="yes" />
              <va-radio-option label="No" value="no" />
            </va-radio>

            {localData.isLegallyBlind === 'yes' && (
              <>
                <va-text-input
                  label="Visual acuity - Right eye"
                  name="visualAcuityRight"
                  value={localData.visualAcuityRight || ''}
                  onInput={e =>
                    handleFieldChange('visualAcuityRight', e.target.value)
                  }
                  error={errors.visualAcuityRight}
                  hint="Example: 20/200"
                  required
                />
                <va-text-input
                  label="Visual acuity - Left eye"
                  name="visualAcuityLeft"
                  value={localData.visualAcuityLeft || ''}
                  onInput={e =>
                    handleFieldChange('visualAcuityLeft', e.target.value)
                  }
                  error={errors.visualAcuityLeft}
                  hint="Example: 20/200"
                  required
                />
              </>
            )}

            {/* Item 24 - Nursing home requirement */}
            <va-radio
              label="Does this patient require nursing home care?"
              name="requiresNursingHome"
              value={localData.requiresNursingHome || ''}
              onVaValueChange={e =>
                handleFieldChange('requiresNursingHome', e.detail.value)
              }
              error={errors.requiresNursingHome}
              required
            >
              <va-radio-option label="Yes" value="yes" />
              <va-radio-option label="No" value="no" />
            </va-radio>

            {localData.requiresNursingHome === 'yes' && (
              <va-alert status="info" show-icon class="vads-u-margin-top--2">
                <p className="vads-u-margin--0">
                  <strong>Note:</strong> If nursing home care is required, VA
                  Form 21-0779 (Request for Nursing Home Information in
                  Connection with Claim for Aid and Attendance) must also be
                  completed.
                </p>
              </va-alert>
            )}
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

MedicalDiagnosisPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
