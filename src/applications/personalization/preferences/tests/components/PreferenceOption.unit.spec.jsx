import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import PreferenceOption from '../../components/PreferenceOption';
import { benefitChoices } from '../../helpers';

const onChange = spy();

const props = {
  item: benefitChoices[0],
  onChange,
  checked: true,
};

describe('<PreferenceOption>', () => {
  it('should render', () => {
    const component = shallow(<PreferenceOption {...props} />);
    expect(component.html()).to.contain('Health care');
    expect(component.html()).to.contain('Get health care coverage.');
    component.unmount();
  });
});
