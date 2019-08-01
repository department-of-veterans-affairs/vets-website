// Not entirely sure if this is needed. Adding in here just in case we want to
// leverage this functionality.
import profileInformation from 'platform/user/profile/reducers';
import connectedAccounts from './connectedAccounts';

export default {
  connectedAccounts,
  account: profileInformation,
};
