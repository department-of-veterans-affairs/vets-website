import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { getVerifyUrl } from '../../../common/helpers/login-helpers.js';
import { updateVerifyUrl } from '../../../login/actions';
import { removeSavedForm } from '../actions';

import FormList from '../components/FormList';
import MessagingWidget from './MessagingWidget';
import ClaimsAppealsWidget from './ClaimsAppealsWidget';
import PrescriptionsWidget from './PrescriptionsWidget';

import BetaApp, { features } from '../../../common/containers/BetaApp';
import RequiredLoginView from '../../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../../common/containers/DowntimeNotification';

moment.updateLocale('en', {
  meridiem: (hour) => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  },
  monthsShort: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ]
});

class DashboardApp extends React.Component {
  componentDidMount() {
    if (!this.props.verifyUrl) {
      getVerifyUrl(this.props.updateVerifyUrl);
    }
  }

  render() {
    const view = (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Dashboard</h1>
          <div>
            <FormList
              userProfile={this.props.profile}
              removeSavedForm={this.props.removeSavedForm}
              savedForms={this.props.profile.savedForms}/>
            <ClaimsAppealsWidget/>
            <PrescriptionsWidget/>
            <MessagingWidget/>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <RequiredLoginView
          authRequired={3}
          serviceRequired={['evss-claims', 'appeals-status', 'user-profile']}
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <BetaApp featureName={features.dashboard}>
            <DowntimeNotification appTitle="user dashboard" dependencies={[services.mvi, services.emis]}>
              {view}
            </DowntimeNotification>
          </BetaApp>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {
  removeSavedForm,
  updateVerifyUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardApp);
export { DashboardApp };
