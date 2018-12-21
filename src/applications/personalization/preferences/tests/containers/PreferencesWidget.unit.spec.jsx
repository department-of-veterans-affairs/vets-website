import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { PreferencesWidget } from '../../containers/PreferencesWidget';
import { LOADING_STATES } from '../../constants';

const props = {
  fetchUserSelectedBenefits: () => true,
  preferences: {
    dashboard: {
      'education-training': true,
    },
    userBenefitsLoadingStatus: LOADING_STATES.loaded,
  },
};

describe('<PreferencesWidget>', () => {
  it('should render empty view', () => {
    props.preferences.dashboard['education-training'] = false;
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.html()).to.contain(
      'You haven’t selected any benefits to learn about.',
    );
    component.unmount();
  });
  it('should render view with preferences', () => {
    props.preferences.dashboard['education-training'] = true;
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.find('PreferenceList').length).to.equal(1);
    component.unmount();
  });
});
