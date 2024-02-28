import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { FormApp } from '../../../src/js/containers/FormApp';
import PageNotFound from '../../../../site-wide/user-nav/components/PageNotFound';

describe('Schemaform <FormApp>', () => {
  it('should render children on intro page, but not form title or nav', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: 'introduction',
      search: '',
    };
    const routes = [
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
      >
        <div className="child" />
      </FormApp>,
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
  });
  it('should show nav when the form is in progress', () => {
    const formConfig = {};
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const routes = [
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
      >
        <div className="child" />
      </FormApp>,
    );

    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormNav')).not.to.be.empty;
  });
  it('should show dynamic title', () => {
    const titles = ['Main title', 'Alternate title'];
    const formData = { test: false };
    const formConfig = {
      title: props => titles[props.formData.test ? 1 : 0],
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const routes = [
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        formData={formData}
        routes={routes}
        currentLocation={currentLocation}
      >
        <div className="child" />
      </FormApp>,
    );

    expect(tree.everySubTree('FormTitle')[0].props.title).to.equal(titles[0]);
    formData.test = true;
    tree.reRender({ formData, currentLocation, formConfig });
    expect(tree.everySubTree('FormTitle')[0].props.title).to.equal(titles[1]);
  });

  it('should hide title, nav and layout classes when formOptions are set', () => {
    const formConfig = {
      formOptions: { noTitle: true, noTopNav: true, fullWidth: true },
    };
    const currentLocation = {
      pathname: '/veteran-information/personal-information',
      search: '',
    };
    const routes = [
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
      >
        <div className="child" />
      </FormApp>,
    );
    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
    expect(tree.everySubTree('.row')).to.be.empty;
    expect(tree.everySubTree('.usa-width-two-thirds')).to.be.empty;
  });

  it('should hide title, nav and layout classes when a PageNotFound is shown', () => {
    const formConfig = {
      title: 'Main title',
    };
    const currentLocation = {
      pathname: '/veteran-information/dummy',
      search: '',
    };
    const routes = [
      {
        pageList: [{ path: currentLocation.pathname }],
      },
    ];

    const tree = SkinDeep.shallowRender(
      <FormApp
        formConfig={formConfig}
        routes={routes}
        currentLocation={currentLocation}
      >
        <PageNotFound className="child" />
      </FormApp>,
    );
    expect(tree.everySubTree('.child')).not.to.be.empty;
    expect(tree.everySubTree('FormTitle')).to.be.empty;
    // row is used by the child and footer, so when no footer then = 1
    expect(tree.everySubTree('.row')).to.have.lengthOf(1);
    expect(tree.everySubTree('.usa-width-two-thirds')).to.be.empty;
  });
});
