import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import {
  HOMELESSNESS_TYPES,
  AT_RISK_HOUSING_TYPES,
  HOMELESS_HOUSING_TYPES,
  ERR_MSG_CSS_CLASS,
} from '../../constants';

describe('Homeless or At Risk Info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.homelessOrAtRisk;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should submit when user not homeless or at risk', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.notHomeless,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });

  it('should require living situation, needToLeave, and contact name / number when homeless', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.homeless,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should require living situation and contact name / number when at risk', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.atRisk,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it("should require homeless housing input when 'other' selected", () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.homeless,
          'view:isHomeless': {
            homelessHousingSituation: HOMELESS_HOUSING_TYPES.other,
            needToLeaveHousing: true,
          },
          homelessnessContact: {
            name: 'John Smith',
            phoneNumber: '1234567890',
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it("should require at risk housing input when 'other' option selected", () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.atRisk,
          'view:isHomeless': {
            homelessHousingSituation: AT_RISK_HOUSING_TYPES.other,
            needToLeaveHousing: true,
          },
          homelessnessContact: {
            name: 'John Smith',
            phoneNumber: '1234567890',
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when all fields filled', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.homeless,
          'view:isHomeless': {
            homelessHousingSituation: HOMELESS_HOUSING_TYPES.other,
            otherHomelessHousing: 'No housing',
            needToLeaveHousing: true,
          },
          homelessnessContact: {
            name: 'John Smith',
            phoneNumber: '1234567890',
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });
});
