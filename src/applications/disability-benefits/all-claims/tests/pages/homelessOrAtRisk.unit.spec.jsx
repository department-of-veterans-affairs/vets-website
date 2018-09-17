import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Federal orders info', () => {
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
          homelessOrAtRisk: 'homeless'
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
          homelessOrAtRisk: 'atRisk'
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should require housing input when other housing option selected', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: 'homeless',
          'view:isHomeless': {
            homelessHousingSituation: 'Other',
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
          homelessOrAtRisk: 'atRisk',
          'view:isAtRisk': {
            atRiskHousingSituation: 'I’m losing my housing in 30 days.'
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
          homelessOrAtRisk: 'atRisk',
          'view:isAtRisk': {
            atRiskHousingSituation: 'I’m losing my housing in 30 days.'
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
          homelessOrAtRisk: 'homeless',
          'view:isHomeless': {
            homelessHousingSituation: 'Other',
            otherHomelessHousing: 'An airplane',
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
