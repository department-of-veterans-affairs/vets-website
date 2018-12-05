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
    expect(component.html()).to.contain(
      'You haven’t selected any benefits to learn about.',
    );
  });
  it('should render view with preferences', () => {
    props.preferences.dashboard.education = true;
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.find('PreferenceList').length).to.equal(1);
  });
});
