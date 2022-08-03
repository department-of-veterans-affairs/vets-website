import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectEditedFormField } from '@@vap-svc/selectors';
import { updateFormFieldWithSchema } from '@@vap-svc/actions';
import { useField } from 'formik';
import { phoneConvertNextValueToCleanData } from '@@profile/util/contact-information/phoneUtils';
import { FIELD_TITLES } from '@@vap-svc/constants';

const PhoneField = props => {
  const { handleChange, label, name, required = false, dataTestId } = props;
  const [field, meta, helpers] = useField(props);
  return (
    <VaTextInput
      data-testid={dataTestId}
      error={meta.error}
      label={label}
      name={name}
      value={field.value}
      onInput={handleChange(name, helpers.setValue)}
      required={required}
    />
  );
};

PhoneField.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  required: PropTypes.bool,
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
        dataTestId="phoneField"
        name="inputPhoneNumber"
        handleChange={handleChange}
        label={`${FIELD_TITLES[fieldName]} (U.S. numbers only)`}
        required
        {...props}
      />

      <PhoneField
        dataTestId="extensionField"
        name="extension"
        handleChange={handleChange}
        label="Extension"
        {...props}
      />
    </>
  );
};

PhoneWithExtension.propTypes = {
  fieldName: PropTypes.string.isRequired,
  formSchema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
};

export default PhoneWithExtension;
