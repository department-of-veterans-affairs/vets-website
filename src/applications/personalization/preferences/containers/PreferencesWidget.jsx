import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import moment from 'moment';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import deduplicate from 'platform/utilities/data/deduplicate';
import environment from 'platform/utilities/environment';

import PreferenceList from '../components/PreferenceList';

import {
  setPreference,
  savePreferences,
  fetchUserSelectedBenefits,
} from '../actions';
import {
  benefitChoices,
  SaveSucceededMessageComponent,
  SaveFailedMessageComponent,
  RetrieveFailedMessageComponent,
} from '../helpers';
import { LOADING_STATES } from '../constants';

const BenefitAlert = ({ alert: Alert }) => <Alert />;
const ALERT_DELAY = 5000;

class PreferencesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.props.fetchUserSelectedBenefits();
    const savedRecently = moment().isBefore(
      this.props.preferences.savedAt + ALERT_DELAY,
    );
    if (savedRecently) {
      this.setSavedMessage();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.savedMessageTimer);
  }

  setSavedMessage = () => {
    // Clear any existing saved message timer
    if (this.state.savedMessageTimer) {
      clearTimeout(this.state.savedMessageTimer);
    }

    // Display preferences saved message
    this.setState({ savedMessage: true });

    // Create new message timer
    const savedMessageTimer = setTimeout(
      () => this.setState({ savedMessage: false }),
      ALERT_DELAY,
    );
    // Set new message timer to state
    this.setState({ savedMessageTimer });
  };

  handleRemove = async code => {
    await this.props.setPreference(code, false);
    this.props.savePreferences(this.props.preferences.dashboard);
    this.setSavedMessage();
  };

  handleViewToggle = code => {
    this.setState({
      [code]: !this.state[code],
    });
  };

  handleCloseAlert = () => {
    clearTimeout(this.state.savedMessageTimer);
    this.setState({ savedMessage: false });
  };

  renderContent() {
    const {
      preferences: {
        dashboard,
        userBenefitsLoadingStatus: loadingStatus,
        saveStatus,
      },
    } = this.props;
    const selectedBenefits = benefitChoices.filter(
      item => !!dashboard[item.code],
    );
    const hasSelectedBenefits = !!selectedBenefits.length;
    let selectedBenefitAlerts = selectedBenefits
      .filter(item => !!item.alert)
      .map(item => item.alert);
    selectedBenefitAlerts = deduplicate(selectedBenefitAlerts);

    if (loadingStatus === LOADING_STATES.pending) {
      return <LoadingIndicator message={'Loading your selections...'} />;
    }
    if (loadingStatus === LOADING_STATES.error) {
      return <RetrieveFailedMessageComponent />;
    }
    if (saveStatus === LOADING_STATES.error) {
      return SaveFailedMessageComponent;
    }
    if (loadingStatus === LOADING_STATES.loaded) {
      if (!hasSelectedBenefits) {
        return (
          <div>
            <p>You haven’t selected any benefits to learn about.</p>
            <Link to="preferences">Select benefits now.</Link>
          </div>
        );
      }
      if (hasSelectedBenefits) {
        const content = [
          <PreferenceList
            key="preference-list"
            benefits={selectedBenefits}
            view={this.state}
            handleViewToggle={this.handleViewToggle}
            handleRemove={this.handleRemove}
          />,
        ];
        if (selectedBenefitAlerts.length) {
          content.unshift(
            <div key="benefit-alerts">
              {selectedBenefitAlerts.map((alert, index) => (
                <BenefitAlert alert={alert} key={index} />
              ))}
            </div>,
          );
        }
        return content;
      }
    }
    return null;
  }

  render() {
    // do not show in production
    if (environment.isProduction()) {
      return null;
    }
    const {
      preferences: { userBenefitsLoadingStatus },
    } = this.props;
    const { savedMessage } = this.state;

    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <div className="title-container">
            <h2>Find VA Benefits</h2>
            {userBenefitsLoadingStatus !== LOADING_STATES.pending && (
              <Link
                className="usa-button usa-button-secondary"
                to="preferences"
              >
                Find VA Benefits
              </Link>
            )}
          </div>
          <ReactCSSTransitionGroup
            transitionName="form-expanding-group-inner"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {savedMessage && (
              <SaveSucceededMessageComponent
                handleCloseAlert={this.handleCloseAlert}
              />
            )}
          </ReactCSSTransitionGroup>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state,
  preferences: state.preferences,
});

const mapDispatchToProps = {
  setPreference,
  savePreferences,
  fetchUserSelectedBenefits,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesWidget);
export { PreferencesWidget };
