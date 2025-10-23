import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CallUs from '../../../../components/HubRail/AskQuestions/callUs';

describe('CallUs', () => {
  it('renders without crashing', () => {
    const tree = shallow(<CallUs />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
