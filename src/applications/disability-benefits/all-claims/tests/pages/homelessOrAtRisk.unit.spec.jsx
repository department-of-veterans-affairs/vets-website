import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import {
  OTHER,
  HOMELESS,
  AT_RISK
} from '../../constants';

describe('Homeless or At Risk Info', () => {
  const { schema, uiSchema } = formConfig.chapters.additionalInformation.pages.homelessOrAtRisk;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}/>
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('should submit when user not homeless or at risk', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: 'No'
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should require living situation and needToLeave when homeless', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESS
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should require living situation when at risk', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: AT_RISK
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should require homeless housing input when other selected', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESS,
          'view:isHomeless': {
            homelessHousingSituation: OTHER,
            needToLeaveHousing: true
          },
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should require at risk housing input when other option selected', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: AT_RISK,
          'view:isHomeless': {
            homelessHousingSituation: OTHER,
            needToLeaveHousing: true
          },
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should require contact phone number when contact name filled out', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: AT_RISK,
          'view:isAtRisk': {
            atRiskHousingSituation: 'losingHousing'
          },
          homelessnessContact: {
            name: 'John Smith'
          }
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should require contact name when phone number filled out', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: AT_RISK,
          'view:isAtRisk': {
            atRiskHousingSituation: 'losingHousing'
          },
          homelessnessContact: {
            phoneNumber: '1234567890'
          }
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit when all fields filled', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESS,
          'view:isHomeless': {
            homelessHousingSituation: OTHER,
            otherHomelessHousing: 'No housing',
            needToLeaveHousing: true
          },
          homelessnessContact: {
            name: 'John Smith',
            phoneNumber: '1234567890'
          }
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });
});
