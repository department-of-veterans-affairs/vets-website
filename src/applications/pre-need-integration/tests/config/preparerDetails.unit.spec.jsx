import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { render, fireEvent, waitFor } from '@testing-library/react';
import formConfig from '../../config/form';

describe('Pre-need preparer Details info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.preparerInformation.pages.preparerDetails;

  beforeEach(() => {
    uiSchema.application.applicant.name.first['ui:required'] = () => true;
    uiSchema.application.applicant.name.last['ui:required'] = () => true;
  });

  it('should render name input fields', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('va-text-input').length).to.equal(2);
    form.unmount();
  });

  it('should not submit empty form', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      const vaInputs = container.querySelectorAll('va-text-input');
      expect(vaInputs.length).to.equal(2);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required fields filled in', () => {
    const onSubmit = sinon.spy();

    // Directly provide the filled data
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{
          application: {
            applicant: {
              name: {
                first: 'Jane',
                last: 'Smith',
              },
            },
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');

    const vaInputs = form.find('va-text-input');
    const errors = vaInputs.filterWhere(node => node.prop('error'));
    expect(errors.length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
