import {
  WIZARD_STATUS,
  WIZARD_STATUS_RESTARTED,
  WIZARD_STATUS_RESTARTING,
} from './constants';

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
