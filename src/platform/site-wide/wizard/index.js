export const WIZARD_STATUS = 'wizardStatus';
export const WIZARD_STATUS_NOT_STARTED = 'not started';
export const WIZARD_STATUS_RESTARTING = 'restarting';
export const WIZARD_STATUS_RESTARTED = 'restarted';
export const WIZARD_STATUS_COMPLETE = 'complete';

export const restartShouldRedirect = wizardStatusKey => {
  const key = wizardStatusKey || WIZARD_STATUS;
  if (sessionStorage.getItem(key) === WIZARD_STATUS_RESTARTING) {
    // Change wizard status to prevent the router from getting updated more than
    // once; as long as the status isn't "complete", the wizard will become
    // visible
    sessionStorage.setItem(key, WIZARD_STATUS_RESTARTED);
    return true;
  }
  return false;
};
