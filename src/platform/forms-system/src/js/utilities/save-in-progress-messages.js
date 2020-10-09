import { APP_TYPE_DEFAULT } from '../constants';

const appType = formConfig =>
  formConfig.customText?.appType || APP_TYPE_DEFAULT;

export function inProgressMessage(formConfig) {
  const defaultMessage = `Your ${appType} is in progress.`;
  return formConfig.saveInProgress?.inProgress || defaultMessage;
}

export function expiredMessage(formConfig) {
  const defaultMessage = `Your saved ${appType} has expired. If you want to apply for benefits, please start a new ${appType}.`;
  return formConfig.saveInProgress?.expired || defaultMessage;
}

export function savedMessage(formConfig) {
  const defaultMessage = `Your ${appType} has been saved.`;
  return formConfig.saveInProgress?.saved || defaultMessage;
}
