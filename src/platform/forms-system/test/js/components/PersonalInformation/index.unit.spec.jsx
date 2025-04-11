import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import {
  personalInformationPage,
  defaultPageConfig,
} from '../../../../src/js/components/PersonalInformation/index';
import * as PersonalInformationModule from '../../../../src/js/components/PersonalInformation/PersonalInformation';

const args = {
  title: 'Test Title',
  path: '/test-path',
  personalInfoConfig: {},
  dataAdapter: { ssn: 'veteran.ssn' },
};

describe('personalInformationPage', () => {
  let PersonalInformationStub;

  beforeEach(() => {
    // Create a stub for PersonalInformation component
    PersonalInformationStub = sinon
      .stub(PersonalInformationModule, 'PersonalInformation')
      .callsFake(props => (
        <div data-testid="personal-information">
          Mocked PersonalInformation Component
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </div>
      ));
  });

  afterEach(() => {
    PersonalInformationStub.restore();
  });

  it('should return an object with the correct keys', () => {
    // a basic test to make sure the forms-system required keys are present
    const result = personalInformationPage(args);

    expect(result).to.be.an('object');
    expect(result).to.have.property('personalInfoPage');
    expect(result.personalInfoPage).to.have.all.keys([
      'title',
      'path',
      'uiSchema',
      'schema',
      'CustomPage',
      'CustomPageReview',
      'depends',
      'hideOnReview',
    ]);
  });

  it('should use the default values when called without a config object as an argument', () => {
    const result = personalInformationPage();

    expect(result.personalInfoPage.title).to.equal(defaultPageConfig.title);
    expect(result.personalInfoPage.path).to.equal(defaultPageConfig.path);
  });

  it('should pass through title and path correctly', () => {
    const result = personalInformationPage(args);

    expect(result.personalInfoPage.title).to.equal(args.title);
    expect(result.personalInfoPage.path).to.equal(args.path);
  });

  it('should return the correct config when passed a partial initial config object', () => {
    const result = personalInformationPage({
      title: args.title,
      path: args.path,
    });

    expect(result.personalInfoPage.title).to.equal(args.title);
    expect(result.personalInfoPage.path).to.equal(args.path);

    const resultWithoutTitleAndPath = personalInformationPage({
      personalInfoConfig: args.personalInfoConfig,
      dataAdapter: args.dataAdapter,
    });

    expect(resultWithoutTitleAndPath.personalInfoPage.title).to.equal(
      defaultPageConfig.title,
    );
    expect(resultWithoutTitleAndPath.personalInfoPage.path).to.equal(
      defaultPageConfig.path,
    );
  });

  it('should have correct schema and uiSchema structure', () => {
    const result = personalInformationPage(args);

    expect(result.personalInfoPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
    expect(result.personalInfoPage.uiSchema).to.deep.equal({});
  });

  it('should set correct review page related properties', () => {
    const result = personalInformationPage(args);

    expect(result.personalInfoPage.CustomPageReview).to.be.null;

    // not sure if we need this, but its in the config so we should test it
    expect(result.personalInfoPage.hideOnReview).to.be.true;
  });

  describe('CustomPage component', () => {
    it('should render CustomPage with correct props, and default personalInfoConfig', () => {
      const result = personalInformationPage(args);
      const testProps = {
        someTestProp: 'test value',
      };

      render(result.personalInfoPage.CustomPage(testProps));

      // Verify that PersonalInformation was called with the correct props
      // including the testProps, config, and dataAdapter
      expect(PersonalInformationStub.calledOnce).to.be.true;
      const callProps = PersonalInformationStub.firstCall.args[0];

      expect(callProps).to.include(testProps);
      expect(callProps.config).to.deep.equal(
        PersonalInformationModule.defaultConfig,
      );
      expect(callProps.dataAdapter).to.deep.equal(args.dataAdapter);
    });

    it('should work with default values when optional props are not provided', () => {
      const result = personalInformationPage({
        title: args.title,
        path: args.path,
      });

      render(result.personalInfoPage.CustomPage({}));

      expect(PersonalInformationStub.calledOnce).to.be.true;
      const callProps = PersonalInformationStub.firstCall.args[0];

      // because the personalInformationPage function is called
      // without personalInfoConfig and dataAdapter properties,
      // the config and dataAdapter should be empty objects
      expect(callProps.config).to.deep.equal(
        PersonalInformationModule.defaultConfig,
      );
      expect(callProps.dataAdapter).to.deep.equal({});
    });
  });
});
