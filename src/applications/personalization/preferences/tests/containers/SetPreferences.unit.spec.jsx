import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import { SetPreferences } from '../../containers/SetPreferences';

const savePreferences = spy();
const setPreference = spy();
const push = spy();

const props = {
  savePreferences,
  setPreference,
  isLoading: false,
  preferences: {
    dashboard: {
      healthcare: false,
    },
  },
  router: {
    push,
  },
};

describe('<SetPreferences>', () => {
  it('should render', () => {
    props.isLoading = false;
    const component = shallow(<SetPreferences {...props} />);

    expect(component.find('LoadingButton').props().isLoading).to.be.false;
    expect(component.find('LoadingButton').html()).to.contain('Save');
    expect(
      component
        .find('Link')
        .first()
        .html(),
    ).to.contain('Cancel');
    expect(component.find('h1').html()).to.contain('Find VA Benefits');
    expect(component.find('p').html()).to.contain(
      'Tell us which benefits you’re interested in, so we can help you apply. Select one or more of the types of benefits below, and we’ll help you get started.',
    );
  });
  it('should handle updates', () => {
    props.isLoading = false;
    const component = mount(<SetPreferences {...props} />);

    component
      .find('Checkbox')
      .first()
      .simulate('click');
    expect(setPreference.args[0][0]).to.equal('healthcare');
    expect(setPreference.args[0][1]).to.equal(true);
    component
      .find('button')
      .first()
      .simulate('click');
    expect(push.args[0][0]).to.equal('/');
    expect(savePreferences.args[0][0].healthcare).to.equal(false);
  });
  it('should render loading view', () => {
    props.isLoading = true;
    const component = shallow(<SetPreferences {...props} />);

    expect(component.find('LoadingButton').props().isLoading).to.be.true;
  });
});
