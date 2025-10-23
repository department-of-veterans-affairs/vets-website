import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';
import { dicOptions } from '../../../../utils/labels';

describe('DIC Benefits Page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    title,
  } = formConfig.chapters.claimInformation.pages.dicBenefits;
  it('renders the DIC benefits options', async () => {
    const form = render(
      <DefinitionTester
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const options = $$('va-radio-option', formDOM);
    const optionKeys = Object.keys(dicOptions);

    expect(form.getByRole('heading')).to.have.text(title);
    expect(vaRadio.getAttribute('label')).to.equal(
      'What Dependency and indemnity compensation (D.I.C.) benefit are you claiming?',
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    expect(options.length).to.equal(optionKeys.length);
    optionKeys.forEach((key, index) => {
      expect(options[index].getAttribute('label')).to.equal(dicOptions[key]);
    });
  });
});
