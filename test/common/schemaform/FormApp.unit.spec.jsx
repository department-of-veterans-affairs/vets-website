import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import FormApp from '../../../src/js/common/schemaform/FormApp';

describe('Schemaform <FormApp>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <FormApp currentLocation={{ pathname: 'testing' }}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).to.not.be.empty;
    expect(tree.subTree('.js-test-location').props['data-location']).to.equal('testing');
  });
});
