import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/browser';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import ServerErrorAlert from '../FormAlerts/ServerErrorAlert';

const apiRequestWithUrl = `${
  environment.API_URL
}/v1/facilities/va?type=health&per_page=100`;

const VaMedicalCenter = props => {
  const { formContext, id, onChange, required, value, facilityState } = props;
  const { reviewMode, submitted } = formContext;

  const [facilities, setFacilities] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);

  // define our error message(s)
  const errorMessages = { required: 'Please provide a response' };

  // define our custom onchange event
  const handleChange = event => {
    setDirty(true);
    onChange(event.detail.value);
  };

  // define our custom onblur event
  const handleBlur = () => {
    setDirty(true);
  };

  // check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return (submitted || dirty) && !value ? errorMessages.required : false;
  };

  // grab the facility name based upon the selected value
  const getFacilityName = useCallback(
    val => {
      const facility = facilities.find(f => f.id.split('_').pop() === val);
      return facility?.name || '\u2014';
    },
    [facilities],
  );

  // fetch, map and set our list of facilities based on the state selection
  useEffect(
    () => {
      if (facilityState) {
        isLoading(true);
        apiRequest(`${apiRequestWithUrl}&state=${facilityState}`, {})
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
              scope.setExtra('state', facilityState);
              scope.setExtra('error', err);
              Sentry.captureMessage('Health care facilities failed to load');
            });
            focusElement('.server-error-message');
          });
      } else {
        setFacilities([]);
        isLoading(false);
      }
    },
    [facilityState],
  );

  // render the static facility name on review page
  if (reviewMode) {
    return (
      <span
        className="dd-privacy-hidden"
        data-testid="hca-facility-name"
        data-dd-action-name="facility name"
      >
        {getFacilityName(value)}
      </span>
    );
  }

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading available facilities..."
        set-focus
      />
    );
  }

  return !error ? (
    <VaSelect
      id={id}
      name={id}
      value={value}
      label="Center or clinic"
      error={showError() || null}
      required={required}
      onVaSelect={handleChange}
      onBlur={handleBlur}
    >
      <option value="">&nbsp;</option>
      {facilities.map(f => (
        <option key={f.id} value={f.id.split('_').pop()}>
          {f.name}
        </option>
      ))}
    </VaSelect>
  ) : (
    <div className="server-error-message vads-u-margin-top--4">
      <ServerErrorAlert />
    </div>
  );
};

VaMedicalCenter.propTypes = {
  facilityState: PropTypes.string,
  formContext: PropTypes.object,
  id: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  facilityState:
    state.form.data['view:preferredFacility']['view:facilityState'],
});

export default connect(mapStateToProps)(VaMedicalCenter);
