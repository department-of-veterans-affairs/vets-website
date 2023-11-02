import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

const {
  schema,
  uiSchema,
} = formConfig.chapters.applicantInformation.pages.applicantInformation;

describe('pension applicant information page', () => {
  it('should render with all fields and buttons', () => {
    const { container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('input', container).length).to.equal(5);
    expect($$('select', container).length).to.equal(3);
    expect($$('va-radio', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });
  it('should not allow submit with errors', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));
    expect($$('.usa-input-error', container).length).to.equal(4);
    expect(onSubmit.called).to.be.false;
  });
  it('should reveal va file number', async () => {
    const { container } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Verify va file number is not visible
    expect($$('input', container).length).to.equal(5);

    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'Y' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);

    waitFor(() => {
      expect($$('va-radio-option', container).length).to.eq(2);
      // Verify va file number is now visible
      expect($$('input', container).length).to.equal(6);
    });
  });
});
