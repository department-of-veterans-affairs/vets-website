import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Reserve Guard Question Page
 * Determines if Section III (Reserve/Guard status) should be shown
 * @module pages/reserve-guard-question
 */
const ReserveGuardQuestionPage = ({ data, goBack, goForward, updatePage }) => {
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
          <h3 className="vads-u-margin--0">Military service status</h3>
        </legend>

        <p>
          We need to know if the Veteran is currently serving in the Reserve or
          National Guard to determine if additional information is needed.
        </p>

        {/* Reserve/Guard status question */}
        <va-radio
          label="Is the Veteran currently serving in the Reserve or National Guard?"
          name="isReserveOrGuard"
          value={localData.isReserveOrGuard || ''}
          onVaValueChange={e =>
            handleFieldChange('isReserveOrGuard', e.detail.value)
          }
          error={errors.isReserveOrGuard}
          required
        >
          <va-radio-option label="Yes" value="yes" />
          <va-radio-option label="No" value="no" />
        </va-radio>

        {localData.isReserveOrGuard === 'yes' && (
          <va-alert status="info" show-icon class="vads-u-margin-top--2">
            <p className="vads-u-margin--0">
              You’ll be asked to provide additional information about the
              Veteran’s Reserve or National Guard duty status on the next page.
            </p>
          </va-alert>
        )}

        {localData.isReserveOrGuard === 'no' && (
          <va-alert status="info" show-icon class="vads-u-margin-top--2">
            <p className="vads-u-margin--0">
              Section III (Reserve or National Guard Duty Status) will not be
              required for this application.
            </p>
          </va-alert>
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

ReserveGuardQuestionPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default ReserveGuardQuestionPage;
