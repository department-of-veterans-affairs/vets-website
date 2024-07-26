import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MessageUs from '../../../../components/HubRail/AskQuestions/messageUs';

describe('MessageUs', () => {
  it('renders without crashing', () => {
    const tree = shallow(<MessageUs />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
