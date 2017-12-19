import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { FormApp } from '../../../../src/js/common/schemaform/containers/FormApp';

describe('Schemaform <FormApp>', () => {
  it('should render children on intro page, but not form title or nav', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should not render form title or nav on intro page when disableSave is true', () => {
    const formConfig = {
      disableSave: true
    };
    const currentLocation = {
      pathname: 'introduction',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should not render form title and nav when save is enabled', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
  });
  it('should render form title and nav when save is disabled', () => {
    const formConfig = {
      title: 'Testing',
      disableSave: true
    };
    const currentLocation = {
      pathname: 'test',
      search: ''
    };
    const routes = [{
      pageList: [{ path: currentLocation.pathname }]
    }];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}>
        <div className="child"/>
      </FormApp>
    );

    expect(tree.everySubTree('FormTitle')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });
});
