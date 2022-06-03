import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { VeteranInformation } from '../../components/VeteranInformation';

describe('<VeteranInformation>', () => {
  it('should render with empty data', () => {
    const wrapper = shallow(<VeteranInformation />);
    expect(wrapper.find('.blue-bar-block').length).to.eq(1);
    wrapper.unmount();
  });
  it('should render', () => {
    const wrapper = shallow(<VeteranInformation />);
    expect(wrapper.find('.blue-bar-block').length).to.eq(1);
    wrapper.unmount();
  });

  it('should render profile data', () => {
    const data = {
      profile: {
        userFullName: {
          first: 'uno',
          middle: 'dos',
          last: 'tres',
        },
        dob: '2000-01-05',
        gender: 'F',
      },
      veteran: {
        vaFileLastFour: '8765',
        ssnLastFour: '5678',
      },
    };
    const wrapper = shallow(<VeteranInformation {...data} />);

    expect(wrapper.find('.name').text()).to.equal('uno dos tres');
    expect(wrapper.find('.ssn').text()).to.contain('5678');
    expect(wrapper.find('.vafn').text()).to.contain('8765');
    expect(wrapper.find('.dob').text()).to.contain('January 5, 2000');
    expect(wrapper.find('.gender').text()).to.contain('Female');

    wrapper.unmount();
  });
});
