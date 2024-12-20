import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import Sinon from 'sinon';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as consentPage from '../../../pages/form0781/consentPage';
import { consentPageTitle } from '../../../content/form0781/consentPage';

describe('Form 0781 consent page', () => {
  const { schema, uiSchema } = consentPage;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.an('object');
  });

  it('Displays a radio button selection of choices on filling out 0781', () => {
    const onSubmit = Sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    getByText(consentPageTitle);

    // Expect one question with four radio inputs
    expect($$('va-radio').length).to.equal(1);
    expect($$('va-radio-option').length).to.equal(4);

    expect(container.querySelector(`va-radio-option[label="Yes"]`, container))
      .to.exist;
    expect(container.querySelector(`va-radio-option[label="No"]`, container)).to
      .exist;
    expect(
      container.querySelector(
        `va-radio-option[label="I gave permission in the past, but I want to revoke (or cancel) my permission."]`,
        container,
      ),
    ).to.exist;
    expect(
      container.querySelector(
        `va-radio-option[label="I'm not enrolled or registered in VA health care."]`,
        container,
      ),
    ).to.exist;
  });
});
