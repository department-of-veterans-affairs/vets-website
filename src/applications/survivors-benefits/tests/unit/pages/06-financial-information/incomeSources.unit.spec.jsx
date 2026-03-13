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

  describe('incomeAssetStatementFormAlert hideIf (is2025Enabled = true)', () => {
    const { hideIf } = uiSchema.incomeAssetStatementFormAlert['ui:options'];

    it('hides alert when moreThanFourIncomeSources is ONE_TO_FOUR_SOURCES', () => {
      expect(
        hideIf({
          survivorsBenefitsForm2025VersionEnabled: true,
          moreThanFourIncomeSources: 'ONE_TO_FOUR_SOURCES',
        }),
      ).to.be.true;
    });

    it('shows alert when moreThanFourIncomeSources is MORE_THAN_FIVE_SOURCES', () => {
      expect(
        hideIf({
          survivorsBenefitsForm2025VersionEnabled: true,
          moreThanFourIncomeSources: 'MORE_THAN_FIVE_SOURCES',
        }),
      ).to.be.false;
    });

    it('hides alert when moreThanFourIncomeSources is unset', () => {
      expect(hideIf({ survivorsBenefitsForm2025VersionEnabled: true })).to.be
        .true;
    });
  });

  describe('incomeAssetStatementFormAlert hideIf (is2025Enabled = false)', () => {
    const { hideIf } = uiSchema.incomeAssetStatementFormAlert['ui:options'];

    it('shows alert when moreThanFourIncomeSources is Yes', () => {
      expect(
        hideIf({
          survivorsBenefitsForm2025VersionEnabled: false,
          moreThanFourIncomeSources: 'Yes',
        }),
      ).to.be.false;
    });

    it('hides alert when moreThanFourIncomeSources is No', () => {
      expect(
        hideIf({
          survivorsBenefitsForm2025VersionEnabled: false,
          moreThanFourIncomeSources: 'No',
        }),
      ).to.be.true;
    });

    it('hides alert when moreThanFourIncomeSources is unset', () => {
      expect(hideIf({})).to.be.true;
    });
  });
});
