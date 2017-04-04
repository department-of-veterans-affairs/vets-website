import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import FormApp from '../../../src/js/common/schemaform/FormApp';

describe('Schemaform <FormApp>', () => {
  it('should render children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should render nav and children', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'test'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });
  it('should render form title', () => {
    const formConfig = {
      title: 'Testing'
    };
    const currentLocation = {
      pathname: 'test'
    };

    const tree = SkinDeep.shallowRender(
      <FormApp
          formConfig={formConfig}
          currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('FormTitle')).not.to.be.empty;
  });
});
