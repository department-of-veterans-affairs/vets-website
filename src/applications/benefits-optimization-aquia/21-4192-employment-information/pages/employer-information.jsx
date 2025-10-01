import React from 'react';
import PropTypes from 'prop-types';
import { useFormSection } from '@bio-aquia/shared/hooks';

/**
 * Employer Information Page
 * Section I - Collects employer's name and address information
 * @module pages/employer-information
 */
const EmployerInformationPage = ({ data, goBack, goForward, updatePage }) => {
  const { localData, handleFieldChange, handleSubmit, errors } = useFormSection(
    {
      initialData: data,
      // schema: employerInformationSchema, // Will be imported when schema is created
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
          <h3 className="vads-u-margin--0">Employer information</h3>
        </legend>

        <p>
          Enter the name and address of the employer or organization completing
          this form.
        </p>

        {/* Employer name */}
        <va-text-input
          label="Employer or organization name"
          name="employerName"
          value={localData.employerName || ''}
          onInput={e => handleFieldChange('employerName', e.target.value)}
          error={errors.employerName}
          required
        />

        {/* Address fields */}
        <va-text-input
          label="Street address"
          name="employerAddress.street"
          value={localData.employerAddress?.street || ''}
          onInput={e =>
            handleFieldChange('employerAddress.street', e.target.value)
          }
          error={errors['employerAddress.street']}
          required
        />

        <va-text-input
          label="Street address line 2"
          name="employerAddress.street2"
          value={localData.employerAddress?.street2 || ''}
          onInput={e =>
            handleFieldChange('employerAddress.street2', e.target.value)
          }
          error={errors['employerAddress.street2']}
        />

        <va-text-input
          label="City"
          name="employerAddress.city"
          value={localData.employerAddress?.city || ''}
          onInput={e =>
            handleFieldChange('employerAddress.city', e.target.value)
          }
          error={errors['employerAddress.city']}
          required
        />

        <va-select
          label="State"
          name="employerAddress.state"
          value={localData.employerAddress?.state || ''}
          onVaSelect={e =>
            handleFieldChange('employerAddress.state', e.detail.value)
          }
          error={errors['employerAddress.state']}
          required
        >
          <option value="">Select a state</option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          {/* Add all states - abbreviated for example */}
        </va-select>

        <va-text-input
          label="ZIP code"
          name="employerAddress.zip"
          value={localData.employerAddress?.zip || ''}
          onInput={e =>
            handleFieldChange('employerAddress.zip', e.target.value)
          }
          error={errors['employerAddress.zip']}
          required
          hint="5-digit ZIP code"
        />

        {/* Contact information */}
        <va-text-input
          label="Phone number (optional)"
          name="employerPhone"
          value={localData.employerPhone || ''}
          onInput={e => handleFieldChange('employerPhone', e.target.value)}
          error={errors.employerPhone}
          hint="10-digit phone number"
          type="tel"
        />

        <va-text-input
          label="Email address (optional)"
          name="employerEmail"
          value={localData.employerEmail || ''}
          onInput={e => handleFieldChange('employerEmail', e.target.value)}
          error={errors.employerEmail}
          type="email"
        />
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

EmployerInformationPage.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EmployerInformationPage;
