import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HasEvidenceLabel } from '../../content/evidenceTypesBDD';
import formConfig from '../../config/form';

describe('evidenceTypes', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.evidenceTypesBDD;

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

  /* TODO: Fix with https://github.com/department-of-veterans-affairs/va.gov-team/issues/58050 */
  it.skip('should require at least one evidence type when evidence selected', () => {
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
    const screen = render(<HasEvidenceLabel />);

    screen.getByText(
      'Do you want to upload any other documents or evidence at this time?',
    );
  });

  it('should display alert when BDD SHA enabled and user selects no, submit info later', () => {
    const fakeStore = createStore(() => ({
      featureToggles: {},
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
