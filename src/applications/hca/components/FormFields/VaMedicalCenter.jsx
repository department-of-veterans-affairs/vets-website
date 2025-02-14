import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { usePrevious } from 'platform/utilities/react-hooks';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import { REACT_BINDINGS, STATES_USA } from '../../utils/imports';
import { STATES_WITHOUT_MEDICAL } from '../../utils/constants';
import ServerErrorAlert from '../FormAlerts/ServerErrorAlert';
import { VaMedicalCenterReviewField } from '../FormReview/VaMedicalCenterReviewField';

// expose React binding for web components
const { VaSelect } = REACT_BINDINGS;

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
  const [localData, setLocalData] = useState(formData);

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

  const getFieldNameSuffix = fieldName => fieldName.split('_').pop();

  // define our non-checkbox input change event
  const handleChange = useCallback(
    event => {
      const fieldName = getFieldNameSuffix(event.target.name);
      setLocalData({ ...localData, [fieldName]: event.target.value });
      addDirtyField(fieldName);
    },
    [addDirtyField, localData],
  );

  // define our non-checkbox input blur event
  const handleBlur = useCallback(
    event => {
      const fieldName = getFieldNameSuffix(event.target.name);
      addDirtyField(fieldName);
    },
    [addDirtyField],
  );

  // check field for validation errors
  const showError = field => {
    const errorList = errorSchema[field].__errors || [];
    const fieldIsDirty = dirtyFields.includes(field);
    const shouldValidate = (submitted || fieldIsDirty) && errorList.length;

    // validate only if field is dirty or form has been submitted
    if (shouldValidate && reqFields.includes(field) && !localData[field]) {
      return errorMessages.required;
    }

    return false;
  };

  // grab the facility name based upon the selected value
  const getFacilityName = useCallback(
    val => {
      const facility = facilities.find(f => getFieldNameSuffix(f.id) === val);
      return facility?.name || '\u2014';
    },
    [facilities],
  );

  useEffect(
    () => {
      // To prevent submissions with values missing, we need to manually blank this.
      //   Unsetting the select's value sets it to '', but the form only blocks
      //   submission if the value is null or undefined. Without this, the form allows
      //   Continuing with both values set, going Back, unsetting the Facility, and then
      //   Continuing again, resulting in a State but no Facility.
      //   Similarly, selecting a State and Facility and then unselecting the State
      //   allows Continuing without a State set, causing the entire Review Form
      //   view to collapse to nothing.
      onChange({
        'view:facilityState': localData['view:facilityState'] || undefined,
        vaMedicalFacility: localData.vaMedicalFacility || undefined,
      });
    },
    [localData, onChange],
  );

  const localDataFacilityState = localData['view:facilityState'];
  const previousFacilityState = usePrevious(localData['view:facilityState']);

  // fetch, map and set our list of facilities based on the state selection
  useEffect(
    () => {
      const isStateChanged =
        localDataFacilityState &&
        localDataFacilityState !== previousFacilityState;

      if (!isStateChanged) return;

      isLoading(true);
      setFacilities([]);
      apiRequest(`${apiRequestWithUrl}&state=${localDataFacilityState}`, {})
        .then(res => {
          const data = res.map(location => ({
            id: location.id,
            name: location.name,
          }));

          setLocalData(prevLocalData => {
            const shouldClearFacility =
              previousFacilityState &&
              previousFacilityState !== localDataFacilityState;

            if (shouldClearFacility) {
              return { ...prevLocalData, vaMedicalFacility: undefined };
            }

            return prevLocalData;
          });

          setFacilities(data.sort((a, b) => a.name.localeCompare(b.name)));
          isLoading(false);
          hasError(false);
        })
        .catch(err => {
          isLoading(false);
          hasError(true);
          Sentry.withScope(scope => {
            scope.setExtra('state', localDataFacilityState);
            scope.setExtra('error', err);
            Sentry.captureMessage('Health care facilities failed to load');
          });
          focusElement('.server-error-message');
        });
    },
    [localDataFacilityState, previousFacilityState],
  );

  // render the static facility name on review page
  if (reviewMode) {
    const stateLabel = STATES_USA.find(
      state => state.value === localData['view:facilityState'],
    )?.label;
    return (
      <VaMedicalCenterReviewField
        facilityName={getFacilityName(localData.vaMedicalFacility)}
        stateLabel={stateLabel}
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

  return (
    <>
      {error && (
        <div className="server-error-message vads-u-margin-top--4">
          <ServerErrorAlert />
        </div>
      )}
      <VaSelect
        id={idSchema['view:facilityState'].$id}
        name={idSchema['view:facilityState'].$id}
        value={localData['view:facilityState']}
        label="State"
        error={showError('view:facilityState') || null}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {STATES_USA.map(s => {
          return !STATES_WITHOUT_MEDICAL.includes(s.value) ? (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ) : null;
        })}
      </VaSelect>

      <VaSelect
        id={idSchema.vaMedicalFacility.$id}
        name={idSchema.vaMedicalFacility.$id}
        value={localData.vaMedicalFacility}
        label="Center or clinic"
        error={showError('vaMedicalFacility') || null}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {facilities.map(f => (
          <option key={f.id} value={getFieldNameSuffix(f.id)}>
            {f.name}
          </option>
        ))}
      </VaSelect>
    </>
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
