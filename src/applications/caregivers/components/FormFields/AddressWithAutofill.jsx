import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { AddressWithAutofillReviewField } from '../FormReview/AddressWithAutofillReviewField';
import { CaregiverCountyDescription } from '../FormDescriptions/AddressCountyDescriptions';
import { REQUIRED_ADDRESS_FIELDS } from '../../utils/constants';
import { replaceStrValues } from '../../utils/helpers';
import {
  STATES_USA,
  VaCheckbox,
  VaSelect,
  VaTextInput,
} from '../../utils/imports';
import content from '../../locales/en/content.json';

// define our custom error messages
const errorMessages = {
  street: { required: content['validation-address--street-required'] },
  city: { required: content['validation-address--city-required'] },
  state: { required: content['validation-address--state-required'] },
  postalCode: {
    required: content['validation-address--postalCode-required'],
    pattern: content['validation-address--postalCode-pattern'],
  },
  county: {
    required: content['validation-address--county-required'],
    pattern: content['validation-address--county-pattern'],
  },
};

// define our custom input labels
const inputLabelMap = {
  primaryAddress: content['primary-input-label'],
  secondaryOneAddress: content['secondary-one-input-label'],
  secondaryTwoAddress: content['secondary-two-input-label'],
};

const AddressWithAutofill = props => {
  const { formContext, formData, idSchema, onChange, schema, name } = props;
  const { properties: schemaProps } = schema;
  const veteranAddress = useSelector(state => state.form.data.veteranAddress);
  const [dirtyFields, setDirtyFields] = useState(new Set());

  const parseFieldName = useCallback(field => field.split('_').pop(), []);

  // ensure formData has all field values if/when browser autocomplete fires
  const updateFormDataForAutocomplete = useCallback(() => {
    [...REQUIRED_ADDRESS_FIELDS, 'street2'].forEach(field => {
      const fieldName = `root_${name}_${field}`;
      const inputElement = document.getElementById(fieldName);
      formData[field] = inputElement?.value;
    });
  }, [formData, name]);

  const addDirtyField = useCallback(
    field => setDirtyFields(prevState => new Set(prevState).add(field)),
    [],
  );

  const handleCheck = useCallback(
    event => {
      const isChecked = event.target.checked;
      const updatedData = isChecked
        ? { ...veteranAddress, 'view:autofill': true }
        : { 'view:autofill': false };
      addDirtyField('autofill');
      onChange(updatedData);
    },
    [addDirtyField, onChange, veteranAddress],
  );

  const handleChange = useCallback(
    event => {
      const fieldName = parseFieldName(event.target.name);
      formData[fieldName] = event.target.value;
      formData['view:autofill'] = false;
      updateFormDataForAutocomplete();
      onChange(formData);
    },
    [formData, onChange, parseFieldName, updateFormDataForAutocomplete],
  );

  const handleBlur = useCallback(
    event => {
      const fieldName = parseFieldName(event.target.name);
      addDirtyField(fieldName);
      updateFormDataForAutocomplete();
      onChange(formData);
    },
    [
      addDirtyField,
      formData,
      onChange,
      parseFieldName,
      updateFormDataForAutocomplete,
    ],
  );

  const fieldError = useCallback(
    field => {
      // skip validation if field is prestine & submission has not occurred
      if (!formContext.submitted && !dirtyFields.has(field)) return null;

      // validate field for required data
      if (REQUIRED_ADDRESS_FIELDS.includes(field) && !formData[field]) {
        return errorMessages[field].required;
      }

      // validate field for pattern regex match
      if (
        schemaProps[field].pattern &&
        !new RegExp(schemaProps[field].pattern, 'i').test(
          formData[field]?.trim(),
        )
      ) {
        return errorMessages[field].pattern;
      }

      // default return
      return null;
    },
    [dirtyFields, formData, schemaProps, formContext.submitted],
  );

  const stateOptions = useMemo(
    () =>
      STATES_USA.map(state => (
        <option key={state.value} value={state.value}>
          {state.label}
        </option>
      )),
    [],
  );

  if (formContext.reviewMode) {
    return (
      <AddressWithAutofillReviewField
        formData={formData}
        inputLabel={inputLabelMap[name]}
      />
    );
  }

  return (
    <div className="cg-address-with-autofill">
      <p>{content['caregiver-address-description--vet-home']}</p>
      <p className="va-address-block vads-u-margin-left--0 vads-u-margin-bottom--4">
        {veteranAddress.street} {veteranAddress.street2}
        <br role="presentation" />
        {veteranAddress.city}, {veteranAddress.state}{' '}
        {veteranAddress.postalCode}
      </p>

      <VaCheckbox
        id={`root_${name}_autofill`}
        name={`root_${name}_autofill`}
        checked={formData['view:autofill']}
        label={content['caregiver-address-same-as-vet-label']}
        onVaChange={handleCheck}
      />

      <VaTextInput
        id={idSchema.street.$id}
        name={idSchema.street.$id}
        value={formData.street}
        label={replaceStrValues(
          content['form-address-street-label'],
          inputLabelMap[name],
        )}
        hint={content['caregiver-address-street-hint']}
        autocomplete="address-line1"
        className="cg-address-input"
        error={fieldError('street')}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      />

      <VaTextInput
        id={idSchema.street2.$id}
        name={idSchema.street2.$id}
        value={formData.street2}
        label={content['form-address-street2-label']}
        autocomplete="address-line2"
        className="cg-address-input"
        onInput={handleChange}
        onBlur={handleBlur}
      />

      <VaTextInput
        id={idSchema.city.$id}
        name={idSchema.city.$id}
        value={formData.city}
        label={content['form-address-city-label']}
        autocomplete="address-level2"
        className="cg-address-input"
        error={fieldError('city')}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      />

      <VaSelect
        id={idSchema.state.$id}
        name={idSchema.state.$id}
        value={formData.state}
        label={content['form-address-state-label']}
        autocomplete="address-level1"
        className="cg-address-select"
        error={fieldError('state')}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {stateOptions}
      </VaSelect>

      <VaTextInput
        id={idSchema.postalCode.$id}
        name={idSchema.postalCode.$id}
        value={formData.postalCode}
        label={content['form-address-postalCode-label']}
        autocomplete="postal-code"
        className="cg-address-input"
        error={fieldError('postalCode')}
        pattern={schemaProps.postalCode.pattern}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      />

      <VaTextInput
        id={idSchema.county.$id}
        name={idSchema.county.$id}
        value={formData.county}
        label={content['form-address-county-label']}
        hint={content['form-address-county-hint']}
        className="cg-address-input"
        error={fieldError('county')}
        pattern={schemaProps.county.pattern}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      >
        <CaregiverCountyDescription />
      </VaTextInput>
    </div>
  );
};

AddressWithAutofill.propTypes = {
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  name: PropTypes.string,
  schema: PropTypes.object,
  onChange: PropTypes.func,
};

export default AddressWithAutofill;
