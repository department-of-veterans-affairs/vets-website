import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { chunk } from 'lodash';

import { benefitChoices } from './helpers';

class PreferencesWidget extends React.Component {
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
                  {c.map((e, ix) => {
                    return (
                      <div key={`{i}-${ix}`} className="preference-item-wrapper">
                        <div className="preference-item">
                          <h5>{e.title}</h5>
                          <p>{e.description}</p>
                        </div>
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
    ...state,
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesWidget);
export { PreferencesWidget };
