import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { chunk, fill } from 'lodash';

import { benefitChoices } from './helpers';

import { setPreference, savePreferences } from './actions';

import localStorage from '../../../platform/utilities/storage/localStorage';

import Checkbox from '../../gi/components/Checkbox.jsx';

class SetPreferences extends React.Component {
  componentDidMount() {
    localStorage.setItem('dashboardLastVisitedAt', Date.now());
  }

  handlePreferenceToggle = (slug) => {
    return () => {
      this.props.setPreference(slug, !this.props.preferences.dashboard[slug]);
    };
  }

  render() {
    return (
      <div className="row user-profile-row">
        <div className="small-12 columns">
          <h1 id="dashboard-title">Find VA Benefits</h1>
          <p className="va-introtext">Tell us which benefits you're interested in, so we can help you apply. Select one or more of the types of benefits below, and we'll help you get started.</p>
          <div>
            {chunk(benefitChoices, 3).map((c, i) => {
              return (
                <div key={i} className="preferences-row">
                  {c.concat(fill(Array(3 - c.length), null)).map((e, ix) => {
                    let itemContent;
                    if (e) {
                      itemContent = (
                        <div className="preference-item" onClick={this.handlePreferenceToggle(e.slug)}>
                          <div className="right">
                            <Checkbox
                              name={e.slug}
                              checked={!!this.props.preferences.dashboard[e.slug]}
                              label=""
                              onChange={this.handlePreferenceToggle(e.slug)}/>
                          </div>
                          <h5>{e.title}</h5>
                          <p>{e.description}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={`{i}-${ix}`} className="preference-item-wrapper">
                        {itemContent}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Link to="/">Cancel</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    preferences: state.preferences,
  };
};

const mapDispatchToProps = {
  setPreference,
  savePreferences,
};

export default connect(mapStateToProps, mapDispatchToProps)(SetPreferences);
export { SetPreferences };
