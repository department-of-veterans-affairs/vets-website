import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiVaIconAndVaLink from '../../../../components/HubRail/shared/liVaIconAndVaLink';

describe('LiVaIconAndVaLink', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <LiVaIconAndVaLink
        href="https://demo.com/"
        hrefText="Sample Text"
        iconName="Sample Icon"
        text="Sample Icon"
      />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
