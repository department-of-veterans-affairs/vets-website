import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectEditedFormField } from '@@vap-svc/selectors';
import { updateFormFieldWithSchema } from '@@vap-svc/actions';
import { useField } from 'formik';

const HomePhone = props => {
  const { formSchema, uiSchema, fieldName } = props;
  const [field, meta, helpers] = useField(props);
  const dispatch = useDispatch();

  const formField = useSelector(state =>
    selectEditedFormField(state, fieldName),
  );

  // console.log({ formField });

  const handlePhoneChange = e => {
    helpers.setValue(e.target.value);
    dispatch(
      updateFormFieldWithSchema(
        fieldName,
        { ...formField.value, ...{ inputPhoneNumber: e.target.value } },
        formSchema,
        uiSchema,
      ),
    );
  };

  return (
    <>
      <VaTextInput
        error={meta.error}
        label="Home phone number (U.S. numbers only)"
        name="inputPhoneNumber"
        value={field.value}
        onInput={handlePhoneChange}
        required
      />
    </>
  );
};

export default HomePhone;
