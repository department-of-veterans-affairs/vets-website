import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import moment from 'moment';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import deduplicate from 'platform/utilities/data/deduplicate';
import environment from 'platform/utilities/environment';

import PreferenceList from '../components/PreferenceList';

import { setPreference, savePreferences, fetchPreferences } from '../actions';
import { benefitChoices } from '../helpers';

const BenefitAlert = ({ alert: Alert }) => <Alert />;

class PreferencesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    const savedRecently = moment().isBefore(
      this.props.preferences.savedAt + 5000,
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
      5000,
    );
    // Set new message timer to state
    this.setState({ savedMessageTimer });
  };

  handleRemove = async slug => {
    await this.props.setPreference(slug, false);
    this.props.savePreferences(this.props.preferences.dashboard);
    this.setSavedMessage();
  };

  handleViewToggle = slug => {
    this.setState({
      [slug]: !this.state[slug],
    });
  };

  render() {
    const {
      preferences: { dashboard },
    } = this.props;
    const { savedMessage } = this.state;
    // do not show in production
    if (environment.isProduction()) {
      return null;
    }
    const selectedBenefits = benefitChoices.filter(
      item => !!dashboard[item.slug],
    );
    const hasSelectedBenefits = !!selectedBenefits.length;
    let selectedBenefitAlerts = selectedBenefits
      .filter(item => !!item.alert)
      .map(item => item.alert);
    selectedBenefitAlerts = deduplicate(selectedBenefitAlerts);
    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <div className="title-container">
            <h2>Find VA Benefits</h2>
            {hasSelectedBenefits && (
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
              <AlertBox
                status="success"
                headline="We saved your preferences."
              />
            )}
          </ReactCSSTransitionGroup>
          {!hasSelectedBenefits && (
            <div>
              <p>You haven’t selected any benefits to learn about.</p>
              <Link to="preferences">Select benefits now.</Link>
            </div>
          )}
          {selectedBenefitAlerts.length > 0 && (
            <div>
              {selectedBenefitAlerts.map((alert, index) => (
                <BenefitAlert alert={alert} key={index} />
              ))}
            </div>
          )}
          {hasSelectedBenefits && (
            <PreferenceList
              benefits={selectedBenefits}
              view={this.state}
              handleViewToggle={this.handleViewToggle}
              handleRemove={this.handleRemove}
            />
          )}
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
  fetchPreferences,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesWidget);
export { PreferencesWidget };
