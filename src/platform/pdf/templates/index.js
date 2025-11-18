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

templates.oneDebtLetter = () => {
  return require('./one_debt_letter');
};

templates.militaryService = () => {
  return require('./military_service');
};

templates.disputeDebt = () => {
  return require('./dispute_debt');
};

templates.disputeDebtVeteranFacing = () => {
  return require('./dispute_debt_veteran_facing');
};

export { templates };
