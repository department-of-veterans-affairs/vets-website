import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  dateSigned,
  transformMailingAddress,
  transformPhoneNumberObject,
} from '../helpers';

export default function transform(formConfig, form) {
  // Formats the user's contact information from the *profileContactInfoPages*
  const applicantTransform = formData => {
    let clonedData = cloneDeep(formData);

    const {
      mailingAddress,
      homePhone,
      mobilePhone,
      email,
    } = clonedData.veteran;

    clonedData = {
      ...clonedData,
      mailingAddress: transformMailingAddress(mailingAddress),
      homePhone: transformPhoneNumberObject(homePhone),
      mobilePhone: transformPhoneNumberObject(mobilePhone),
      emailAddress: email?.emailAddress || '',
    };
    delete clonedData.veteran;

    return clonedData;
  };

  // The ssn is set as the *vaFileNumber* for this schema, so both are not required
  const identifierTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.ssn;

    return clonedData;
  };

  // Prep course cost must be sent as a number (or decimal in this case)
  const prepCourseTransform = formData => {
    const clonedData = cloneDeep(formData);

    clonedData.prepCourseCost = parseFloat(
      clonedData.prepCourseCost,
    ).toPrecision(2);

    return clonedData;
  };

  // Removes the signature from the privacy agreement and sets the *dateSigned* as the current date
  const privacyAgreementTransform = formData => {
    const clonedData = cloneDeep(formData);

    delete clonedData.statementOfTruthCertified;

    return {
      ...clonedData,
      dateSigned: dateSigned(),
    };
  };

  // Stringifies the form data and removes empty fields
  const usFormTransform = formData =>
    transformForSubmit(
      formConfig,
      { ...form, data: formData },
      { allowPartialAddress: true },
    );

  const transformedData = [
    applicantTransform,
    identifierTransform,
    prepCourseTransform,
    privacyAgreementTransform,
    usFormTransform, // this must appear last
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
