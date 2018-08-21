import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { chunk, fill } from 'lodash';

import { benefitChoices } from './helpers';

import localStorage from '../../../platform/utilities/storage/localStorage';

class PreferencesWidget extends React.Component {
  componentDidMount() {
    localStorage.setItem('dashboardLastVisitedAt', Date.now());
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
                        <div className="preference-item">
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
    ...state,
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesWidget);
export { PreferencesWidget };
