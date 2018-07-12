import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { SinglePageFormApp } from '../../../0993/containers/SinglePageFormApp';

describe('Schemaform <SinglePageFormApp>', () => {
  it('should render children on confirmation page, but not form title', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'confirmation',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <SinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </SinglePageFormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should show nav when the form is in progress', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: '/claimant-information',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <SinglePageFormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </SinglePageFormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });
});
