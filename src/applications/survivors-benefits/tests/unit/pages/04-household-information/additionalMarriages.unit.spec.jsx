import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import additionalMarriages from '../../../../config/chapters/04-household-information/additionalMarriages';

describe('Additional marriages page', () => {
  const { schema, uiSchema } = additionalMarriages;

  it('renders the page and required yes/no input', () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    // page title
    expect(form.getByRole('heading')).to.have.text('Additional marriages');

    // yes/no control should render as va-radio
    const vaRadio = $('va-radio', formDOM);
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('required')).to.equal('true');
  });

  it('additionalMarriagesAlert is not displayed unless answer is YES', () => {
    const {
      additionalMarriagesAlert: {
        'ui:options': { hideIf },
      },
    } = uiSchema;

    // when additionalMarriages is true => isYes true => hideIf should be false
    expect(hideIf({ claimantHasAdditionalMarriages: true })).to.be.false;

    // when additionalMarriages is 'yes' string => not hidden
    expect(hideIf({ claimantHasAdditionalMarriages: 'yes' })).to.be.false;

    // when additionalMarriages is falsey/undefined => hidden
    expect(hideIf({ claimantHasAdditionalMarriages: false })).to.be.true;
    expect(hideIf({})).to.be.true;
  });

  it('renders additionalMarriagesAlert as a va-alert-expandable when visible', () => {
    // render with additionalMarriages true so the alert is shown
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantHasAdditionalMarriages: true }}
      />,
    );
    const formDOM = getFormDOM(form);

    const alert = $('va-alert-expandable', formDOM);
    expect(alert).to.exist;
  });
});
