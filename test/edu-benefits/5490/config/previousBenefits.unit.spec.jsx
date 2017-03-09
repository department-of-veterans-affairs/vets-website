import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';

describe('Edu 5490 benefitSelection -> previousBenefits', () => {
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
    const fields = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input');

    expect(fields.length).to.equal(7);
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

    // Note: The following checks for specific fields. Alternatively, we could
    //  check for a certain number of fields instead.

    // Check that ownServiceBenefits and one of the benefits other expanded
    //  inputs aren't there
    expect(formDOM.querySelector('#root_previousBenefits_ownServiceBenefits')).to.be.null;
    expect(formDOM.querySelector('#root_previousBenefits_chapter35')).to.be.null;

    // Expand both of the expandables
    const inputs = Array.from(formDOM.querySelectorAll('input'));
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

    // Check that their expandUnder fields are present
    expect(formDOM.querySelector('#root_previousBenefits_ownServiceBenefits')).to.not.be.null;
    expect(formDOM.querySelector('#root_previousBenefits_chapter35')).to.not.be.null;
  });
});
