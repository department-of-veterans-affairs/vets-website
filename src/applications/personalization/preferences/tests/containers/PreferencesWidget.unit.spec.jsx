import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { PreferencesWidget } from '../../containers/PreferencesWidget';

const props = {
  preferences: {
    dashboard: {
      education: true,
    },
  },
};

describe('<PreferencesWidget>', () => {
  it('should render empty view', () => {
    props.preferences.dashboard.education = false;
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.debug()).to.equal(`<div className="row user-profile-row">
  <div className="small-12 columns">
    <div className="title-container">
      <h2>
        Find VA Benefits
      </h2>
    </div>
    <div>
      <p>
        You haven’t selected any benefits to learn about.
      </p>
      <Link to="preferences" onlyActiveOnIndex={false} style={{...}}>
        Select benefits now
      </Link>
    </div>
  </div>
</div>`);
  });
  it('should render view with preferences', () => {
    props.preferences.dashboard.education = true;
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.debug()).to.equal(`<div className="row user-profile-row">
  <div className="small-12 columns">
    <div className="title-container">
      <h2>
        Find VA Benefits
      </h2>
      <Link className="usa-button" to="preferences" onlyActiveOnIndex={false} style={{...}}>
        Find VA Benefits
      </Link>
    </div>
    <PreferenceList benefits={{...}} view={{...}} handleViewToggle={[Function]} handleRemove={[Function]} />
  </div>
</div>`);
  });
});
