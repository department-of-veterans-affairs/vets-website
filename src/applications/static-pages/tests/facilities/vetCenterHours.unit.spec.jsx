import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VetCenterHours from '../../facilities/vetCentersHours';

describe('<VetCenterHours>', () => {
  const hoursTestData = [
    { day: 0, starthours: -1, endhours: -1, comment: 'Closed' },
    { day: 1, starthours: 700, endhours: 1730, comment: '' },
    { day: 2, starthours: 700, endhours: 1730, comment: '' },
    { day: 3, starthours: 700, endhours: 1730, comment: '' },
    { day: 4, starthours: 700, endhours: 1730, comment: '' },
    { day: 5, starthours: 700, endhours: 1630, comment: '' },
    { day: 6, starthours: -1, endhours: -1, comment: 'Closed' },
  ];

  it('should not render hours section', () => {
    const wrapper = shallow(<VetCenterHours hours={[]} />);
    expect(wrapper.find('VetCenterHours')).to.be.empty;
    wrapper.unmount();
  });

  it('should render hours section', () => {
    const wrapper = shallow(<VetCenterHours hours={hoursTestData} />);
    expect(wrapper.type()).to.not.equal(null);
    const heading = wrapper.find('h3');
    expect(heading.text()).to.contain('Hours');
    wrapper.unmount();
  });
});
