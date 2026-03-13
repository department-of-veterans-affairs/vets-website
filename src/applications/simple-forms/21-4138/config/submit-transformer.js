import sharedTransformForSubmit from '../../shared/config/submit-transformer';

const transformForSubmit = (formConfig, form) => {
  const transformedData = JSON.parse(
    sharedTransformForSubmit(formConfig, form),
  );
  const { first, middle, last } = transformedData.fullName || {};

  if (first || last) {
    transformedData.fullName = {
      first: first?.slice(0, 12),
      last: last?.slice(0, 18),
      ...(middle && { middle: middle.charAt(0) }),
    };
  } else {
    transformedData.fullName = {};
  }
  if (!transformedData.dateOfBirth && form.data?.dateOfBirth) {
    transformedData.dateOfBirth = form.data.dateOfBirth;
  }

  return JSON.stringify(transformedData);
};

export default transformForSubmit;
