const templates = [];

templates.medicalRecords = () => {
  return require('./medical_records');
};

templates.medications = () => {
  return require('./medications');
};

export { templates };
