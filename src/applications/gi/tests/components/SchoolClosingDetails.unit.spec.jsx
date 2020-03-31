import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SchoolClosingDetails from '../../components/profile/SchoolClosingDetails';

describe('<SchoolClosingDetails>', () => {
  it('renders', () => {
    const wrapper = shallow(<SchoolClosingDetails />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('displays closing warning', () => {
    const tomorrow = moment()
      .add(1, 'days')
      .format('YYYY-MM-DD');

    const wrapper = shallow(
      <SchoolClosingDetails schoolClosing schoolClosingOn={tomorrow} />,
    );
    const html = wrapper.html();
    expect(html).to.contain('School will be closing soon');
    expect(html.toLowerCase()).to.not.contain('closed');
    wrapper.unmount();
  });

  it('displays closed warning', () => {
    const yesterday = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD');

    const wrapper = shallow(
      <SchoolClosingDetails schoolClosing schoolClosingOn={yesterday} />,
    );
    const html = wrapper.html();
    expect(html).to.contain('School has closed');
    expect(html.toLowerCase()).to.not.contain('closing');
    wrapper.unmount();
  });

  it('displays school website', () => {
    const schoolWebsite = 'https://va.gov';

    const wrapper = shallow(
      <SchoolClosingDetails schoolClosing schoolWebsite={schoolWebsite} />,
    );
    expect(wrapper.html()).to.contain(schoolWebsite);
    wrapper.unmount();
  });
});
