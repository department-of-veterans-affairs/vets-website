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
    expect(component.debug()).to
      .equal(`<div className="preference-item-wrapper">
  <div className="preference-item" onClick={[undefined]}>
    <div className="right">
      <Checkbox name="healthcare" checked={true} label="" onChange={[undefined]} />
    </div>
    <h5>
      Health Care
    </h5>
    <p>
      Get health care coverage.
    </p>
  </div>
</div>`);
  });
});
