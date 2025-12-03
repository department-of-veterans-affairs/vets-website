import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import vaBenefits from '../../../../config/chapters/03-military-history/vaBenefits';

describe('VA Benefits Page', () => {
  const { schema, uiSchema } = vaBenefits;
  it('renders the VA benefits options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const options = $$('va-radio-option', formDOM);

    expect(form.getByRole('heading')).to.have.text('VA benefits');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Was the Veteran receiving VA compensation or pension benefits at the time of their death?',
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal('Yes');
    expect(options[1].getAttribute('label')).to.equal('No');
  });
});
