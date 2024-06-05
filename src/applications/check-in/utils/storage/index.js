import { APP_NAMES } from '../appConstants';

const createStorageKeys = ({ app }) => {
  const namespaces = {
    [APP_NAMES.PRE_CHECK_IN]: 'health.care.pre.check.in',
    [APP_NAMES.CHECK_IN]: 'health.care.check-in',
    [APP_NAMES.TRAVEL_CLAIM]: 'my.health.travel-claim',
  };
  const sessionStorageKeys = {
    CURRENT_UUID: `${namespaces[app]}.current.uuid`,
    COMPLETE: `${namespaces[app]}.complete`,
    PROGRESS_STATE: `${namespaces[app]}.progress`,
    PERMISSIONS: `${namespaces[app]}.permissions`,
  };
  if (app !== APP_NAMES.TRAVEL_CLAIM) {
    sessionStorageKeys.CHECK_IN_COMPLETE = `${
      namespaces[app]
    }.check.in.complete`;
    sessionStorageKeys.SHOULD_SEND_DEMOGRAPHICS_FLAGS = `${
      namespaces[app]
    }.should.send.demographics.flags`;
  }
  if (app !== APP_NAMES.PRE_CHECK_IN) {
    sessionStorageKeys.SHOULD_SEND_TRAVEL_PAY_CLAIM = `${
      namespaces[app]
    }.should.send.travel.pay.claim`;
    sessionStorageKeys.TRAVEL_CLAIM_DATA = `${
      namespaces[app]
    }.travel.claim.data`;
    sessionStorageKeys.TRAVELPAY_SENT = `${namespaces[app]}.travel.pay.sent`;
  }
  return sessionStorageKeys;
};

export { createStorageKeys };
