import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';
import { TextareaField } from '@bio-aquia/shared/components/atoms/textarea-field';

/**
 * Functional Limitations Page
 * Section VII Part B - Items 32-38: Functional limitations assessment
 * @module pages/functional-limitations
 */
const FunctionalLimitationsPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      onSubmit: updateData => {
        updatePage(updateData);
        goForward();
      },
    },
  );

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Functional limitations</h3>
        </legend>

        <p>Assess the patient’s functional capabilities and limitations.</p>

        {/* Item 32 - Balance */}
        <va-radio
          label="Item 32: Can the patient maintain balance?"
          name="canMaintainBalance"
          value={localData.canMaintainBalance || ''}
          onVaValueChange={e =>
            handleFieldChange('canMaintainBalance', e.detail.value)
          }
          error={errors.canMaintainBalance}
          required
        >
          <va-radio-option label="Yes, without assistance" value="yes" />
          <va-radio-option
            label="Yes, with assistive device"
            value="with_device"
          />
          <va-radio-option label="No, requires human assistance" value="no" />
        </va-radio>

        {/* Item 33 - Falls */}
        <va-radio
          label="Item 33: Does the patient have a history of falls?"
          name="historyOfFalls"
          value={localData.historyOfFalls || ''}
          onVaValueChange={e =>
            handleFieldChange('historyOfFalls', e.detail.value)
          }
          error={errors.historyOfFalls}
          required
        >
          <va-radio-option label="No falls in past year" value="none" />
          <va-radio-option label="1-2 falls in past year" value="few" />
          <va-radio-option
            label="3 or more falls in past year"
            value="frequent"
          />
        </va-radio>

        {/* Item 34 - Bedridden */}
        <va-radio
          label="Item 34: Is the patient bedridden?"
          name="isBedridden"
          value={localData.isBedridden || ''}
          onVaValueChange={e =>
            handleFieldChange('isBedridden', e.detail.value)
          }
          error={errors.isBedridden}
          required
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {/* Item 35 - Housebound */}
        <va-radio
          label="Item 35: Is the patient substantially confined to their home or immediate premises?"
          name="isHousebound"
          value={localData.isHousebound || ''}
          onVaValueChange={e =>
            handleFieldChange('isHousebound', e.detail.value)
          }
          error={errors.isHousebound}
          required
        >
          <va-radio-option
            label="Yes"
            value="yes"
            description="Unable to leave home without considerable difficulty"
          />
          <va-radio-option
            label="No"
            value="no"
            description="Can leave home regularly"
          />
        </va-radio>

        {localData.isHousebound === 'yes' && (
          <TextareaField
            label="Explain why the patient is housebound"
            name="houseboundReason"
            value={localData.houseboundReason || ''}
            onChange={handleFieldChange}
            error={errors.houseboundReason}
            required
            rows={4}
            schema={null}
          />
        )}

        {/* Item 36 - Mental capacity */}
        <va-radio
          label="Item 36: Does the patient have cognitive impairment?"
          name="hasCognitiveImpairment"
          value={localData.hasCognitiveImpairment || ''}
          onVaValueChange={e =>
            handleFieldChange('hasCognitiveImpairment', e.detail.value)
          }
          error={errors.hasCognitiveImpairment}
          required
        >
          <va-radio-option label="None" value="none" />
          <va-radio-option label="Mild" value="mild" />
          <va-radio-option label="Moderate" value="moderate" />
          <va-radio-option label="Severe" value="severe" />
        </va-radio>

        {/* Item 37 - Safety awareness */}
        <va-radio
          label="Item 37: Can the patient safely remain alone for extended periods?"
          name="canRemainAlone"
          value={localData.canRemainAlone || ''}
          onVaValueChange={e =>
            handleFieldChange('canRemainAlone', e.detail.value)
          }
          error={errors.canRemainAlone}
          required
        >
          <va-radio-option label="Yes, safely" value="yes" />
          <va-radio-option label="Yes, with some risk" value="with_risk" />
          <va-radio-option label="No, requires supervision" value="no" />
        </va-radio>

        {/* Item 38 - Daily assistance needs */}
        <va-checkbox-group
          label="Item 38: What type of daily assistance does the patient require? (Check all that apply)"
          error={errors.dailyAssistance}
        >
          <va-checkbox
            label="No daily assistance required"
            name="assistanceNone"
            checked={localData.assistanceNone || false}
            onVaChange={e =>
              handleFieldChange('assistanceNone', e.detail.checked)
            }
          />
          <va-checkbox
            label="Medication management"
            name="assistanceMedication"
            checked={localData.assistanceMedication || false}
            onVaChange={e =>
              handleFieldChange('assistanceMedication', e.detail.checked)
            }
          />
          <va-checkbox
            label="Meal preparation"
            name="assistanceMeals"
            checked={localData.assistanceMeals || false}
            onVaChange={e =>
              handleFieldChange('assistanceMeals', e.detail.checked)
            }
          />
          <va-checkbox
            label="Transportation to medical appointments"
            name="assistanceTransportation"
            checked={localData.assistanceTransportation || false}
            onVaChange={e =>
              handleFieldChange('assistanceTransportation', e.detail.checked)
            }
          />
          <va-checkbox
            label="Housekeeping"
            name="assistanceHousekeeping"
            checked={localData.assistanceHousekeeping || false}
            onVaChange={e =>
              handleFieldChange('assistanceHousekeeping', e.detail.checked)
            }
          />
          <va-checkbox
            label="Financial management"
            name="assistanceFinancial"
            checked={localData.assistanceFinancial || false}
            onVaChange={e =>
              handleFieldChange('assistanceFinancial', e.detail.checked)
            }
          />
          <va-checkbox
            label="24-hour supervision"
            name="assistanceSupervision"
            checked={localData.assistanceSupervision || false}
            onVaChange={e =>
              handleFieldChange('assistanceSupervision', e.detail.checked)
            }
          />
        </va-checkbox-group>
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

FunctionalLimitationsPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default FunctionalLimitationsPage;
