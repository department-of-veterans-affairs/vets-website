import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant relationship to vet', () => {
  const {
    uiSchema,
    schema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationshipToVet;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-select').length).to.equal(1);
    expect(form.find('va-additional-info').length).to.equal(1);
    form.unmount();
  });
  // Rework Test
  it('should not submit empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      const errorElements = container.querySelectorAll('.usa-input-error');
      expect(errorElements.length).to.equal(0);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={{
          application: {
            claimant: {
              relationshipToVet: 'veteran',
            },
          },
        }}
      />,
    );

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    expect(form.find('va-select').prop('error')).to.not.exist;
    form.unmount();
  });
});
