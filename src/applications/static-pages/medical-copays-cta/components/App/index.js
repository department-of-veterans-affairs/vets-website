import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';

export const App = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state?.user?.login?.currentlyLoggedIn);

  if (loggedIn) {
    return (
      <va-alert status="info" visible>
        <h3 slot="headline">Review your VA copay balances</h3>
        <p>With this tool, you can:</p>
        <ul>
          <li>Review your balances for each of your medical facilities</li>
          <li>Download your copay statements</li>
          <li>Find the right repayment option for you</li>
        </ul>
        <a
          className="vads-c-action-link--blue vads-u-margin-top--2"
          href="/manage-va-debt/summary/copay-balances"
        >
          Review your current copay balances
        </a>
      </va-alert>
    );
  }

  return (
    <va-alert-sign-in visible variant="signInRequired" heading-level={3}>
      <span slot="SignInButton">
        <va-button
          onClick={() => dispatch(toggleLoginModal(true))}
          text="Sign in or create an account"
        />
      </span>
    </va-alert-sign-in>
  );
};

export default App;
