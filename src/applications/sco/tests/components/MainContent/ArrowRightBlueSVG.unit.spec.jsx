import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ArrowRightBlueSVG from '../../../components/MainContent/ArrowRightBlueSVG';

describe('ArrowRightBlueSVG', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ArrowRightBlueSVG />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
