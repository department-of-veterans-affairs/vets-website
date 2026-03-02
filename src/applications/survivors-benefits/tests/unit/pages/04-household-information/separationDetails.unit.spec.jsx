import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../../../config/chapters/04-household-information/separationDetails';

describe('Separation details page', () => {
  const { uiSchema, schema } = page;

  it('contains courtOrderAlert with correct hideIf behavior', () => {
    expect(uiSchema).to.be.an('object');
    const alert = uiSchema.courtOrderAlert;
    expect(alert, 'courtOrderAlert missing').to.exist;
    const opts = alert['ui:options'];
    expect(opts).to.be.an('object');

    // when courtOrderedSeparation is true (boolean) -> isYes true -> hideIf should be false (show)
    expect(opts.hideIf({ courtOrderedSeparation: true })).to.be.false;

    // when courtOrderedSeparation is 'yes' (string) -> isYes true
    expect(opts.hideIf({ courtOrderedSeparation: 'yes' })).to.be.false;

    // when courtOrderedSeparation is false -> isYes false -> hideIf true (hide)
    expect(opts.hideIf({ courtOrderedSeparation: false })).to.be.true;
    expect(opts.hideIf({ courtOrderedSeparation: 'no' })).to.be.true;

    // render the page when courtOrderedSeparation is true so the alert is visible
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ courtOrderedSeparation: true }}
      />,
    );
    const formDOM = getFormDOM(form);
    const alertEl = $('va-alert-expandable', formDOM);
    expect(alertEl).to.exist;
  });

  it('schema requires expected fields', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('separationExplanation');
    expect(schema.required).to.include('separationStartDate');
    expect(schema.required).to.include('separationEndDate');
    expect(schema.required).to.include('courtOrderedSeparation');
  });
});
