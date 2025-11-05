import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import prisonerOfWar from '../../../../config/chapters/03-military-history/prisonerOfWar';

describe('Prisoner of War Page', () => {
  const { schema, uiSchema } = prisonerOfWar;
  it('renders the prisoner of war options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio', formDOM);
    const options = $$('va-radio-option', formDOM);

    expect(form.getByRole('heading')).to.have.text('Prisoner of war status');
    expect(vaRadio.getAttribute('label')).to.equal(
      'Was the Veteran ever a prisoner of war (POW)?',
    );
    expect(vaRadio.getAttribute('required')).to.equal('true');

    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('label')).to.equal('Yes');
    expect(options[1].getAttribute('label')).to.equal('No');
  });
});
