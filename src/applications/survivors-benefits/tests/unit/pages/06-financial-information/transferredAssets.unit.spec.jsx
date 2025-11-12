import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import transferredAssets from '../../../../config/chapters/06-financial-information/incomeAndAssets/transferredAssets';

describe('Transferred assets page', () => {
  const { schema, uiSchema } = transferredAssets;
  it('renders the transferred assets page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    const formDOM = getFormDOM(form);
    const vaRadios = $$('va-radio', formDOM);
    const vaRadioOptions = $$('va-radio-option', formDOM);
    const vaAdditionalInfos = $$('va-additional-info', formDOM);
    const vaTransferredAssetsRadio = $(
      'va-radio[label*="Did you or your dependents transfer any assets in the last 3 calendar years?"]',
      formDOM,
    );
    const vaAlerts = $$('va-alert-expandable', formDOM);

    expect(form.getByRole('heading')).to.have.text('Transferred assets');

    expect(vaRadios.length).to.equal(1);
    expect(vaTransferredAssetsRadio.getAttribute('required')).to.equal('true');

    expect(vaRadioOptions.length).to.equal(2);
    expect(vaRadioOptions[0].getAttribute('label')).to.equal('Yes');
    expect(vaRadioOptions[1].getAttribute('label')).to.equal('No');

    expect(vaAdditionalInfos.length).to.equal(1);
    expect(vaAlerts.length).to.equal(0);
    vaTransferredAssetsRadio.__events.vaValueChange({
      detail: { value: 'Y' },
    });
    expect($$('va-alert-expandable', formDOM).length).to.equal(1);
  });
});
