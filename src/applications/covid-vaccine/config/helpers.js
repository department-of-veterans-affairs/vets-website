export const isTypeNone = formData => {
  if (formData.applicantType == 'none') {
    return true;
  } else {
    return false;
  }
};

export const isVeteran = formData => {
  if (formData.applicantType == 'veteran') {
    return true;
  } else {
    return false;
  }
};
