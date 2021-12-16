import { APP_TYPE_DEFAULT } from '../constants';

const appType = formConfig =>
  formConfig.customText?.appType || APP_TYPE_DEFAULT;

export function inProgressMessage(formConfig) {
  const defaultMessage = `Your ${appType(formConfig)} is in progress`;
  const message = formConfig.saveInProgress?.messages?.inProgress;

  return typeof message === 'string'
    ? message.replace(/\.$/, '') // remove any trailing period
    : defaultMessage;
}

export function expiredMessage(formConfig) {
  const defaultMessage = `Your saved ${appType(
    formConfig,
  )} has expired. If you want to apply for benefits, please start a new ${appType(
    formConfig,
  )}.`;
  return formConfig.saveInProgress?.messages?.expired || defaultMessage;
}

export function savedMessage(formConfig) {
  const defaultMessage = `Your ${appType(formConfig)} has been saved.`;
  return formConfig.saveInProgress?.messages?.saved || defaultMessage;
}
