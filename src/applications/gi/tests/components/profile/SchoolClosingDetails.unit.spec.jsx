import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SchoolClosingDetails from '../../../components/profile/SchoolClosingDetails';

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

  // it('displays school website message if no schoolWebsite', () => {
  //   const wrapper = shallow(<SchoolClosingDetails schoolClosing />);

  //   expect(wrapper.text()).to.include('This school has closed.');
  //   expect(wrapper.text()).to.include(
  //     "Visit the school's website to learn more.",
  //   );

  //   wrapper.unmount();
  // });
  it('tracks link click', () => {
    const schoolWebsite = 'https://va.gov';

    const wrapper = mount(
      <SchoolClosingDetails schoolClosing schoolWebsite={schoolWebsite} />,
    );

    wrapper
      .find('a')
      .at(0)
      .simulate('click');

    expect(global.window.dataLayer[0].alertBoxHeading).to.eq(
      'School has closed',
    );

    wrapper.unmount();
  });
});
