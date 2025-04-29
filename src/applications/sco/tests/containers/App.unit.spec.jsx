import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import App from '../../containers/App';

describe('App', () => {
  it('renders without crashing', () => {
    const tree = shallow(<App />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
