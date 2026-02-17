import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
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

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('va-radio').length).to.equal(1);
    expect(form.find('va-radio-option').length).to.equal(3);
    form.unmount();
  });

  it('should submit when user not homeless or at risk', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.calledOnce).to.be.true;
    });
    form.unmount();
  });

  it('should require living situation, needToLeave, and contact name / number when homeless', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');

      const errorMessages = form.find(ERR_MSG_CSS_CLASS).length;
      const vaRadioErrors = form.find('va-radio[error]').length;
      const totalErrors = errorMessages + vaRadioErrors;

      expect(totalErrors).to.be.at.least(3);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should require living situation and contact name / number when at risk', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');

      const errorMessages = form.find(ERR_MSG_CSS_CLASS).length;
      const vaRadioErrors = form.find('va-radio[error]').length;
      const totalErrors = errorMessages + vaRadioErrors;

      expect(totalErrors).to.be.at.least(2);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it("should require homeless housing input when 'other' selected", async () => {
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
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it("should require at risk housing input when 'other' option selected", async () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          homelessOrAtRisk: HOMELESSNESS_TYPES.atRisk,
          'view:isAtRisk': {
            atRiskHousingSituation: AT_RISK_HOUSING_TYPES.other,
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
    await waitFor(() => {
      form.find('form').simulate('submit');

      const errorMessages = form.find(ERR_MSG_CSS_CLASS).length;
      const vaRadioErrors = form.find('va-radio[error]').length;
      const totalErrors = errorMessages + vaRadioErrors;

      expect(totalErrors).to.be.at.least(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should submit when all fields filled', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.calledOnce).to.be.true;
    });
    form.unmount();
  });
});
