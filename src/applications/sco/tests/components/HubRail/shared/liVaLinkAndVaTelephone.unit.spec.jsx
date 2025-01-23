import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiVaLinkAndVaTelephone from '../../../../components/HubRail/shared/liVaLinkAndVaTelephone';

describe('LiVaLinkAndVaTelephone', () => {
  it('renders without crashing', () => {
    const tree = shallow(
      <LiVaLinkAndVaTelephone phoneNumber="111-111-1111" text="Sample Text" />,
    );
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
