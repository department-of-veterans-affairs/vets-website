import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormHelp from '../../components/FormHelp';

describe('<FormHelp>', () => {
  it('should render', () => {
    const wrapper = shallow(<FormHelp tag={React.Fragment} />);
    expect(wrapper).to.not.be.undefined;
    expect(wrapper.find('Fragment')).to.have.length(1);
    wrapper.unmount();
  });
});
