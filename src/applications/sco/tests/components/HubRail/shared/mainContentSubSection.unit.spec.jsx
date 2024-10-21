import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MainContentSubSection from '../../../../components/HubRail/shared/mainContentSubSection';

describe('MainContentSubSection', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <MainContentSubSection id="Sample Id" header="Sample Header Title" />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
