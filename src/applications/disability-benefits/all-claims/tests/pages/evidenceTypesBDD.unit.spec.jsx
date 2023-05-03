import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import formConfig from '../../config/form';
import {
  EVIDENCE_LABEL,
  HasEvidenceLabel,
} from '../../content/evidenceTypesBDD';

describe('evidenceTypes', () => {
  let {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypes;

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

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit when no evidence selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
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

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    form.unmount();
  });

  it('should require at least one evidence type when evidence selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
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

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    form.unmount();
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
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

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    form.unmount();
  });

  it('should display default evidence label when BDD SHA is not enabled', () => {
    const fakeStore = createStore(() => ({
      featureToggles: {
        /* eslint-disable camelcase */
        form526_bdd_sha: false,
      },
    }));

    const screen = render(
      <Provider store={fakeStore}>
        <HasEvidenceLabel />
      </Provider>,
    );

    screen.getByText(EVIDENCE_LABEL.default);
  });

  it('should display BDD evidence label when BDD SHA enabled', () => {
    const fakeStore = createStore(() => ({
      featureToggles: {
        /* eslint-disable camelcase */
        form526_bdd_sha: true,
      },
    }));

    const screen = render(
      <Provider store={fakeStore}>
        <HasEvidenceLabel />
      </Provider>,
    );

    screen.getByText(EVIDENCE_LABEL.bddSha);
  });

  it('should display alert when BDD SHA enabled and user selects no, submit info later', () => {
    ({
      schema,
      uiSchema,
    } = formConfig.chapters.supportingEvidence.pages.evidenceTypesBDD);

    const fakeStore = createStore(() => ({
      featureToggles: {
        /* eslint-disable camelcase */
        form526_bdd_sha: true,
      },
    }));

    const screen = render(
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

    userEvent.click(
      screen.getByLabelText('No, I will submit more information later'),
    );

    screen.getByText(
      'Submit your Separation Health Assessment - Part A Self-Assessment as soon as you can',
    );
  });
});
