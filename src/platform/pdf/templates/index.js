const templates = [];

templates.medicalRecords = () => {
  return require('./medical_records');
};

templates.medications = () => {
  return require('./medications');
};

templates.veteranStatus = () => {
  return require('./veteran_status');
};

export { templates };
