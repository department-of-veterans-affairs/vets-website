import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AlertBox from '../../../src/js/common/components/AlertBox';

// Placeholder for required "content" element
const Content = (<p/>);

describe('<AlertBox>', () => {
  it('should be an empty div if invisible', () => {
    const tree = SkinDeep.shallowRender(
      <AlertBox
        content={Content}
        status={'info'}
        isVisible={false}/>
    );
    expect(tree.toString()).to.equal('<div aria-live="polite" />');
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(
      <AlertBox
        content={Content}
        status={'info'}
        isVisible/>
    );
    expect(tree.props.className).to.equal('usa-alert usa-alert-info');
  });
});
