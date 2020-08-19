export const isDependent = formData => {
  return (
    formData.status === 'Spouse of a Veteran or service member' ||
    formData.status === 'Child of a Veteran or service member'
  );
};

export const isVeteran = formData => {
  return (
    formData.status === 'Veteran' ||
    formData.status === 'Active duty service member'
  );
};
