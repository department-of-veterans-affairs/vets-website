import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantRelationship from '../../../../config/chapters/02-claimant-information/claimantRelationship';
import { claimantRelationshipOptions } from '../../../../utils/labels';

describe('Claimant relationship page', () => {
  const { schema, uiSchema } = claimantRelationship;
  it('renders the claimant relationship options', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Claimant’s relationship to the Veteran',
    );
    const vaAdditionalInfos = $$('va-additional-info', formDOM);

    expect(vaAdditionalInfos[0].getAttribute('trigger')).to.equal(
      'What we consider a seriously disabled adult child',
    );
    const vaRelationshipRadio = $(
      'va-radio[label="What is the claimant’s relationship to the Veteran?"]',
      formDOM,
    );

    const vaRelationshipOptions = $$(
      'va-radio-option[name="root_claimantRelationship"]',
      formDOM,
    );
    vaRelationshipOptions.forEach(option => {
      const key = option.getAttribute('value');
      const label = option.getAttribute('label');
      expect(label).to.equal(claimantRelationshipOptions[key]);
    });

    expect(vaAdditionalInfos.length).to.equal(1);
    expect(vaRelationshipOptions.length).to.equal(5);

    expect(vaRelationshipRadio.getAttribute('required')).to.equal('true');
  });
});
