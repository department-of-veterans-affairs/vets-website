import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
<<<<<<< HEAD

import formConfig from '../../config/form';
=======
import {
  phoneSchema,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import formConfig from '../../config/form';
import { baseUiSchemaErrors } from '../../pages/pointOfContact';
>>>>>>> main

describe('Supplemental Claims point of contact page', () => {
  const { schema, uiSchema } = formConfig.chapters.infoPages.pages.contact;

  // Custom page is rendered, so this only renders a submit button
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Not required
    expect($$('va-text-input[required="false"]', container).length).to.eq(2);
<<<<<<< HEAD

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should show error and block submission if phone is invalid', () => {
=======
    expect($$('va-checkbox', container).length).to.eq(1);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should show error and block submission if US phone is invalid', () => {
>>>>>>> main
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{ pointOfContactName: '', pointOfContactPhone: '123' }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = $('button[type="submit"]', container);
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);

    const [nameInput, phoneInput] = $$('va-text-input', container);

    waitFor(() => {
      expect(nameInput.getAttribute('error')).to.be.null;
      expect(phoneInput.getAttribute('error')).to.contain(
        'enter a 10-digit phone number',
      );
      expect(onSubmit.called).to.be.false;
    });
  });

<<<<<<< HEAD
  it('should allow submit if a valid phone number is entered', () => {
=======
  it('should show error and block submission if international phone is invalid', () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{
          pointOfContactName: '',
          pointOfContactHasInternationalPhone: true,
          pointOfContactPhone: '123',
        }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = $('button[type="submit"]', container);
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);

    const [nameInput, phoneInput] = $$('va-text-input', container);

    waitFor(() => {
      expect(nameInput.getAttribute('error')).to.be.null;
      expect(phoneInput.getAttribute('error')).to.contain(
        'up to a 15-digit phone number',
      );
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should allow submit if a valid US phone number is entered', () => {
>>>>>>> main
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{
          pointOfContactName: 'Fred',
          pointOfContactPhone: '8005551212',
        }}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    const [nameInput, phoneInput] = $$('va-text-input', container);

    waitFor(() => {
      expect(nameInput.getAttribute('error')).to.be.null;
      expect(phoneInput.getAttribute('error')).to.eq('');
      expect(onSubmit.called).to.be.true;
    });
  });
<<<<<<< HEAD
=======

  it('should allow submit if a valid international phone number is entered', () => {
    const onSubmit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{
          pointOfContactName: 'Fred',
          pointOfContactHasInternationalPhone: true,
          pointOfContactPhone: '44-8005551212',
        }}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    const [nameInput, phoneInput] = $$('va-text-input', container);

    waitFor(() => {
      expect(nameInput.getAttribute('error')).to.be.null;
      expect(phoneInput.getAttribute('error')).to.eq('');
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should call updateUiSchema and updateSchema and return international phone patterns when checkbox is true', () => {
    const _ = {};
    const options = uiSchema.pointOfContactPhone['ui:options'];
    const data = { pointOfContactHasInternationalPhone: true };
    expect(options.updateUiSchema(_, data)).to.deep.equal({
      'ui:errorMessages': baseUiSchemaErrors.international,
    });
    expect(options.updateSchema(_, _, _, 0, '', data)).to.deep.equal(
      internationalPhoneSchema,
    );
  });

  it('should call updateUiSchema and updateSchema and return US phone patterns when checkbox is false', () => {
    const _ = {};
    const options = uiSchema.pointOfContactPhone['ui:options'];
    const data = { pointOfContactHasInternationalPhone: false };
    expect(options.updateUiSchema(_, data)).to.deep.equal({
      'ui:errorMessages': baseUiSchemaErrors.phone,
    });
    expect(options.updateUiSchema()).to.deep.equal({
      'ui:errorMessages': baseUiSchemaErrors.phone,
    });
    expect(options.updateSchema()).to.deep.equal(phoneSchema);
    expect(options.updateSchema(_, _, _, 0, '', data)).to.deep.equal(
      phoneSchema,
    );
  });
>>>>>>> main
});
