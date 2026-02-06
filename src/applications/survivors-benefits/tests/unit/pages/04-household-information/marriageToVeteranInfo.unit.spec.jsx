import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marriageToVeteranInfo from '../../../../config/chapters/04-household-information/marriageToVeteranInfo';

describe('Marriage to Veteran Info Page', () => {
  const { schema, uiSchema } = marriageToVeteranInfo;
  it('renders the marriage to veteran info page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);

    const vaRadio = $('va-radio[label="How did you get married?"]', formDOM);

    expect(vaRadios.length).to.equal(1);

    expect(vaRadio.getAttribute('required')).to.equal('true');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
  });
});
