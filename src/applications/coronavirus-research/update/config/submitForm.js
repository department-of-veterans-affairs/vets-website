import { submitToUrl } from 'platform/forms-system/src/js/actions';

const submitForm = (form, formConfig, submissionId) => {
  const formWithSubmissionId = {
    ...form,
    data: {
      ...form.data,
      registryUUID: submissionId,
    },
  };
  const body = formConfig.transformForSubmit(formConfig, formWithSubmissionId);
  const formData = form.data;
  const uiSchema = formConfig.chapters.chapter1.pages.page1.uiSchema;

  const getFormattedTrueSelectValues = element => {
    return Object.keys(formData[element])
      .filter(key => formData[element][key] === true)
      .map(value => {
        if (element === 'GENDER' && value.includes('SELF_IDENTIFY')) {
          return `${uiSchema[element][value]['ui:title']}: ${
            formData.GENDER_SELF_IDENTIFY_DETAILS
          }`;
        } else {
          return uiSchema[element][value]['ui:title'];
        }
      });
  };

  const getFormattedRadioValues = (element, key) => {
    return uiSchema[element]['ui:options'].labels[key];
  };

  const resolveBooleanValue = value => {
    return value ? 'Yes' : 'No';
  };

  // format values for Analytics
  const eventData = {
    registryUUID: submissionId,
    zipCode: formData.zipCode,
    diagnosed: resolveBooleanValue(formData.diagnosed),
    vaccinated: resolveBooleanValue(formData.vaccinated),
    ELIGIBLE: resolveBooleanValue(formData.ELIGIBLE),
    FACILITY: resolveBooleanValue(formData.FACILITY),
    VACCINATED_PLAN: formData.VACCINATED_PLAN
      ? getFormattedRadioValues('VACCINATED_PLAN', formData.VACCINATED_PLAN)
      : null,
    VACCINATED_DETAILS: formData.VACCINATED_DETAILS
      ? getFormattedRadioValues(
          'VACCINATED_DETAILS',
          formData.VACCINATED_DETAILS,
        )
      : null,
    VACCINATED_DATE1: formData.VACCINATED_DATE1
      ? formData.VACCINATED_DATE1
      : null,
    VACCINATED_DATE2: formData.VACCINATED_DATE2
      ? formData.VACCINATED_DATE2
      : null,
    VACCINATED_SECOND: formData.VACCINATED_SECOND
      ? resolveBooleanValue(formData.VACCINATED_SECOND)
      : null,
    DIAGNOSED_DETAILS: formData.DIAGNOSED_DETAILS
      ? getFormattedTrueSelectValues('DIAGNOSED_DETAILS')
      : null,
    DIAGNOSED_SYMPTOMS: formData.DIAGNOSED_SYMPTOMS
      ? getFormattedTrueSelectValues('DIAGNOSED_SYMPTOMS')
      : null,
  };

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    eventData,
  );
};

export default submitForm;
