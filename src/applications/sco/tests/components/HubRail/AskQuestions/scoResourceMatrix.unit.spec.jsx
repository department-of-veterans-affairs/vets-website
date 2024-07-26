import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ScoResourceMatrix from '../../../../components/HubRail/AskQuestions/scoResourceMatrix';

describe('ScoResourceMatrix', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ScoResourceMatrix />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
