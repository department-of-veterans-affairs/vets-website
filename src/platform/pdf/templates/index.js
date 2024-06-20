const templates = [];

templates.medicalRecords = () => {
  return require('./medical_records');
};

templates.blueButtonReport = () => {
  return require('./blue_button_report');
};

templates.medications = () => {
  return require('./medications');
};

templates.veteranStatus = () => {
  return require('./veteran_status');
};

export { templates };
