import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MainContent from '../../../components/MainContent/index';

describe('MainContent', () => {
  it('renders without crashing', () => {
    const tree = shallow(<MainContent />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
