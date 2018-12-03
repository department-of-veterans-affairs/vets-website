import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import environment from 'platform/utilities/environment';

import PreferenceList from '../components/PreferenceList';

import { setPreference, savePreferences, fetchPreferences } from '../actions';
import { benefitChoices } from '../helpers';

class PreferencesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleViewToggle = slug => {
    this.setState({
      [slug]: !this.state[slug],
    });
  };

  handleRemove = async slug => {
    await this.props.setPreference(slug, false);
    this.props.savePreferences(this.props.preferences.dashboard);
  };

  render() {
    // do not show in production
    if (environment.isProduction()) {
      return null;
    }
    const hasSelectedBenefits = Object.values(
      this.props.preferences.dashboard,
    ).find(item => !!item);

    const selectedBenefits = benefitChoices.filter(
      item => !!this.props.preferences.dashboard[item.slug],
    );

    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <div className="title-container">
            <h2>Find VA Benefits</h2>
            {hasSelectedBenefits && (
              <Link className="usa-button" to="preferences">
                Find VA Benefits
              </Link>
            )}
          </div>
          {!hasSelectedBenefits && (
            <div>
              <p>You haven’t selected any benefits to learn about.</p>
              <Link to="preferences">Select benefits now</Link>
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
