import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LandingPage from '../../components/LandingPage';

describe('VAOS <LandingPage>', () => {
  it('should render links to view appts and to create a new one', () => {
    const tree = shallow(<LandingPage />);

    expect(
      tree
        .find('Link')
        .at(0)
        .props().to,
    ).to.equal('new-appointment');
    expect(
      tree
        .find('Link')
        .at(1)
        .props().to,
    ).to.equal('appointments');

    tree.unmount();
  });
});
