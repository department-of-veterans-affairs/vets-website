import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../config/form';

describe('Chapter 36 Claimant Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInformation.pages.claimantInformation;

  const formData = {
    status: 'isSpouse',
  };
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should not submit without required fields', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(4);
    });

    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required fields', async () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    // Fill required fields
    const firstNameInput = container.querySelector('input#root_fullName_first');
    fireEvent.change(firstNameInput, { target: { value: 'Johnny' } });

    const lastNameInput = container.querySelector('input#root_fullName_last');
    fireEvent.change(lastNameInput, { target: { value: 'Appleseed' } });

    const ssnInput = container.querySelector('input#root_ssn');
    fireEvent.change(ssnInput, { target: { value: '370947141' } });

    const monthSelect = container.querySelector('#root_dateOfBirthMonth');
    fireEvent.change(monthSelect, { target: { value: '1' } });

    const daySelect = container.querySelector('#root_dateOfBirthDay');
    fireEvent.change(daySelect, { target: { value: '1' } });

    const yearInput = container.querySelector('input#root_dateOfBirthYear');
    fireEvent.change(yearInput, { target: { value: '1981' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
