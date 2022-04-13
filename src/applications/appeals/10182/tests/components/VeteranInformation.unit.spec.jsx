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
    const text = wrapper.find('.blue-bar-block').text();

    expect(text).to.contain('uno dos tres');
    expect(text).to.contain('Security number: ●●●–●●–5678ending with 5 6 7 8');
    expect(text).to.contain('VA file number: ●●●–●●–8765ending with 8 7 6 5');

    expect(text).to.contain('Date of birth: January 5, 2000');
    expect(text).to.contain('Gender: Female');

    wrapper.unmount();
  });
});
