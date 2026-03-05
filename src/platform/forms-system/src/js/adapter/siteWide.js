/**
 * Adapter — platform/site-wide re-exports.
 */

export { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

export {
  restartShouldRedirect,
  WIZARD_STATUS,
  WIZARD_STATUS_RESTARTING,
  WIZARD_STATUS_COMPLETE,
} from 'platform/site-wide/wizard';

export { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export { generateMockUser } from 'platform/site-wide/user-nav/tests/mocks/user';
