import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import MessageProviderLink from '../../components/MessageProviderLink';

describe('<MessageProviderLink>', () => {
  test('should render', () => {
    const tree = SkinDeep.shallowRender(<MessageProviderLink/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  test('should have the expected className', () => {
    const tree = SkinDeep.shallowRender(<MessageProviderLink/>);

    expect(tree.props.className).to.equal('usa-button rx-message-provider-link');
  });
});
