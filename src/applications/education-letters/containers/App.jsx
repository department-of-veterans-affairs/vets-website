import React from 'react';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { toggleLoginModal as toggleLoginModalAction } from 'platform/site-wide/user-nav/actions';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import { fetchUser } from '../../my-education-benefits/selectors/userDispatch';

const App = ({ toggleLoginModal, user }) => {
  function toggleLogin(e) {
    e.preventDefault();
    toggleLoginModal(true, 'cta-form');
  }

  function renderUI() {
    if (!user?.login?.currentlyLoggedIn && !user?.login?.hasCheckedKeepAlive) {
      return (
        <div className="vads-u-margin-y--5">
          <va-loading-indicator
            label="Loading"
            message="Please wait while we load the application for you."
            set-focus
          />
        </div>
      );
    }
    if (user?.login?.currentlyLoggedIn) {
      window.location.href = '/education/education-letters/preview';
    }

    return (
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 slot="headline">
          Please sign in to check your VA education letter
        </h3>
        <div>
          Sign in with your existing <b>ID.me</b> account. If you don’t have an
          account, you can create a free <b>ID.me</b> account now.
        </div>
        <button className="va-button" type="button" onClick={toggleLogin}>
          Sign in or create an account
        </button>
      </va-alert>
    );
  }

  return (
    <>
      <Layout
        clsName="introduction-page"
        breadCrumbs={{
          href: '/education/education-letters',
          text: 'Download your VA education letter',
        }}
      >
        <FormTitle title="Download your VA education letter" />

        <p className="va-introtext">
          If you’re a Veteran and you recently received your VA education
          decision letter, you can download it now.
        </p>

        {renderUI()}

        <div className="vads-u-margin-bottom--6">
          <h2>Who can download VA education letters?</h2>
          <p>
            You can download your education letter if you’re a Veteran and you
            meet both of the requirements listed here. At this time, family
            members and dependents can’t get their education letters online.
          </p>
          <p>
            <b>Both of these must be true:</b>
          </p>
          <ul>
            <li>
              You applied for Post-9/11 GI Bill benefits, <b>and</b>
            </li>
            <li>
              You received a decision from us about your application after Month
              Day, Year
            </li>
          </ul>
          <p>
            <b>Note:</b> If you have an older decision letter—or you’re a family
            member or dependent—you can contact us through Ask VA to request a
            copy of your letter.
            <a href="https://nam04.safelinks.protection.outlook.com/?url=https%3A%2F%2Fask.va.gov%2F&data=04%7C01%7Cherbert.anagho%40accenturefederal.com%7C5b0be35e33a2487d4a0c08d9ecb991bc%7C0ee6c63b4eab4748b74ad1dc22fc1a24%7C0%7C0%7C637801104030719343%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000&sdata=QuGxWs9osAHjaGwInFjQO5cwEQ%2BK84u9J3XH2QcwZNk%3D&reserved=0">
              Request your VA education letter through Ask VA.
            </a>
          </p>
          <va-alert
            close-btn-aria-label="Close notification"
            show-icon
            status="info"
            visible
          >
            <h3 slot="headline">
              You’ll have access to other types of education letters here in the
              future
            </h3>
            <div>
              Right now you can only download your education decision letter.
            </div>
          </va-alert>
        </div>
      </Layout>
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
