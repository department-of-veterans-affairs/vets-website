import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiVaLink from '../../../../components/HubRail/shared/liVaLink';

describe('liVaLink', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <LiVaLink href="https://demo.com/" text="Sample text" />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
