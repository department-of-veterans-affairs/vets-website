import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { SelectField, TextareaField } from '@bio-aquia/shared/components/atoms';
import { LOCOMOTION_AIDS } from '@bio-aquia/21-2680-house-bound-status/constants';

/**
 * Narrative Assessment Page
 * Section VIII - Items 39-42: Narrative assessment and locomotion
 * @module pages/narrative-assessment
 */
export const NarrativeAssessmentPage = ({
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
      title="Clinical narrative and locomotion assessment"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      sectionName="narrativeAssessment"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        clinicalNarrative: '',
        locomotionNone: false,
        locomotionCane: false,
        locomotionWalker: false,
        locomotionWheelchair: false,
        locomotionCrutches: false,
        locomotionBraces: false,
        locomotionProsthetic: false,
        locomotionOther: false,
        locomotionOtherDescription: '',
        walkingDistance: '',
        prognosis: '',
        prognosisExplanation: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">
              <h3 className="vads-u-margin--0">
                Clinical narrative and locomotion assessment
              </h3>
            </legend>

            <p>
              Provide a comprehensive narrative assessment and evaluate
              locomotion needs.
            </p>

            {/* Item 39 - Narrative assessment */}
            <TextareaField
              label="Item 39: Clinical narrative"
              name="clinicalNarrative"
              value={localData.clinicalNarrative || ''}
              onChange={handleFieldChange}
              error={errors.clinicalNarrative}
              forceShowError={formSubmitted}
              required
              hint="Describe the patient's overall functional status, medical conditions impacting independence, and justify the need for Aid and Attendance or Housebound benefits"
              rows={8}
              schema={null}
            />

            {/* Item 40 - Locomotion aids */}
            <va-checkbox-group
              label="Item 40: What assistive devices does the patient use for locomotion? (Check all that apply)"
              error={errors.locomotionAids}
            >
              <va-checkbox
                label={LOCOMOTION_AIDS.NONE}
                name="locomotionNone"
                checked={localData.locomotionNone || false}
                onVaChange={e =>
                  handleFieldChange('locomotionNone', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.CANES}
                name="locomotionCane"
                checked={localData.locomotionCane || false}
                onVaChange={e =>
                  handleFieldChange('locomotionCane', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.WALKER}
                name="locomotionWalker"
                checked={localData.locomotionWalker || false}
                onVaChange={e =>
                  handleFieldChange('locomotionWalker', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.WHEELCHAIR}
                name="locomotionWheelchair"
                checked={localData.locomotionWheelchair || false}
                onVaChange={e =>
                  handleFieldChange('locomotionWheelchair', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.CRUTCHES}
                name="locomotionCrutches"
                checked={localData.locomotionCrutches || false}
                onVaChange={e =>
                  handleFieldChange('locomotionCrutches', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.BRACES}
                name="locomotionBraces"
                checked={localData.locomotionBraces || false}
                onVaChange={e =>
                  handleFieldChange('locomotionBraces', e.detail.checked)
                }
              />
              <va-checkbox
                label={LOCOMOTION_AIDS.PROSTHETIC}
                name="locomotionProsthetic"
                checked={localData.locomotionProsthetic || false}
                onVaChange={e =>
                  handleFieldChange('locomotionProsthetic', e.detail.checked)
                }
              />
              <va-checkbox
                label="Other assistive device"
                name="locomotionOther"
                checked={localData.locomotionOther || false}
                onVaChange={e =>
                  handleFieldChange('locomotionOther', e.detail.checked)
                }
              />
            </va-checkbox-group>

            {localData.locomotionOther && (
              <va-text-input
                label="Specify other assistive device"
                name="locomotionOtherDescription"
                value={localData.locomotionOtherDescription || ''}
                onInput={e =>
                  handleFieldChange(
                    'locomotionOtherDescription',
                    e.target.value,
                  )
                }
                error={errors.locomotionOtherDescription}
                required
              />
            )}

            {/* Item 41 - Walking distance */}
            <SelectField
              label="Item 41: Maximum distance patient can walk without rest"
              name="walkingDistance"
              value={localData.walkingDistance || ''}
              onChange={handleFieldChange}
              error={errors.walkingDistance}
              forceShowError={formSubmitted}
              required
              schema={null}
              options={[
                { value: 'unable', label: 'Unable to walk' },
                { value: 'less_10', label: 'Less than 10 feet' },
                { value: '10_50', label: '10-50 feet' },
                { value: '50_100', label: '50-100 feet' },
                { value: '100_500', label: '100-500 feet' },
                { value: 'over_500', label: 'Over 500 feet' },
                { value: 'unlimited', label: 'Unlimited with normal fatigue' },
              ]}
            />

            {/* Item 42 - Prognosis */}
            <va-radio
              label="Item 42: What is the prognosis for improvement?"
              name="prognosis"
              value={localData.prognosis || ''}
              onVaValueChange={e =>
                handleFieldChange('prognosis', e.detail.value)
              }
              error={errors.prognosis}
              required
            >
              <va-radio-option
                label="Good - Significant improvement expected"
                value="good"
              />
              <va-radio-option
                label="Fair - Some improvement possible"
                value="fair"
              />
              <va-radio-option
                label="Poor - Little to no improvement expected"
                value="poor"
              />
              <va-radio-option
                label="Terminal - End-of-life care needed"
                value="terminal"
              />
            </va-radio>

            {localData.prognosis && (
              <TextareaField
                label="Explain prognosis and expected timeline"
                name="prognosisExplanation"
                value={localData.prognosisExplanation || ''}
                onChange={handleFieldChange}
                error={errors.prognosisExplanation}
                forceShowError={formSubmitted}
                required
                rows={4}
                schema={null}
              />
            )}
          </fieldset>
        </>
      )}
    </PageTemplate>
  );
};

NarrativeAssessmentPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};

export default NarrativeAssessmentPage;
