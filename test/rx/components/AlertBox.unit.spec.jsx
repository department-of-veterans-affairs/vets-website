import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AlertBox from '../../../src/js/common/components/AlertBox.jsx';

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
    expect(tree.toString()).to.equal('<div></div>');
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(
      <AlertBox
          content={Content}
          status={'info'}
          isVisible/>
    );
    expect(tree.props.className).to.equal('va-alert usa-alert usa-alert-info');
  });
});
