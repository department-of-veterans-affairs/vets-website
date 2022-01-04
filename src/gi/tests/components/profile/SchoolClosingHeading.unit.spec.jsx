import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SchoolClosingHeading from '../../../components/profile/SchoolClosingHeading';

describe('<SchoolClosingHeading>', () => {
  it('renders', () => {
    const wrapper = shallow(<SchoolClosingHeading />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('displays closing warning', () => {
    const tomorrow = moment()
      .add(1, 'days')
      .format('YYYY-MM-DD');

    const wrapper = shallow(
      <SchoolClosingHeading schoolClosing schoolClosingOn={tomorrow} />,
    );
    const html = wrapper.html();
    expect(html).to.contain('School closing');
    expect(html.toLowerCase()).to.not.contain('closed');
    wrapper.unmount();
  });

  it('should display closed warning', () => {
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD');

    const wrapper = shallow(
      <SchoolClosingHeading schoolClosing schoolClosingOn={yesterday} />,
    );
    const html = wrapper.html();
    expect(html).to.contain('School closed');
    expect(html.toLowerCase()).to.not.contain('closing');
    wrapper.unmount();
  });
});
