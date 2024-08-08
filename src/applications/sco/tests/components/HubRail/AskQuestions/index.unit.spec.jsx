import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AskQuestions from '../../../../components/HubRail/AskQuestions/index';

describe('AskQuestions', () => {
  it('renders without crashing', () => {
    const tree = shallow(<AskQuestions />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
