import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('First time reporting page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.expenses.pages.firstTimeReporting;
  it('renders the first time reporting options', async () => {
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(title);
    const vaRadio = $(
      'va-radio[label="Is this your first time reporting expenses?"]',
      formDOM,
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    const vaOptions = $$('va-radio-option', formDOM);
    expect(vaOptions.length).to.equal(2);
    expect(vaOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaOptions[1].getAttribute('label')).to.equal('No');
  });
});
