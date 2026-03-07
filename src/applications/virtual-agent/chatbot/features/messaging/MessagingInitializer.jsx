import PropTypes from 'prop-types';

import { GENESYS_CONFIG } from './constants';
import { useMessaging } from './useMessaging';

/**
 * Bootstraps the Genesys messaging service on mount and exposes the resulting
 * action methods to children via a render-prop pattern.
 *
 * Chosen over a context provider to keep the first iteration simple. If prop
 * drilling becomes painful as the feature grows, refactor to a context.
 *
 * @component
 * @param {{ children: function({ startConversation: function, sendMessage: function }): JSX.Element }} props
 * @returns {JSX.Element}
 */
export default function MessagingInitializer({ children }) {
  const messaging = useMessaging(GENESYS_CONFIG);
  return children(messaging);
}

MessagingInitializer.propTypes = {
  children: PropTypes.func.isRequired,
};
