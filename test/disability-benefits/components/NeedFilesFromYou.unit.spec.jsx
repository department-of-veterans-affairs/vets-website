import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import NeedFilesFromYou from '../../../src/js/disability-benefits/components/NeedFilesFromYou';

describe('<NeedFilesFromYou>', () => {
  it('should render single file needed', () => {
    const tree = SkinDeep.shallowRender(
      <NeedFilesFromYou
          events={[{ type: 'still_need_from_you_list' }]}
          claimId={2}/>
    );

    expect(tree.text()).to.contain('item needs');
    expect(tree.subTree('Link').props.to).to.equal('your-claims/2/files');
  });
  it('should render count based on only need from you files', () => {
    const tree = SkinDeep.shallowRender(
      <NeedFilesFromYou
          events={[
            { type: 'still_need_from_others_list' },
            { type: 'still_need_from_you_list' }
          ]}
          claimId={2}/>
    );

    expect(tree.text()).to.contain('item needs');
    expect(tree.subTree('Link').props.to).to.equal('your-claims/2/files');
  });
  it('should render multiple files needed', () => {
    const events = Array(2).fill({
      type: 'still_need_from_you_list'
    });
    const tree = SkinDeep.shallowRender(
      <NeedFilesFromYou
          events={events}
          claimId={2}/>
    );

    expect(tree.text()).to.contain('items need');
  });
});

