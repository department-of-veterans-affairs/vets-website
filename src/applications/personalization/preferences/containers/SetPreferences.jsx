import React from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import get from 'platform/utilities/data/get';
import LoadingButton from '../../profile360/vet360/components/base/LoadingButton';

import PreferenceOption from '../components/PreferenceOption';
import { benefitChoices, didJustSave } from '../helpers';
import {
  SaveFailedMessageComponent,
  RetrieveFailedMessageComponent,
} from '../helperComponents';
import { LOADING_STATES } from '../constants';
import {
  setPreference,
  fetchAvailableBenefits,
  fetchUserSelectedBenefits,
  updatePreferences,
} from '../actions';

class SetPreferences extends React.Component {
  componentWillMount() {
    this.props.fetchAvailableBenefits();
    this.props.fetchUserSelectedBenefits();
  }

  // if the preferences are saved successfully, then redirect to home
  componentDidUpdate(prevProps) {
    if (didJustSave(prevProps, this.props)) {
      this.goHome();
    }
  }

  // helper to get the loading status of the two backend calls
  getLoadingStatus = () => {
    const {
      allBenefitsLoadingStatus: statusAll,
      userBenefitsLoadingStatus: statusUser,
    } = this.props.preferences;
    if (
      statusAll === LOADING_STATES.error ||
      statusUser === LOADING_STATES.error
    ) {
      return LOADING_STATES.error;
    }
    if (
      statusAll === LOADING_STATES.loaded &&
      statusUser === LOADING_STATES.loaded
    ) {
      return LOADING_STATES.loaded;
    }
    return LOADING_STATES.pending;
  };

  goHome = () => {
    this.props.router.push('/');
  };

  handleSave = () => {
    const { dashboard } = this.props.preferences;
    this.props.updatePreferences(dashboard);
  };

  handlePreferenceToggle = (code, value) => {
    this.props.setPreference(code, value);
  };

  // checks to see if the current state of the dashboard (ie preferences
  // selected by the user) is different from how they were when they were pulled
  // from the server
  userHasNotMadeChange = () =>
    isEqual(
      this.props.preferences.dashboard,
      this.props.preferences.savedDashboard,
    );

  // hydrate benefit options from the backend with data from the benefitChoices
  // helper array. We are storing user-facing info in the benefitChoices array
  // so that user-facing info can be updated by the frontend devs rather than
  // relying on the backend.
  hydrateBenefits = benefits =>
    benefits.map(benefit => {
      const hydratedBenefit = { ...benefit };
      const helperData = benefitChoices.find(
        choice => choice.code === benefit.code,
      );
      hydratedBenefit.title = helperData.title;
      hydratedBenefit.description = get(
        'description',
        helperData,
        benefit.description,
      );
      return hydratedBenefit;
    });

  renderContent() {
    const loadingStatus = this.getLoadingStatus();
    const availableBenefits = this.hydrateBenefits(
      this.props.preferences.availableBenefits,
    );
    const { saveStatus, dashboard } = this.props.preferences;

    if (loadingStatus === LOADING_STATES.pending) {
      return <LoadingIndicator message={'Loading benefit choices...'} />;
    }
    if (loadingStatus === LOADING_STATES.error) {
      return <RetrieveFailedMessageComponent showLink />;
    }
    if (loadingStatus === LOADING_STATES.loaded) {
      return (
        <div>
          <h3>I want to:</h3>
          <div className="preferences-grid">
            {availableBenefits.map((benefit, benefitIndex) => (
              <PreferenceOption
                key={benefitIndex}
                item={benefit}
                onChange={this.handlePreferenceToggle}
                checked={!!dashboard[benefit.code]}
              />
            ))}
          </div>
          {saveStatus === LOADING_STATES.error && SaveFailedMessageComponent}
          <div>
            <LoadingButton
              isLoading={saveStatus === LOADING_STATES.pending}
              onClick={this.handleSave}
              disabled={this.userHasNotMadeChange()}
            >
              <span>Save Preferences</span>
            </LoadingButton>
            <Link to="/" className="usa-button usa-button-secondary">
              Cancel
            </Link>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <h1 id="dashboard-title">Find VA Benefits</h1>
          <p className="va-introtext">
            Tell us which benefits you’re interested in, so we can help you
            apply. Select one or more of the types of benefits below, and we’ll
            help you get started.
          </p>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  preferences: state.preferences,
});

const mapDispatchToProps = {
  setPreference,
  fetchAvailableBenefits,
  fetchUserSelectedBenefits,
  updatePreferences,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SetPreferences),
);
export { SetPreferences };
