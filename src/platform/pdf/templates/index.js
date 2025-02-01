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

templates.veteranStatusNew = () => {
  return require('./veteran_status_new');
};

templates.selfEnteredInfo = () => {
  return require('./self_entered_info');
};

export { templates };
