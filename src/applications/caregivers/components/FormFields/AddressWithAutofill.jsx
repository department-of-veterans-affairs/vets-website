import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import constants from 'vets-json-schema/dist/constants.json';
import {
  VaCheckbox,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  primaryInputLabel,
  secondaryOneInputLabel,
  secondaryTwoInputLabel,
} from '../../definitions/UIDefinitions/caregiverUI';
import { AddressWithAutofillReviewField } from '../FormReview/AddressWithAutofillReviewField';

const PrimaryAddressWithAutofill = props => {
  const {
    errorSchema,
    formContext,
    formData,
    idSchema,
    onChange,
    schema,
    veteranAddress,
  } = props;
  const { reviewMode, submitted } = formContext;
  const { properties: schemaProps, required: reqFields } = schema;
  const [dirtyFields, setDirtyFields] = useState([]);

  // define our custom error messages
  const errorMessages = {
    street: { required: 'Please enter a home address' },
    city: { required: 'Please enter a city' },
    state: { required: 'Please enter a state' },
    postalCode: {
      required: 'Please enter a postal code',
      pattern:
        'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    },
  };

  // define our custom input labels
  const inputLabelMap = {
    primaryAddress: primaryInputLabel,
    secondaryOneAddress: secondaryOneInputLabel,
    secondaryTwoAddress: secondaryTwoInputLabel,
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
    // validate only if field is dirty or form has been submitted
    if ((submitted || fieldIsDirty) && errorList.length) {
      // validate required fields
      if (reqFields.includes(field) && !formData[field]) {
        return errorMessages[field].required;
      }
      // validate fields with required pattern matches
      if (schemaProps[field].pattern) {
        const regex = new RegExp(schemaProps[field].pattern);
        if (!regex.test(formData[field])) {
          return errorMessages[field].pattern;
        }
      }
    }
    return false;
  };

  return reviewMode ? (
    <AddressWithAutofillReviewField
      formData={formData}
      inputLabel={inputLabelMap[props.name]}
    />
  ) : (
    <fieldset className="cg-address-with-autofill vads-u-margin-y--2">
      <legend className="vads-u-visibility--screen-reader">
        {inputLabelMap[props.name]} current address
      </legend>

      <VaCheckbox
        id="root_primaryAddress_autofill"
        checked={formData['view:autofill']}
        label="Use the same address as the Veteran"
        onVaChange={handleCheck}
      />

      <VaTextInput
        id={idSchema.street.$id}
        name={idSchema.street.$id}
        value={formData.street}
        label={`${inputLabelMap[props.name]} current home address`}
        hint="This is the address where the Caregiver lives"
        className="cg-address-input"
        error={showError('street') || null}
        required
        onInput={handleChange}
        onBlur={handleBlur}
      />

      <VaTextInput
        id={idSchema.street2.$id}
        name={idSchema.street2.$id}
        value={formData.street2}
        label="Home address line 2"
        className="cg-address-input"
        onInput={handleChange}
        onBlur={handleBlur}
      />

      <VaTextInput
        id={idSchema.city.$id}
        name={idSchema.city.$id}
        value={formData.city}
        label="City"
        className="cg-address-input"
        error={showError('city') || null}
        required
        onInput={handleChange}
        onBlur={handleBlur}
      />

      <VaSelect
        id={idSchema.state.$id}
        name={idSchema.state.$id}
        value={formData.state}
        label="State"
        className="cg-address-select"
        error={showError('state') || null}
        required
        onVaSelect={handleChange}
        onBlur={handleBlur}
      >
        <option value=""> </option>
        {constants.states.USA.map(state => (
          <option key={state.value} value={state.value}>
            {state.label}
          </option>
        ))}
      </VaSelect>

      <VaTextInput
        id={idSchema.postalCode.$id}
        name={idSchema.postalCode.$id}
        value={formData.postalCode}
        label="Postal code"
        className="cg-address-input cg-input-size-medium"
        error={showError('postalCode') || null}
        pattern={schemaProps.postalCode.pattern}
        required
        onInput={handleChange}
        onBlur={handleBlur}
      />
    </fieldset>
  );
};

PrimaryAddressWithAutofill.propTypes = {
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  name: PropTypes.string,
  schema: PropTypes.object,
  veteranAddress: PropTypes.object,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  veteranAddress: state.form.data.veteranAddress,
});

export default connect(mapStateToProps)(PrimaryAddressWithAutofill);
