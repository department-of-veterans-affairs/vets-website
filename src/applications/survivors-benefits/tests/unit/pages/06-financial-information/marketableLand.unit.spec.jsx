import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import marketableLand from '../../../../config/chapters/06-financial-information/incomeAndAssets/marketableLand';

describe('Marketable land page', () => {
  const { schema, uiSchema } = marketableLand;
  it('renders the marketable land page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);
    const vaAdditionalInfos = $$('va-additional-info', formDOM);
    const vaMarketableLandRadio = $(
      'va-radio[label*="Is the additional land marketable?"]',
      formDOM,
    );
    const vaAlerts = $$('va-alert-expandable', formDOM);

    expect(form.getByRole('heading')).to.have.text('Marketable land');

    expect(vaRadios.length).to.equal(1);
    expect(vaMarketableLandRadio.getAttribute('required')).to.equal('true');

    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');

    expect(vaAdditionalInfos.length).to.equal(1);
    expect(vaAlerts.length).to.equal(0);
    vaMarketableLandRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
    vaMarketableLandRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
  });
});
