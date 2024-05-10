import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import constants from 'vets-json-schema/dist/constants.json';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import { focusElement } from '~/platform/utilities/ui';
import { STATES_WITHOUT_MEDICAL } from '../../utils/constants';
import ServerErrorAlert from '../FormAlerts/ServerErrorAlert';
import { VaMedicalCenterReviewField } from '../FormReview/VaMedicalCenterReviewField';

const apiRequestWithUrl = `${
  environment.API_URL
}/v0/health_care_applications/facilities?type=health&per_page=1000`;

const VaMedicalCenter = props => {
  const {
    errorSchema,
    formContext,
    formData,
    idSchema,
    onChange,
    schema,
  } = props;
  const { reviewMode, submitted } = formContext;
  const { required: reqFields } = schema;

  const [dirtyFields, setDirtyFields] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);

  // define our error message(s)
  const errorMessages = { required: 'Please provide a response' };

  // populate our dirty fields array on user interaction
  const addDirtyField = useCallback(
    field => {
      if (!dirtyFields.includes(field)) {
        setDirtyFields(prevState => [...prevState, field]);
      }
    },
    [dirtyFields],
  );

  // define our non-checkbox input change event
  const handleChange = useCallback(
    event => {
      const fieldName = event.target.name.split('_').pop();
      formData[fieldName] = event.target.value;
      addDirtyField(fieldName);
      onChange(formData);
    },
    [addDirtyField, formData, onChange],
  );

  // define our non-checkbox input blur event
  const handleBlur = useCallback(
    event => {
      const fieldName = event.target.name.split('_').pop();
      addDirtyField(fieldName);
    },
    [addDirtyField],
  );

  // check field for validation errors
  const showError = field => {
    const errorList = errorSchema[field].__errors;
    const fieldIsDirty = dirtyFields.includes(field);
    const shouldValidate = (submitted || fieldIsDirty) && errorList.length;

    // validate only if field is dirty or form has been submitted
    if (shouldValidate && reqFields.includes(field) && !formData[field]) {
      return errorMessages[field].required;
    }

    return false;
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
      const { 'view:facilityState': facilityState } = formData;
      if (facilityState) {
        isLoading(true);
        apiRequest(`${apiRequestWithUrl}&state=${facilityState}`, {})
          .then(res => {
            return res.map(location => ({
              id: location.id,
              name: location.name,
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
    [formData],
  );

  // render the static facility name on review page
  if (reviewMode) {
    return (
      <VaMedicalCenterReviewField
        facilityName={getFacilityName(formData.vaMedicalFacility)}
        state={formData['view:facilityState']}
      />
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
    <fieldset className="rjsf-object-field vads-u-margin-y--2">
      <legend
        id="root_view:preferredFacility__title"
        className="schemaform-block-title"
      >
        Select your preferred VA medical facility
      </legend>

      <VaSelect
        id={idSchema['view:facilityState'].$id}
        name={idSchema['view:facilityState'].$id}
        value={formData['view:facilityState']}
        label="State"
        error={showError('view:facilityState') || null}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
        uswds
      >
        {constants.states.USA.filter(state => {
          return !STATES_WITHOUT_MEDICAL.includes(state.value) ? (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ) : null;
        })}
      </VaSelect>

      <VaSelect
        id={idSchema.vaMedicalFacility.$id}
        name={idSchema.vaMedicalFacility.$id}
        value={formData.vaMedicalFacility}
        label="Center or clinic"
        error={showError('vaMedicalFacility') || null}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
        uswds
      >
        {facilities.map(f => (
          <option key={f.id} value={f.id.split('_').pop()}>
            {f.name}
          </option>
        ))}
      </VaSelect>
    </fieldset>
  ) : (
    <div className="server-error-message vads-u-margin-top--4">
      <ServerErrorAlert />
    </div>
  );
};

VaMedicalCenter.propTypes = {
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  schema: PropTypes.object,
  onChange: PropTypes.func,
};

export default VaMedicalCenter;
