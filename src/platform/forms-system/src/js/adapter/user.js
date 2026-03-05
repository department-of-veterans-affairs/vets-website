/**
 * Adapter — platform/user re-exports.
 */

export { selectProfile, isLoggedIn } from 'platform/user/selectors';

export { default as AddressView } from 'platform/user/profile/vap-svc/components/AddressField/AddressView';
export { isFieldEmpty } from 'platform/user/profile/vap-svc/util';
export { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';
export { default as InitializeVAPServiceID } from 'platform/user/profile/vap-svc/containers/InitializeVAPServiceID';
export { default as ProfileInformationFieldController } from 'platform/user/profile/vap-svc/components/ProfileInformationFieldController';
export { refreshProfile, sanitizeUrl } from 'platform/user/exportsFile';
export {
  ContactInfoFormAppConfigProvider,
  useContactInfoFormAppConfig,
} from '@@vap-svc/components/ContactInfoFormAppConfigContext';
