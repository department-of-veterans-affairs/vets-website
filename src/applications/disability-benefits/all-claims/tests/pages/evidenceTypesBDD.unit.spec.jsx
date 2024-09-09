import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import formConfig from '../../config/form';

describe('evidenceTypes', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypesBDD;

  it('should render', () => {
    render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option').length).to.equal(2);
  });

  it('should submit when no evidence selected', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  /* TODO: Fix with https://github.com/department-of-veterans-affairs/va.gov-team/issues/58050 */
  it.skip('should require at least one evidence type when evidence selected', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.false;
    expect($('va-radio').error).to.eq('Please provide a response');
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasPrivateMedicalRecords': true,
            },
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = getByText('Submit');
    userEvent.click(submitButton);
    expect(onSubmit.calledOnce).to.be.true;
    expect($('va-radio').error).to.be.null;
  });

  it('should display alert when BDD SHA enabled and user selects no, submit info later', () => {
    const fakeStore = createStore(() => ({
      featureToggles: {},
    }));

    const { getByText, container } = render(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'N' },
    });

    expect(
      getByText(
        'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
      ),
    ).to.exist;
  });
});
