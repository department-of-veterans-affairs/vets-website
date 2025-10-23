import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SchoolCertifyingOfficialHandbook from '../../../components/HubRail/SchoolCertifyingOfficialHandbook';

describe('AverageProcessingTime', () => {
  it('renders without crashing', () => {
    const tree = shallow(<SchoolCertifyingOfficialHandbook />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
