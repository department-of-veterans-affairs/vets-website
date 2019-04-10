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
    props.preferences.dashboard['health-care'] = false;
    props.preferences.dashboard['education-training'] = false;
    props.setDismissedBenefitAlerts = () => true;
    props.preferences.dismissedBenefitAlerts = [];
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.find('Link').length).to.equal(1);
    expect(component.find('Link').html()).to.contain('Select benefits now.');
    expect(component.find('Link').html()).to.not.contain('Find VA benefits');
    expect(component.html()).to.contain(
      'You haven’t selected any benefits to learn about.',
    );
    component.unmount();
  });
  it('should render view with preferences', () => {
    props.preferences.dashboard['health-care'] = true;
    props.preferences.dashboard['education-training'] = true;
    props.setDismissedBenefitAlerts = () => true;
    props.preferences.dismissedBenefitAlerts = [];
    const component = shallow(<PreferencesWidget {...props} />);
    expect(component.find('Link').length).to.equal(1);
    expect(component.find('Link').html()).to.contain('Find VA benefits');
    expect(component.find('Link').html()).to.not.contain(
      'Select benefits now.',
    );
    expect(component.find('PreferenceList').length).to.equal(1);
    expect(component.find('BenefitAlert').length).to.equal(1);
    component.unmount();
  });
});
