import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { ConnectedAcctApp } from '../../containers/ConnectedAcctApp';

describe('<ConnectedAcctApp>', () => {
  it('should render loading indicator while loading', () => {
    const tree = SkinDeep.shallowRender(<ConnectedAcctApp loading />);
    expect(tree.subTree('LoadingIndicator')).to.not.be.false;
  });
  it('should render nothing found indicator if accounts is empty', () => {
    const tree = SkinDeep.shallowRender(
      <ConnectedAcctApp loading={false} accounts={[]} />,
    );
    expect(tree.subTree('NoConnectedApps')).to.not.be.false;
  });
  it('should render loading indicator while loading', () => {
    const tree = SkinDeep.shallowRender(
      <ConnectedAcctApp loading={false} accounts={[{ id: 'fake-id' }]} />,
    );
    expect(tree.subTree('ConnectedApps')).to.not.be.false;
  });
});
