export default function uiSchema(label, dataConstant) {
  return {
    'ui:title': `Re-enter ${label}  email address`,
    'ui:autocomplete': 'email',
    'ui:widget': 'email',
    'ui:required': formData => !!formData[dataConstant],
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          const doesEmailMatch = () =>
            formData[dataConstant] === formData[`view:${dataConstant}`];

          if (!doesEmailMatch()) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  };
}
