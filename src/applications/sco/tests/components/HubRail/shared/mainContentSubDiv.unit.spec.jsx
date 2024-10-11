import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MainContentSubDiv from '../../../../components/HubRail/shared/mainContentSubDiv';

describe('MainContentSubDiv', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <MainContentSubDiv id="sample id" header="Sample Header" />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
