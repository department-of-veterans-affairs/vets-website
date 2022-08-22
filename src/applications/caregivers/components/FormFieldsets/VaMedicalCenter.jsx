/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';

const apiRequestWithUrl = `${
  environment.API_URL
}/v1/facilities/va?services[]=CaregiverSupport`;

const VaMedicalCenter = props => {
  const {
    formContext,
    id,
    onChange,
    registry,
    value,
    veteranFacilityState,
  } = props;
  const { reviewMode, submitted } = formContext;
  const { StringField } = registry.fields;

  const [facilities, setFacilities] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);

  // define our error messages
  const errorMessages = { required: 'Please provide a response' };

  // define our custom onchange event
  const handleChange = event => {
    setDirty(true);
    onChange(event.target.value);
  };

  // define our custom onblur event
  const handleBlur = () => {
    setDirty(true);
  };

  // check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return (submitted || dirty) && !value ? errorMessages.required : false;
  };

  // dynamically load facilities based upon state selection
  useEffect(
    () => {
      if (veteranFacilityState) {
        isLoading(true);
        // fetch, map and set facility data
        apiRequest(`${apiRequestWithUrl}&state=${veteranFacilityState}`, {})
          .then(res => {
            return res.data.map(location => ({
              id: location.id,
              name: location.attributes.name,
            }));
          })
          .then(data => {
            setFacilities(data);
            isLoading(false);
          })
          .catch(err => {
            isLoading(false);
            hasError(true);
            Sentry.withScope(scope => {
              scope.setExtra('state', veteranFacilityState);
              scope.setExtra('error', err);
              Sentry.captureMessage('Caregiver facilities failed to load');
            });
            focusElement('.caregivers-error-message');
          });
      } else {
        setFacilities([]);
        isLoading(false);
      }
    },
    [veteranFacilityState],
  );

  return !reviewMode ? (
    <div className="schemaform-field-template">
      {!error ? (
        <VaSelect
          id={id}
          name={id}
          value={value}
          label="VA medical center"
          error={showError() || null}
          required
          onVaSelect={handleChange}
          onBlur={handleBlur}
        >
          <option value="">
            {loading ? 'Loading VA medical centers...' : ' '}
          </option>
          {facilities.map(facility => (
            <option key={facility.id} value={facility.id.split('_').pop()}>
              {facility.name}
            </option>
          ))}
        </VaSelect>
      ) : (
        <va-alert
          class="caregivers-error-message vads-u-margin-top--4"
          status="error"
        >
          <h3 slot="headline">Something went wrong</h3>
          <p>
            We’re sorry. Something went wrong on our end. Please try again
            later.
          </p>
        </va-alert>
      )}
    </div>
  ) : (
    <StringField {...props} />
  );
};

VaMedicalCenter.propTypes = {
  formContext: PropTypes.object,
  id: PropTypes.string,
  registry: PropTypes.object,
  value: PropTypes.string,
  veteranFacilityState: PropTypes.string,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  veteranFacilityState:
    state.form.data.veteranPreferredFacility.veteranFacilityState,
});

export default connect(mapStateToProps)(VaMedicalCenter);
