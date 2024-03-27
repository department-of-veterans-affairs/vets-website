import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  const {
    'view:fullName': {
      first: firstName,
      middle: middleName,
      last: lastName,
      ...rest
    },
    homeAddress: {
      street: homeLine1,
      street2: homeLine2,
      street3: homeAptOrSuite,
      ...homeRest
    },
    workAddress: {
      street: workLine1,
      street2: workLine2,
      street3: workAptOrSuite,
      ...workRest
    },
    birthDate,
    AGREED,
    ...restData
  } = form.data;

  const transformedData = {
    ...restData,
    'view:fullName': {
      firstName,
      middleName,
      lastName,
      ...rest,
    },
    homeAddress: {
      line1: homeLine1,
      line2: homeLine2,
      aptOrSuite: homeAptOrSuite,
      ...homeRest,
    },
    workAddress: {
      line1: workLine1,
      line2: workLine2,
      aptOrSuite: workAptOrSuite,
      ...workRest,
    },
    birthDate: birthDate + 'T00:00:00.000Z',
  };

  const transformedForm = { ...form, data: transformedData };
  return transformForSubmit(formConfig, transformedForm);
}
