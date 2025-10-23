import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import OtherResources from '../../../../components/MainContent/Update/OtherResources';

describe('OtherResources', () => {
  it('renders without crashing', () => {
    const tree = shallow(<OtherResources />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
