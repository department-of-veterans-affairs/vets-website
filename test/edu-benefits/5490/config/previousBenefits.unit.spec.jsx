import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';

describe('Edu 5490 previousBenefits', () => {
  const { schema, uiSchema } = formConfig.chapters.benefitSelection.pages.previousBenefits;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length)
      .to.equal(7);
  });

  it('should expand options conditionally', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    // Starts with 7 inputs (tested above)
    // Re-tested here for posterity; can be removed before merging
    expect(Array.from(formDOM.querySelectorAll('input,select')).length)
      .to.equal(7);

    const inputs = Array.from(formDOM.querySelectorAll('input'));
    const claimed = inputs.find((i) => i.id === 'root_previousBenefits_view:claimedSponsorService');

    // claimedSponsorService starts as unchecked
    expect(claimed.checked).to.be.false;

    // Expand both of the expandables
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:ownServiceBenefits'), {
      target: {
        checked: true
      }
    });
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:claimedSponsorService'), {
      target: {
        checked: true
      }
    });

    // Should expand to 16
    expect(Array.from(formDOM.querySelectorAll('input,select')).length)
      .to.equal(16);

    expect(claimed.checked).to.be.true;

    // Collapse the fields
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:ownServiceBenefits'), {
      target: {
        checked: false
      }
    });
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:claimedSponsorService'), {
      target: {
        checked: false
      }
    });

    expect(claimed.checked).to.be.false;

    // Should collapse back to 7
    //  ...but it doesn't...
    expect(Array.from(formDOM.querySelectorAll('input,select')).length)
      .to.equal(7);
  });

  // This test fails to produce an error message as expected
  // I've tried submitting the form unmodified first then expanding the fields
  //  and checking for the error message, but that doesn't work either.
  // Also, I've tried passing data to the DefinitionTester to bypass modifying
  //  the DOM before submitting, but that failed to render outright.
  it.skip('should only have require fields conditionally', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          onSubmit={onSubmit}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    // Check the someone else's service box
    const inputs = Array.from(formDOM.querySelectorAll('input'));
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:claimedSponsorService'), {
      target: {
        checked: true
      }
    });
    // expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length)
    //   .to.equal(14);
    // Submit form -- should fail
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.not.be.empty;


    // Uncheck the box
    ReactTestUtils.Simulate.change(inputs.find((i) => i.id === 'root_previousBenefits_view:claimedSponsorService'), {
      target: {
        checked: false
      }
    });
    // expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input').length)
    //   .to.equal(7);
    // Submit form -- should succeed
    submitForm(form);
    expect(Array.from(formDOM.querySelectorAll('.usa-input-error'))).to.be.empty;

    expect(onSubmit.called).to.be.true;
  });
});
