import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Edu 1995 tourOfDuty', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const testDateRangeValidation = async (schema, uiSchema, definitions) => {
    // Test: "to" date is not required (only "from" date)
    const onSubmitWithFrom = sandbox.spy();
    const formWithFrom = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmitWithFrom}
        data={{
          'view:newService': true,
          toursOfDuty: [
            { serviceBranch: 'Army', dateRange: { from: '2020-01-01' } },
          ],
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    submitForm(formWithFrom);
    await waitFor(() => {
      expect(
        findDOMNode(formWithFrom).querySelectorAll('.usa-input-error').length,
      ).to.equal(0);
      expect(onSubmitWithFrom.called).to.be.true;
    });

    // Test: Both dates accepted
    const onSubmitWithBoth = sandbox.spy();
    const formWithBoth = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmitWithBoth}
        data={{
          'view:newService': true,
          toursOfDuty: [
            {
              serviceBranch: 'Navy',
              dateRange: { from: '2018-01-01', to: '2022-01-01' },
            },
          ],
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    submitForm(formWithBoth);
    await waitFor(() => {
      expect(
        findDOMNode(formWithBoth).querySelectorAll('.usa-input-error').length,
      ).to.equal(0);
      expect(onSubmitWithBoth.called).to.be.true;
    });

    // Test: "from" date is required
    const onSubmitWithoutFrom = sandbox.spy();
    const formWithoutFrom = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmitWithoutFrom}
        data={{
          'view:newService': true,
          toursOfDuty: [
            { serviceBranch: 'Marines', dateRange: { to: '2022-01-01' } },
          ],
        }}
        uiSchema={uiSchema}
        definitions={definitions}
      />,
    );
    submitForm(formWithoutFrom);
    await waitFor(() => {
      expect(
        findDOMNode(formWithoutFrom).querySelectorAll('.usa-input-error')
          .length,
      ).to.be.greaterThan(0);
      expect(onSubmitWithoutFrom.called).to.be.false;
    });
  };

  describe('toursOfDutyIsActiveDutyTrue', () => {
    const { schema, uiSchema } =
      formConfig.chapters.militaryService.pages.toursOfDutyIsActiveDutyTrue;
    const definitions = formConfig.defaultDefinitions;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          data={{ 'view:newService': true }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')).to
        .not.be.empty;
    });

    it('should validate date range with "to" date optional and "from" date required', async () => {
      await testDateRangeValidation(schema, uiSchema, definitions);
    });
  });

  describe('toursOfDutyIsActiveDutyFalse', () => {
    const { schema, uiSchema } =
      formConfig.chapters.militaryService.pages.toursOfDutyIsActiveDutyFalse;
    const definitions = formConfig.defaultDefinitions;

    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          data={{ 'view:newService': true }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input')).to
        .not.be.empty;
    });

    it('should validate date range with "to" date optional and "from" date required', async () => {
      await testDateRangeValidation(schema, uiSchema, definitions);
    });
  });
});
