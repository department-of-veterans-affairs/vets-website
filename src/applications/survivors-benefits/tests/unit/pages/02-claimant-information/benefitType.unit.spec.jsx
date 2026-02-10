import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import benefitType from '../../../../config/chapters/02-claimant-information/benefitType';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = benefitType;
  it('renders the claimant information page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text('Benefit type');
    const vaCheckboxGroups = $$('va-checkbox-group', formDOM);
    const vaCheckboxes = $$('va-checkbox', formDOM);
    expect(vaCheckboxGroups.length).to.equal(1);
    expect(vaCheckboxes.length).to.equal(3);

    const vaSelectOne = $(
      'va-checkbox-group[label="Select the benefits you want to file a claim for."]',
      formDOM,
    );
    expect(vaSelectOne.getAttribute('required')).to.equal('true');

    expect(vaCheckboxes[0].getAttribute('label')).to.equal(
      'Dependency and Indemnity Compensation (DIC)',
    );
    expect(vaCheckboxes[0].getAttribute('data-key')).to.equal('DIC');
    expect(vaCheckboxes[1].getAttribute('label')).to.equal('Survivors Pension');
    expect(vaCheckboxes[1].getAttribute('data-key')).to.equal(
      'survivorsPension',
    );
    expect(vaCheckboxes[2].getAttribute('label')).to.equal('Accrued benefits');
    expect(vaCheckboxes[2].getAttribute('data-key')).to.equal(
      'accruedBenefits',
    );
  });
});
