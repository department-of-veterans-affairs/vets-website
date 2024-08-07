import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import NeedFilesFromYou from '../../components/NeedFilesFromYou';

describe('<NeedFilesFromYou>', () => {
  it('should render single file needed', () => {
    const tree = SkinDeep.shallowRender(<NeedFilesFromYou files={1} />);

    expect(tree.text()).to.contain('item needs');
    expect(tree.subTree('Link').props.to).to.equal('../files');
  });

  it('should render multiple files needed', () => {
    const tree = SkinDeep.shallowRender(<NeedFilesFromYou files={2} />);

    expect(tree.text()).to.contain('items need');
  });
});
