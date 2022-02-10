import React from 'react';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';

import PropTypes from 'prop-types';
import { fetchUser } from '../../my-education-benefits/selectors/userDispatch';

const App = ({ toggleLoginModal, user }) => {
  function toggleLogin(e) {
    e.preventDefault();
    toggleLoginModal(true, 'cta-form');
  }

  const NotLoggedIn = (
    <va-alert
      close-btn-aria-label="Close notification"
      status="continue"
      visible
    >
      <h3 slot="headline">Please sign in to check your VA education inbox</h3>
      <div>
        Sign in with your existing <b>ID.me</b> account. If you don’t have an
        account, you can create a free <b>ID.me</b> account now.
      </div>
      <button className="va-button-primary" type="button" onClick={toggleLogin}>
        Sign in or create an account
      </button>
    </va-alert>
  );

  const IsLoggedIn = (
    <button className="va-button-primary" type="button">
      Check your VA education inbox
    </button>
  );

  return (
    <>
      <Breadcrumbs>
        <a href="/">Home</a>
        <a href="/education/">Eduction and training</a>
        <a href="/education/education-inbox">Check your VA education inbox</a>
      </Breadcrumbs>
      <main id="main" className="main">
        <div className="usa-grid usa-grid-full">
          <div className="usa-width-three-fourths">
            <article className="usa-content vads-u-padding-bottom--0">
              <FormTitle title="Check your VA education inbox" />

              <p className="va-introtext">
                Download important documents about your education benefits here,
                including your decision letter. Find out if you can use this
                tool and how to sign in.
              </p>

              {user?.login?.currentlyLoggedIn ? IsLoggedIn : NotLoggedIn}

              <div>
                <h2>Can I use this tool?</h2>
                <p>
                  You can use this tool if you meet all of the requirements
                  listed below.
                </p>
                <p>
                  <b>Both of these must be true. You:</b>
                </p>
                <ul>
                  <li>
                    Applied for Post-9/11 GI Bill benefits, <b>and</b>
                  </li>
                  <li>
                    Received a decision from us on your application after Month
                    Day, Year
                  </li>
                </ul>
                <p>
                  <b>Note:</b> At this time, the VA education inbox isn’t
                  available online to family members and dependents.
                </p>
              </div>

              <div style={{ marginBottom: '6.4rem' }}>
                <h2>What information will I be able to see?</h2>
                <va-alert
                  background-only
                  close-btn-aria-label="Close notification"
                  show-icon
                  status="info"
                  visible
                >
                  <div>
                    At this time, we’re only able to show decision letters that
                    you received after <b>Month Day, 2022</b>. If you’re looking
                    for an older decision letter,{' '}
                    <a href="/">contact us using Ask VA</a>.
                  </div>
                </va-alert>
                <p>
                  <b>In your VA education inbox, you’ll find:</b>
                </p>
                <ul>
                  <li>
                    Important VA documents, including your Certificate of
                    Eligibility or Denial Letter if you’ve applied for the
                    Post-9/11 GI Bill
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </main>
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: fetchUser(state),
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
