import { submitToUrl } from 'platform/forms-system/src/js/actions';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit(formConfig, form);

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

  const eventData = {
    'previously-diagnosed-with-covid19': formData.diagnosed ? 'Yes' : 'No',
    'close-contact-with-positive-test': getFormattedRadioValues(
      'closeContactPositive',
      formData.closeContactPositive,
    ),
    'hospitalized-w-in-six-months': resolveBooleanValue(formData.hospitalized),
    'smoke-or-vape-history': resolveBooleanValue(formData.smokeOrVape),
    'historical-health-issues': getFormattedTrueSelectValues('HEALTH_HISTORY'),
    'work-situation': getFormattedTrueSelectValues('EMPLOYMENT_STATUS'),
    'work-transportation': getFormattedTrueSelectValues('TRANSPORTATION'),
    'people-living-at-home': getFormattedRadioValues(
      'residentsInHome',
      formData.residentsInHome,
    ),
    'close-contact-outside-of-home': getFormattedRadioValues(
      'closeContact',
      formData.closeContact,
    ),
    'zip-code': formData.zipCode,
    'relationship-to-va': getFormattedTrueSelectValues('VETERAN'),
    gender: getFormattedTrueSelectValues('GENDER'),
    'race-ethnicity-origin': getFormattedTrueSelectValues('RACE_ETHNICITY'),
  };

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    eventData,
  );
};

export default submitForm;
