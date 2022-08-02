import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectEditedFormField } from '@@vap-svc/selectors';
import { updateFormFieldWithSchema } from '@@vap-svc/actions';
import { useField } from 'formik';
import { phoneConvertNextValueToCleanData } from '@@profile/util/contact-information/phoneUtils';

const PhoneField = props => {
  const { handleChange, label, name, required = false } = props;
  const [field, meta, helpers] = useField(props);
  return (
    <VaTextInput
      error={meta.error}
      label={label}
      name={name}
      value={field.value}
      onInput={handleChange(name, helpers.setValue)}
      required={required}
    />
  );
};

const PhoneWithExtension = props => {
  const { formSchema, uiSchema, fieldName } = props;

  const dispatch = useDispatch();

  const formField = useSelector(state =>
    selectEditedFormField(state, fieldName),
  );

  const handleChange = (fieldToUpdate, setValue) => {
    return e => {
      const nextValue = phoneConvertNextValueToCleanData({
        ...formField.value,
        ...{ [fieldToUpdate]: e.target.value },
      });
      setValue(e.target.value);
      dispatch(
        updateFormFieldWithSchema(fieldName, nextValue, formSchema, uiSchema),
      );
    };
  };

  return (
    <>
      <PhoneField
        name="inputPhoneNumber"
        handleChange={handleChange}
        label="Home phone number (U.S. numbers only)"
        required
        {...props}
      />

      <PhoneField
        name="extension"
        handleChange={handleChange}
        label="Extension"
        {...props}
      />
    </>
  );
};

export default PhoneWithExtension;
