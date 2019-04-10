import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { SetPreferences } from '../../containers/SetPreferences';
import { benefitChoices } from '../../helpers';
import { LOADING_STATES } from '../../constants';

const updatePreferences = spy();
const setPreference = spy();
const push = spy();

const props = {
  fetchUserSelectedBenefits: () => true,
  fetchAvailableBenefits: () => true,
  updatePreferences,
  setPreference,
  isLoading: false,
  preferences: {
    dashboard: {
      healthcare: false,
    },
    allBenefitsLoadingStatus: LOADING_STATES.loaded,
    userBenefitsLoadingStatus: LOADING_STATES.loaded,
    availableBenefits: benefitChoices.map(item => ({
      code: item.code,
      description: item.description,
    })),
  },
  router: {
    push,
  },
};

describe('<SetPreferences>', () => {
  it('should render', () => {
    props.preferences.saveStatus = LOADING_STATES.loaded;

    const component = shallow(<SetPreferences {...props} />);
    expect(component.find('LoadingButton').props().isLoading).to.be.false;
    expect(component.find('LoadingButton').html()).to.contain('Save');
    expect(
      component
        .find('Link')
        .first()
        .html(),
    ).to.contain('Cancel');
    expect(component.find('h1').html()).to.contain('Find VA benefits');
    expect(component.find('p').html()).to.contain(
      'Tell us which benefits you’re interested in, so we can help you apply. Select one or more of the types of benefits below, and we’ll help you get started.',
    );
    component.unmount();
  });
  it('should handle updates', () => {
    props.preferences.saveStatus = LOADING_STATES.loaded;

    const component = mount(<SetPreferences {...props} />);
    component
      .find('Checkbox')
      .first()
      .simulate('click'); // TODO: update test
    // expect(setPreference.args[0][0]).to.equal('healthcare');
    // expect(setPreference.args[0][1]).to.equal(true);
    component
      .find('button')
      .first()
      .simulate('click');

    expect(updatePreferences.args[0][0].healthcare).to.equal(false);
    component.unmount();
  });
  it('should render loading view', () => {
    props.preferences.saveStatus = LOADING_STATES.pending;

    const component = shallow(<SetPreferences {...props} />);

    expect(component.find('LoadingButton').props().isLoading).to.be.true;
    component.unmount();
  });
});
