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

  describe('toursOfDutyIsActiveDutyTrue', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.militaryService.pages.toursOfDutyIsActiveDutyTrue;
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

    it('should not require "to" date in date range validation', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Army',
                dateRange: {
                  from: '2020-01-01',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should accept tour of duty with only "from" date', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Navy',
                dateRange: {
                  from: '2019-05-15',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should accept tour of duty with both "from" and "to" dates', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Air Force',
                dateRange: {
                  from: '2018-03-10',
                  to: '2022-03-10',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should require "from" date in date range validation', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Marines',
                dateRange: {
                  to: '2022-01-01',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.be.greaterThan(0);
        expect(onSubmit.called).to.be.false;
      });
    });
  });

  describe('toursOfDutyIsActiveDutyFalse', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.militaryService.pages.toursOfDutyIsActiveDutyFalse;
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

    it('should not require "to" date in date range validation', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Coast Guard',
                dateRange: {
                  from: '2021-06-01',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should accept tour of duty with only "from" date', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Space Force',
                dateRange: {
                  from: '2020-12-20',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should accept tour of duty with both "from" and "to" dates', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Army',
                dateRange: {
                  from: '2017-01-01',
                  to: '2021-01-01',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.equal(0);
        expect(onSubmit.called).to.be.true;
      });
    });

    it('should require "from" date in date range validation', async () => {
      const onSubmit = sandbox.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{
            'view:newService': true,
            toursOfDuty: [
              {
                serviceBranch: 'Navy',
                dateRange: {
                  to: '2023-05-15',
                },
              },
            ],
          }}
          uiSchema={uiSchema}
          definitions={definitions}
        />,
      );
      const formDOM = findDOMNode(form);
      submitForm(form);

      await waitFor(() => {
        const errors = formDOM.querySelectorAll('.usa-input-error');
        expect(errors.length).to.be.greaterThan(0);
        expect(onSubmit.called).to.be.false;
      });
    });
  });
});
