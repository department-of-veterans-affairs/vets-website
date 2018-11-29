import React from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import PreferenceOption from '../components/PreferenceOption';
import { benefitChoices } from '../helpers';

import { setPreference, savePreferences, fetchPreferences } from '../actions';

class SetPreferences extends React.Component {
  componentDidMount() {
    this.props.fetchPreferences();
  }

  handleSave = () => {
    this.props.savePreferences(this.props.preferences.dashboard);
    this.props.router.push('/');
  };

  handlePreferenceToggle = slug => () => {
    this.props.setPreference(slug, !this.props.preferences.dashboard[slug]);
  };

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
          <div className="preferences-grid">
            {benefitChoices.map((item, itemIndex) => (
              <PreferenceOption
                key={itemIndex}
                item={item}
                onChange={this.handlePreferenceToggle}
                checked={!!this.props.preferences.dashboard[item.slug]}
              />
            ))}
          </div>
          <div>
            <button
              type="button"
              className="usa-button"
              onClick={this.handleSave}
            >
              Save Preferences
            </button>
            <Link to="/" className="usa-button usa-button-secondary">
              Cancel
            </Link>
          </div>
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
  savePreferences,
  fetchPreferences,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SetPreferences),
);
export { SetPreferences };
