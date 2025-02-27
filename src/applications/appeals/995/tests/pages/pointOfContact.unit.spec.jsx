import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

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

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should show error and block submission if phone is invalid', () => {
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

  it('should allow submit if a valid phone number is entered', () => {
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
});
