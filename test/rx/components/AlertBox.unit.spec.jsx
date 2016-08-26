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
      <AlertBox status={'info'}/>
    );
    expect(tree.props.className).to.equal('rx-alert usa-alert usa-alert-info');
  });

  // TODO: async assertion / promises?
  it('should call onCloseAlert when the close button is clicked', () => {
    const tree = SkinDeep.shallowRender(
      <AlertBox onCloseAlert={() => { /* assert something */ }}/>
    );

    tree.props.onCloseAlert();

    expect(tree.toString()).to.equal('<div></div>');
  });
});
