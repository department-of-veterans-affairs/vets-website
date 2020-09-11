export const isDependent = formData => {
  return formData.status === 'isSpouse' || formData.status === 'isChild';
};

export const isVeteran = formData => {
  return formData.status === 'isVeteran' || formData.status === 'isActiveDuty';
};
