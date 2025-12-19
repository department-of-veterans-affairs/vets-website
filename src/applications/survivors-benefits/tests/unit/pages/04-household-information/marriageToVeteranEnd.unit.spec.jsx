import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteranEnd from '../../../../config/chapters/04-household-information/marriageToVeteranEnd';

describe('Marriage to Veteran End Page', () => {
  const { schema, uiSchema } = marriageToVeteranEnd;
  it('renders the marriage to veteran end page', async () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ marriedToVeteranAtTimeOfDeath: false }}
      />,
    );
    const formDOM = getFormDOM(form);

    const vaRadios = $$('va-radio', formDOM);

    const vaRadio = $('va-radio[label="How did the marriage end?"]', formDOM);

    expect(vaRadios.length).to.equal(1);

    expect(vaRadio.getAttribute('required')).to.equal('true');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
  });
});
