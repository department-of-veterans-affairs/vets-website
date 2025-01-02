import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';

const Unauthed = ({ headerLevel = 3 }) => {
  const dispatch = useDispatch();

  // const content = {
  //   heading: `Sign in to change your direct deposit information online`,
  //   headerLevel,
  //   alertText: (
  //     <div>
  //       <p>
  //         Sign in with your existing Login.gov or ID.me account. Or create one
  //         of these accounts now.
  //       </p>
  //       <p>
  //         <strong>Note:</strong> If you sign in with a DS Logon or My HealtheVet
  //         account, you won’t be able to change your direct deposit information.
  //       </p>
  //     </div>
  //   ),
  //   primaryButtonText: 'Sign in or create an account',
  //   primaryButtonHandler,
  //   status: 'continue',
  //   ariaLabel,
  //   ariaDescribedby,
  // };

  return (
    <VaAlertSignIn variant="signInRequired" visible headerLevel={headerLevel}>
      <span slot="SignInButton">
        <va-button
          text="Sign in or create an account"
          onClick={() => dispatch(toggleLoginModal(true, '', true))}
        />
      </span>
    </VaAlertSignIn>
  );
};

Unauthed.propTypes = {
  primaryButtonHandler: PropTypes.func.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  headerLevel: PropTypes.number,
};

export default Unauthed;
