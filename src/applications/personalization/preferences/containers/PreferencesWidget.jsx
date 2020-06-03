import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import moment from 'moment';
import { isEmpty } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import deduplicate from 'platform/utilities/data/deduplicate';
import recordEvent from 'platform/monitoring/record-event';

import PreferenceList from '../components/PreferenceList';

import {
  setPreference,
  fetchUserSelectedBenefits,
  setDismissedBenefitAlerts,
  restorePreviousSelections,
  updatePreferences,
} from '../actions';
import {
  benefitChoices,
  dismissBenefitAlert,
  getDismissedBenefitAlerts,
  didPreferencesChange,
  didJustSave,
  didJustFailToSave,
} from '../helpers';
import {
  SaveSucceededMessageComponent,
  SaveFailedMessageComponent,
  RetrieveFailedMessageComponent,
} from '../helperComponents';
import { LOADING_STATES } from '../constants';

const BenefitAlert = ({ alert: Alert, onClose }) => (
  <Alert onCloseAlert={onClose} />
);
const ALERT_DELAY = 5000;

class PreferencesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.fetchUserSelectedBenefits();
    if (!isEmpty(this.props.preferences.dashboard)) {
      this.setSelectedBenefits();
    }
    const savedRecently = moment().isBefore(
      this.props.preferences.savedAt + ALERT_DELAY,
    );
    if (savedRecently) {
      this.setSavedMessage();
    }
  }

  componentDidUpdate(prevProps) {
    if (didPreferencesChange(prevProps, this.props)) {
      this.setSelectedBenefits();
    }
    if (didJustSave(prevProps, this.props)) {
      this.setSavedMessage();
    }
    if (didJustFailToSave(prevProps, this.props)) {
      this.props.restorePreviousSelections();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.savedMessageTimer);
  }

  setSelectedBenefits = () => {
    const {
      preferences: { dashboard },
    } = this.props;
    const selectedBenefits = benefitChoices.filter(
      item => !!dashboard[item.code],
    );
    this.setState({ selectedBenefits }, this.getDisplayedBenefitAlerts);
  };

  getDisplayedBenefitAlerts = () => {
    const dismissedAlerts = getDismissedBenefitAlerts();
    this.props.setDismissedBenefitAlerts(dismissedAlerts);
    const { dismissedBenefitAlerts } = this.props.preferences;
    const selectedBenefitAlerts = this.state.selectedBenefits
      .filter(item => !!item.alert)
      .map(item => item.alert);
    let displayedBenefitAlerts = selectedBenefitAlerts.filter(
      alert => !dismissedBenefitAlerts.includes(alert.name),
    );
    displayedBenefitAlerts = deduplicate(displayedBenefitAlerts);
    this.setState({ displayedBenefitAlerts });
  };

  setSavedMessage = () => {
    // Clear any existing saved message timer
    if (this.state.savedMessageTimer) {
      clearTimeout(this.state.savedMessageTimer);
    }

    // Display preferences saved message
    this.setState({ showSavedMessage: true });

    // Create new message timer
    const savedMessageTimer = setTimeout(
      () => this.setState({ showSavedMessage: false }),
      ALERT_DELAY,
    );
    // Set new message timer to state
    this.setState({ savedMessageTimer });
  };

  handleRemoveBenefit = async code => {
    await this.props.setPreference(code, false);
    const { dashboard } = this.props.preferences;
    this.props.updatePreferences(dashboard);
  };

  handleViewToggle = code => {
    this.setState({
      [code]: !this.state[code],
    });
  };

  handleCloseSavedAlert = () => {
    clearTimeout(this.state.savedMessageTimer);
    this.setState({ showSavedMessage: false });
  };

  handleCloseBenefitAlert = name => {
    dismissBenefitAlert(name);
    this.getDisplayedBenefitAlerts();
  };

  renderContent = () => {
    const {
      preferences: { userBenefitsLoadingStatus: loadingStatus, saveStatus },
    } = this.props;
    const { selectedBenefits, displayedBenefitAlerts } = this.state;

    const hasSelectedBenefits = selectedBenefits && !!selectedBenefits.length;

    if (loadingStatus === LOADING_STATES.pending) {
      return <LoadingIndicator message={'Loading your selections...'} />;
    }
    if (loadingStatus === LOADING_STATES.error) {
      return <RetrieveFailedMessageComponent />;
    }
    if (loadingStatus === LOADING_STATES.loaded) {
      if (!hasSelectedBenefits) {
        return (
          <div>
            <p>You haven’t selected any benefits to learn about.</p>
            <Link
              to="find-benefits"
              onClick={() =>
                recordEvent({
                  event: 'dashboard-navigation',
                  'dashboard-action': 'view-link',
                  'dashboard-product': 'select-benefits-now',
                })
              }
            >
              Select benefits now.
            </Link>
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
            handleRemove={this.handleRemoveBenefit}
          />,
        ];
        if (displayedBenefitAlerts && displayedBenefitAlerts.length) {
          content.unshift(
            <div key="benefit-alerts">
              {displayedBenefitAlerts.map(({ component, name }, index) => (
                <BenefitAlert
                  alert={component}
                  key={index}
                  onClose={() => this.handleCloseBenefitAlert(name)}
                />
              ))}
            </div>,
          );
        }
        if (saveStatus === LOADING_STATES.error) {
          content.unshift(<SaveFailedMessageComponent />);
        }
        return content;
      }
    }
    return null;
  };

  render() {
    const {
      preferences: { dashboard, userBenefitsLoadingStatus: loadingStatus },
    } = this.props;
    const isLoaded = loadingStatus !== LOADING_STATES.pending;
    const selectedBenefits = benefitChoices.filter(
      item => !!dashboard[item.code],
    );
    const hasSelectedBenefits = !!selectedBenefits.length;
    const { showSavedMessage } = this.state;

    return (
      <div>
        <div className="title-container">
          <h2>Find VA benefits</h2>
          {isLoaded &&
            hasSelectedBenefits && (
              <Link
                className="usa-button usa-button-secondary"
                to="find-benefits"
                onClick={() =>
                  recordEvent({
                    event: 'dashboard-navigation',
                    'dashboard-action': 'view-button',
                    'dashboard-product': 'find-va-benefits',
                  })
                }
              >
                Find VA benefits
              </Link>
            )}
        </div>
        <TransitionGroup
          transitionName="form-expanding-group-inner"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {showSavedMessage && (
            <SaveSucceededMessageComponent
              handleCloseAlert={this.handleCloseSavedAlert}
            />
          )}
        </TransitionGroup>
        {this.renderContent()}
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
  fetchUserSelectedBenefits,
  setDismissedBenefitAlerts,
  restorePreviousSelections,
  updatePreferences,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesWidget);
export { PreferencesWidget };
