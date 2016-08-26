import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import AlertBox from '../../../src/js/rx/components/AlertBox.jsx';

describe('<AlertBox>', () => {
  it('should be an empty div if invisible', () => {
    const tree = SkinDeep.shallowRender(<AlertBox isVisible={false}/>);
    expect(tree.toString()).to.equal('<div></div>');
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(
      <AlertBox
          content="test"
          status={'info'}/>
    );
    expect(tree.props.className).to.equal('rx-alert usa-alert usa-alert-info');
  });
});
