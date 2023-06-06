import React from 'react';
import { connect } from 'react-redux';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import LoginWidget from '../components/LoginWidget';

const App = ({ user }) => {
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
    return <LoginWidget />;
  }

  return (
    <>
      <Layout
        clsName="introduction-page"
        breadCrumbs={{
          href: '/education/download-letters',
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
              You received a decision from us about your application after
              August 20, 2022.
            </li>
          </ul>
          <p>
            <b>Note:</b> If you have an older decision letter—or you’re a family
            member or dependent—you can contact us through Ask VA to request a
            copy of your letter.{' '}
            <a href="https://ask.va.gov/">
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
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user || {},
});

export default connect(mapStateToProps)(App);
