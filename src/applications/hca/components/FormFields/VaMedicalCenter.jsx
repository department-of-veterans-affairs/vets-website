import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { usePrevious } from 'platform/utilities/react-hooks';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from 'platform/utilities/ui';
import { REACT_BINDINGS, STATES_USA } from '../../utils/imports';
import { API_ENDPOINTS, STATES_WITHOUT_MEDICAL } from '../../utils/constants';
import { VaMedicalCenterReviewField } from '../FormReview/VaMedicalCenterReviewField';
import content from '../../locales/en/content.json';

// expose React binding for web components
const { VaSelect } = REACT_BINDINGS;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [localData, setLocalData] = useState(formData);

  const prevFacilityState = usePrevious(localData['view:facilityState']);
  const facilityState = localData['view:facilityState'];

  const addDirtyField = useCallback(
    field => {
      if (!dirtyFields.includes(field)) {
        setDirtyFields(prevState => [...prevState, field]);
      }
    },
    [dirtyFields],
  );

  const parseFieldName = useCallback(name => name.split('_').pop(), []);

  const handleChange = useCallback(
    event => {
      const fieldName = parseFieldName(event.target.name);
      setLocalData(prevState => ({
        ...prevState,
        [fieldName]: event.target.value,
      }));
      addDirtyField(fieldName);
    },
    [addDirtyField, parseFieldName],
  );

  const handleBlur = useCallback(
    event => {
      const fieldName = parseFieldName(event.target.name);
      addDirtyField(fieldName);
    },
    [addDirtyField, parseFieldName],
  );

  const fieldError = useCallback(
    field => {
      const errorList = errorSchema[field].__errors || [];
      const fieldIsDirty = dirtyFields.includes(field);
      const shouldValidate = (submitted || fieldIsDirty) && errorList.length;

      // validate only if field is dirty or form has been submitted
      return shouldValidate && reqFields.includes(field) && !localData[field]
        ? content['validation-error--generic']
        : null;
    },
    [dirtyFields, errorSchema, localData, reqFields, submitted],
  );

  useEffect(
    () => {
      onChange({
        'view:facilityState': facilityState || undefined,
        vaMedicalFacility: localData.vaMedicalFacility || undefined,
      });
    },
    [facilityState, localData.vaMedicalFacility, onChange],
  );

  useEffect(
    () => {
      if (!facilityState || facilityState === prevFacilityState) return;

      const fetchFacilities = async () => {
        setError(false);
        setLoading(true);
        setFacilities([]);
        try {
          const response = await apiRequest(
            `${
              API_ENDPOINTS.facilities
            }?type=health&per_page=1000&state=${facilityState}`,
          );
          const facilityList = response
            .map(({ id, name }) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setLocalData(
            prevState =>
              prevFacilityState && prevFacilityState !== facilityState
                ? { ...prevState, vaMedicalFacility: undefined }
                : prevState,
          );
          setFacilities(facilityList);
        } catch (err) {
          setError(true);
          // Clear out selected state on error
          setLocalData(prevState => ({
            ...prevState,
            'view:facilityState': undefined,
          }));
          // Clear dirty fields to not display state selector error
          setDirtyFields([]);
          Sentry.withScope(scope => {
            scope.setExtra('state', facilityState);
            scope.setExtra('error', err);
            Sentry.captureMessage('Health care facilities failed to load');
          });
          focusElement('.server-error-message');
        } finally {
          setLoading(false);
        }
      };

      fetchFacilities();
    },
    [facilityState, prevFacilityState],
  );

  const selectedFacilityName = useMemo(
    () =>
      facilities.find(f => parseFieldName(f.id) === localData.vaMedicalFacility)
        ?.name || '\u2014',
    [facilities, localData.vaMedicalFacility, parseFieldName],
  );

  const stateOptions = useMemo(
    () =>
      STATES_USA.map(s => {
        return !STATES_WITHOUT_MEDICAL.includes(s.value) ? (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ) : null;
      }),
    [],
  );

  const facilityOptions = useMemo(
    () =>
      facilities.map(f => (
        <option key={f.id} value={parseFieldName(f.id)}>
          {f.name}
        </option>
      )),
    [facilities, parseFieldName],
  );

  if (loading) {
    return (
      <va-loading-indicator
        label={content['facilities--loading-message']}
        message={`${content['facilities--loading-message']}...`}
        set-focus
      />
    );
  }

  if (reviewMode) {
    const stateLabel = STATES_USA.find(s => s.value === facilityState)?.label;
    return (
      <VaMedicalCenterReviewField
        facilityName={selectedFacilityName}
        stateLabel={stateLabel}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="server-error-message vads-u-margin-top--4">
          <va-alert status="error" uswds>
            <h2 slot="headline">Something went wrong on our end</h2>
            <p>
              We’re sorry. Something went wrong on our end. Please try selecting
              your state again.
            </p>
          </va-alert>
        </div>
      )}
      <VaSelect
        id={idSchema['view:facilityState'].$id}
        name={idSchema['view:facilityState'].$id}
        label={content['facilities--state-label']}
        error={fieldError('view:facilityState')}
        value={facilityState}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {stateOptions}
      </VaSelect>

      <VaSelect
        id={idSchema.vaMedicalFacility.$id}
        name={idSchema.vaMedicalFacility.$id}
        label={content['facilities--clinic-label']}
        error={fieldError('vaMedicalFacility')}
        value={localData.vaMedicalFacility}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {facilityOptions}
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
