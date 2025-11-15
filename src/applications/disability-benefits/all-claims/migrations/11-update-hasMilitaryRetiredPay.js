const oldPropertyName = 'view:hasMilitaryRetiredPay';
const newPropertyName = 'hasMilitaryRetiredPay';

const update = formData => {
  /* eslint-disable no-param-reassign */
  if (!(oldPropertyName in formData)) return;

  if (!(newPropertyName in formData))
    formData[newPropertyName] = formData[oldPropertyName];

  delete formData[oldPropertyName];
  /* eslint-enable no-param-reassign */
};

export default savedData => {
  update(savedData.formData);
  return savedData;
};
