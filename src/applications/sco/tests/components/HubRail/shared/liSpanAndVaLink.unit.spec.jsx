import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiSpanAndVaLink from '../../../../components/HubRail/shared/liSpanAndVaLink';

describe('LiSpanAndVaLink', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <LiSpanAndVaLink href="https://demo.com/" hrefText="Sample Text" />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
