import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';

import { $, $$ } from '../../helpers';

import formConfig from '../../config/form.js';

describe('Higher-Level Review 0996 choose contested issues', () => {
  const { schema, uiSchema } = formConfig.chapters.contestedIssues.pages[
    'view:contestedIssueFollowup'
  ];

  it('should render the individual contested issue followup page', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          contestedIssues: [
            {
              name: 'test',
              'view:selected': true,
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    expect($$('textarea', formDOM).length).to.equal(1);
    // No info alert
    expect($$('.usa-alert-info', formDOM).length).to.equal(0);
  });

  it('should allow submit with no content', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          contestedIssues: [
            {
              name: 'test',
              'view:selected': true,
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should allow submit the textarea content with no error', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          contestedIssues: [
            {
              name: 'test',
              'view:selected': true,
              additionalNote: 'Lorem ipsum dolor sit amet.',
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    submitForm(form);
    expect($('textarea', formDOM).value).to.include('ipsum dolor');
    expect($$('.usa-input-error', formDOM).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should show an error & prevent submit when the textarea content exceeds 400 characters', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        schema={schema}
        data={{
          contestedIssues: [
            {
              name: 'test',
              'view:selected': true,
              additionalNote: '',
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    formDOM.fillData(
      'textarea',
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam finibus pulvinar erat, ac luctus felis porttitor eget. Aenean luctus urna libero, tincidunt mollis ante cursus sed. Fusce a vehicula est, eget dignissim purus. Vestibulum quis placerat sapien. Vestibulum gravida libero quis lectus auctor, ut vehicula turpis maximus. Donec ultrices eu orci tincidunt elementum. Phasellus eros eros ornare. 12`,
    );
    submitForm(form);
    expect($('textarea', formDOM).value).to.include('Aenean luctus');
    expect($$('.usa-input-error', formDOM).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should expand the AdditionalInfo evidence block', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          contestedIssues: [
            {
              name: 'test',
              'view:selected': true,
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(form);
    formDOM.click('.additional-info-button');
    expect($$('.additional-info-content', formDOM).length).to.equal(1);
  });
});
