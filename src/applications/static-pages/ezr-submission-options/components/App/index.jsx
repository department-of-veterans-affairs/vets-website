import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  InPersonDescription,
  MailDescription,
  PhoneDescription,
} from '../Descriptions';

export const App = ({ isEzrEnabled }) => {
  return isEzrEnabled ? (
    <>
      <p>
        You can update your health benefits information online, by phone, by
        mail, or in person.
      </p>

      <h3>Option 1: Online</h3>
      <p>
        You’ll need to sign in to VA.gov to update your health benefits
        information online.
      </p>
      <p>
        <a
          className="vads-c-action-link--green"
          href="/my-health/update-benefits-information-form-10-10ezr/"
        >
          Update your health benefits information online
        </a>
      </p>
      <p>
        <strong>Note:</strong> You can also update some information (like your
        address and other contact information) in your VA.gov profile.
      </p>
      <p>
        <va-link
          href="/resources/managing-your-vagov-profile/"
          text="Learn more about managing your VA.gov profile"
        />
      </p>

      <h3>Option 2: By phone</h3>
      <PhoneDescription />

      <h3>Option 3: By mail</h3>
      <MailDescription />

      <h3>Option 4: In person</h3>
      <InPersonDescription />
    </>
  ) : (
    <>
      <p>
        You can update your health benefits information by phone, by mail, or in
        person.
      </p>

      <h3>Option 1: By phone</h3>
      <PhoneDescription />

      <h3>Option 2: By mail</h3>
      <MailDescription />

      <h3>Option 3: In person</h3>
      <InPersonDescription />
    </>
  );
};

App.propTypes = {
  isEzrEnabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  isEzrEnabled: state.featureToggles.ezrProdEnabled,
});

export default connect(mapStateToProps)(App);
