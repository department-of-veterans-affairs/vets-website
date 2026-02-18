import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import nationalGuardService from '../../../../config/chapters/03-military-history/nationalGuardService';

describe('National Guard service page', () => {
  const { schema, uiSchema } = nationalGuardService;
  it('renders the National Guard service options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const options = $$('va-radio-option', formDOM);

    expect(form.getByRole('heading')).to.have.text('National Guard service');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Was the Veteran activated to Federal or active duty under authority of title 10, U.S.C. (National Guard)?',
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal('Yes');
    expect(options[1].getAttribute('label')).to.equal('No');
  });
});
