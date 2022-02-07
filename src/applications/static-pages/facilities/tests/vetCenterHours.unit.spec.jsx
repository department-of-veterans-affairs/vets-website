import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VetCenterHours from '../vetCentersHours';

describe('<VetCenterHours>', () => {
  const hoursTestData = [
    { day: 0, starthours: 700, endhours: 1730, comment: '' },
    { day: 1, starthours: 700, endhours: 1730, comment: '' },
    { day: 2, starthours: 700, endhours: 1730, comment: '' },
    { day: 3, starthours: 700, endhours: 1730, comment: '' },
    { day: 4, starthours: 700, endhours: 1630, comment: '' },
    { day: 5, starthours: -1, endhours: -1, comment: 'Closed' },
    { day: 6, starthours: -1, endhours: -1, comment: 'Closed' },
  ];

  const hoursTestDataSomeNull = [
    { day: 0, starthours: 700, endhours: 1730, comment: '' },
    { day: 1, starthours: 700, endhours: 1730, comment: '' },
    { day: 2, starthours: 700, endhours: 1730, comment: '' },
    { day: 3, starthours: 700, endhours: 1730, comment: '' },
    { day: 4, starthours: 700, endhours: 1630, comment: '' },
    { day: 5, starthours: null, endhours: null, comment: 'Closed' },
    { day: 6, starthours: null, endhours: null, comment: 'Closed' },
  ];

  it('should not render hours section', () => {
    const wrapper = shallow(<VetCenterHours hours={[]} />);
    expect(wrapper.find('VetCenterHours')).to.be.empty;
    wrapper.unmount();
  });

  it('should render hours section', () => {
    const wrapper = shallow(<VetCenterHours hours={hoursTestData} />);
    expect(wrapper.type()).to.not.equal(null);
    const heading = wrapper.find('h4');
    expect(heading.text()).to.contain('Hours');
    wrapper.unmount();
  });

  it('should render hours with null values', () => {
    const wrapper = shallow(<VetCenterHours hours={hoursTestDataSomeNull} />);
    expect(wrapper.type()).to.not.equal(null);
    const heading = wrapper.find('h4');
    expect(heading.text()).to.contain('Hours');
    wrapper.unmount();
  });
});
