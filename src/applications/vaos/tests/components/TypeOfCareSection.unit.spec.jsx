import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TypeOfCareSection from '../../components/review/TypeOfCareSection';

describe('VAOS <TypeOfCareSection>', () => {
  it('should render heading', () => {
    const data = { facilityType: 'communityCare' };
    const tree = shallow(<TypeOfCareSection data={data} />);

    expect(tree.find('h2').text()).to.equal('Community care appointment');

    tree.unmount();
  });

  it('should render heading', () => {
    const data = { facilityType: 'garbage' };
    const tree = shallow(<TypeOfCareSection data={data} />);

    expect(tree.find('h2').text()).to.equal('VA appointment');

    tree.unmount();
  });
});
