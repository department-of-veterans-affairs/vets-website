import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { states } from 'platform/forms/address';
import {
  VaCheckbox,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { AddressWithAutofillReviewField } from '../FormReview/AddressWithAutofillReviewField';
import { CaregiverCountyDescription } from '../FormDescriptions/AddressCountyDescriptions';
import { REQUIRED_ADDRESS_FIELDS } from '../../utils/constants';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

const PrimaryAddressWithAutofill = props => {
  const { formContext, formData, idSchema, onChange, schema } = props;
  const { reviewMode, submitted } = formContext;
  const { properties: schemaProps } = schema;
  const { veteranAddress } = useSelector(state => state.form.data);
  const [dirtyFields, setDirtyFields] = useState([]);

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

  // populate our dirty fields array on user interaction
  const addDirtyField = useCallback(
    field => {
      if (!dirtyFields.includes(field)) {
        setDirtyFields(prevState => [...prevState, field]);
      }
    },
    [dirtyFields],
  );

  // define our checkbox input change event
  const handleCheck = useCallback(
    event => {
      formData['view:autofill'] = event.target.checked;
      // transform and send data back to the form
      const dataToSend = formData['view:autofill']
        ? { ...formData, ...veteranAddress }
        : { 'view:autofill': false };
      addDirtyField('autofill');
      onChange(dataToSend);
    },
    [addDirtyField, formData, onChange, veteranAddress],
  );

  // define our non-checkbox input change event
  const handleChange = useCallback(
    event => {
      const fieldName = event.target.name.split('_').pop();
      formData[fieldName] = event.target.value;
      // uncheck autofill since we have modified the input value
      if (formData['view:autofill']) formData['view:autofill'] = false;
      // send updated date to the form
      onChange(formData);
    },
    [formData, onChange],
  );

  // define our non-checkbox input blur event
  const handleBlur = useCallback(
    event => {
      const fieldName = event.target.name.split('_').pop();
      addDirtyField(fieldName);
    },
    [addDirtyField],
  );

  // check for validation errors if field is dirty or form has been submitted
  const showError = field => {
    const fieldIsDirty = dirtyFields.includes(field);
    if (submitted || fieldIsDirty) {
      // validate required fields
      if (REQUIRED_ADDRESS_FIELDS.includes(field) && !formData[field]) {
        return errorMessages[field].required;
      }
      // validate fields with required pattern matches
      if (schemaProps[field].pattern) {
        const regex = new RegExp(schemaProps[field].pattern, 'i');
        if (!regex.test(formData[field].trim())) {
          return errorMessages[field].pattern;
        }
      }
    }
    return null;
  };

  return reviewMode ? (
    <AddressWithAutofillReviewField
      formData={formData}
      inputLabel={inputLabelMap[props.name]}
    />
  ) : (
    <div className="cg-address-with-autofill">
      <p>{content['caregiver-address-description--vet-home']}</p>
      <p className="va-address-block vads-u-margin-left--0 vads-u-margin-bottom--4">
        {veteranAddress.street} {veteranAddress.street2}
        <br />
        {veteranAddress.city}, {veteranAddress.state}{' '}
        {veteranAddress.postalCode}
      </p>

      <VaCheckbox
        id="root_caregiverAddress_autofill"
        name="root_caregiverAddress_autofill"
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
          inputLabelMap[props.name],
        )}
        hint={content['caregiver-address-street-hint']}
        className="cg-address-input"
        error={showError('street')}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      />

      <VaTextInput
        id={idSchema.street2.$id}
        name={idSchema.street2.$id}
        value={formData.street2}
        label={content['form-address-street2-label']}
        className="cg-address-input"
        onInput={handleChange}
        onBlur={handleBlur}
      />

      <VaTextInput
        id={idSchema.city.$id}
        name={idSchema.city.$id}
        value={formData.city}
        label={content['form-address-city-label']}
        className="cg-address-input"
        error={showError('city')}
        onInput={handleChange}
        onBlur={handleBlur}
        required
      />

      <VaSelect
        id={idSchema.state.$id}
        name={idSchema.state.$id}
        value={formData.state}
        label={content['form-address-state-label']}
        className="cg-address-select"
        error={showError('state')}
        onVaSelect={handleChange}
        onBlur={handleBlur}
        required
      >
        {states.USA.map(state => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </VaSelect>

      <VaTextInput
        id={idSchema.postalCode.$id}
        name={idSchema.postalCode.$id}
        value={formData.postalCode}
        label={content['form-address-postalCode-label']}
        className="cg-address-input"
        error={showError('postalCode')}
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
        error={showError('county')}
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

PrimaryAddressWithAutofill.propTypes = {
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  name: PropTypes.string,
  schema: PropTypes.object,
  onChange: PropTypes.func,
};

export default PrimaryAddressWithAutofill;
