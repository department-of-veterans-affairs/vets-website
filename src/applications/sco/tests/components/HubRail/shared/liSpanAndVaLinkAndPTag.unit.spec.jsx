import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiSpanAndVaLinkAndPTag from '../../../../components/HubRail/shared/liSpanAndVaLinkAndPTag';

describe('LiSpanAndVaLinkAndPTag', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <LiSpanAndVaLinkAndPTag
        href="https://demo.com/"
        hrefText="Sample Text"
        pText="Sample P text"
      />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
