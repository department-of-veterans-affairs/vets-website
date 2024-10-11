import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgramApprovalInformation from '../../../../components/MainContent/Update/ProgramApprovalInformation';

describe('ProgramApprovalInformation', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ProgramApprovalInformation />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
