import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Reserve Guard Status Page
 * Section III - Reserve or National Guard Duty Status
 * Only shown if veteran is currently serving in Reserve/Guard
 * @module pages/reserve-guard-status
 */
const ReserveGuardStatusPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: reserveGuardStatusSchema,
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
          <h3 className="vads-u-margin--0">
            Reserve or National Guard duty status
          </h3>
        </legend>

        <va-alert status="info" show-icon class="vads-u-margin-bottom--2">
          <h4 slot="headline">Section for Reserve/Guard members only</h4>
          <p>
            This section should only be completed if the Veteran is currently
            serving in the Reserve or National Guard. If not applicable, this
            section should not appear.
          </p>
        </va-alert>

        {/* Duty status - Item 17A */}
        <va-select
          label="What is the Veteran's current duty status?"
          name="dutyStatus"
          value={localData.dutyStatus || ''}
          onVaSelect={e => handleFieldChange('dutyStatus', e.detail.value)}
          error={errors.dutyStatus}
          required
        >
          <option value="">Select duty status</option>
          <option value="drilling">Drilling (Traditional)</option>
          <option value="irr">Individual Ready Reserve (IRR)</option>
          <option value="inactive">Inactive</option>
          <option value="adsw">Active Duty for Special Work (ADSW)</option>
          <option value="agr">Active Guard Reserve (AGR)</option>
          <option value="title32">Title 32 Active Duty</option>
          <option value="title10">Title 10 Active Duty</option>
          <option value="other">Other</option>
        </va-select>

        {/* Other duty status specification */}
        {localData.dutyStatus === 'other' && (
          <va-text-input
            label="Please specify duty status"
            name="dutyStatusOther"
            value={localData.dutyStatusOther || ''}
            onInput={e => handleFieldChange('dutyStatusOther', e.target.value)}
            error={errors.dutyStatusOther}
            required
            maxlength="100"
          />
        )}

        {/* Unit information */}
        <va-text-input
          label="Unit name and location"
          name="unitInformation"
          value={localData.unitInformation || ''}
          onInput={e => handleFieldChange('unitInformation', e.target.value)}
          error={errors.unitInformation}
          hint="Enter the name of the Reserve or Guard unit and its location"
          maxlength="200"
        />

        {/* Disabilities preventing duties - Item 17B */}
        <va-radio
          label="Does the Veteran have any disabilities that prevent them from performing their military duties?"
          name="disabilitiesPreventDuties"
          value={localData.disabilitiesPreventDuties || ''}
          onVaValueChange={e =>
            handleFieldChange('disabilitiesPreventDuties', e.detail.value)
          }
          error={errors.disabilitiesPreventDuties}
          required
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {/* Conditional details about disabilities */}
        {localData.disabilitiesPreventDuties === 'yes' && (
          <>
            <va-textarea
              label="Describe how disabilities prevent military duties"
              name="disabilityDetails"
              value={localData.disabilityDetails || ''}
              onInput={e =>
                handleFieldChange('disabilityDetails', e.target.value)
              }
              error={errors.disabilityDetails}
              required
              hint="Examples: cannot participate in PT, unable to deploy, cannot wear military equipment"
              maxlength="500"
            />

            {/* Medical profile information */}
            <va-radio
              label="Does the Veteran have a medical profile or duty limitations?"
              name="hasMedicalProfile"
              value={localData.hasMedicalProfile || ''}
              onVaValueChange={e =>
                handleFieldChange('hasMedicalProfile', e.detail.value)
              }
              error={errors.hasMedicalProfile}
            >
              <va-radio-option label="Yes" value="yes" />
              <va-radio-option label="No" value="no" />
            </va-radio>

            {localData.hasMedicalProfile === 'yes' && (
              <va-textarea
                label="Describe medical profile or duty limitations"
                name="medicalProfileDetails"
                value={localData.medicalProfileDetails || ''}
                onInput={e =>
                  handleFieldChange('medicalProfileDetails', e.target.value)
                }
                error={errors.medicalProfileDetails}
                hint="Include profile codes (e.g., P3, L3) if applicable"
                maxlength="300"
              />
            )}
          </>
        )}

        {/* Drill attendance */}
        {(localData.dutyStatus === 'drilling' ||
          localData.dutyStatus === 'agr') && (
          <>
            <va-text-input
              label="Number of drills missed in last 12 months due to disability"
              name="drillsMissed"
              value={localData.drillsMissed || ''}
              onInput={e => handleFieldChange('drillsMissed', e.target.value)}
              error={errors.drillsMissed}
              type="number"
              min="0"
              hint="Enter 0 if no drills were missed"
            />

            <va-text-input
              label="Number of Annual Training (AT) days missed due to disability"
              name="atDaysMissed"
              value={localData.atDaysMissed || ''}
              onInput={e => handleFieldChange('atDaysMissed', e.target.value)}
              error={errors.atDaysMissed}
              type="number"
              min="0"
              hint="Enter 0 if no AT days were missed"
            />
          </>
        )}
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

ReserveGuardStatusPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ReserveGuardStatusPage;
