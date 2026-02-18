import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import incomeSources from '../../../../config/chapters/06-financial-information/incomeAndAssets/incomeSources';

describe('Income sources page', () => {
  const { schema, uiSchema } = incomeSources;
  it('renders the income sources page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);
    const vaAdditionalInfos = $$('va-additional-info', formDOM);
    const vaIncomeSourcesRadio = $(
      'va-radio[label*="Do you or your dependents have more than 4 sources of income?"]',
      formDOM,
    );
    const vaOtherIncomeRadio = $(
      'va-radio[label*="Other than Social Security, did you or your dependents receive any income last year that you no longer receive?"]',
      formDOM,
    );
    const vaAlerts = $$('va-alert-expandable', formDOM);

    expect(form.getByRole('heading')).to.have.text('Income sources');

    expect(vaRadios.length).to.equal(2);
    expect(vaIncomeSourcesRadio.getAttribute('required')).to.equal('true');
    expect(vaOtherIncomeRadio.getAttribute('required')).to.equal('true');
    expect(vaRadioOptions.length).to.equal(4);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');
    expect(vaRadioOptions[2].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[3].getAttribute('label')).to.equal('No');

    expect(vaAdditionalInfos.length).to.equal(0);
    expect(vaAlerts.length).to.equal(0);
    vaIncomeSourcesRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
    vaOtherIncomeRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(2);
  });
});
