import React from 'react';
import { expect } from 'chai';
// Use these imports
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
// End use these imports

import dependentsPages, {
  options,
} from '../../../../config/chapters/04-household-information/dependentsPages';

describe('Dependents Pages', () => {
  const { dependentInfo, dependentHousehold } = dependentsPages;

  const findItemUi = page => {
    if (!page || !page.uiSchema) return null;
    // look for the property whose value has an `items` key
    const wrapper = Object.values(page.uiSchema).find(
      val => val && typeof val === 'object' && val.items,
    );
    return wrapper ? wrapper.items : null;
  };

  const getDependentsData = count => ({
    veteranChildrenCount: String(count),
    veteransChildren:
      count === 0 ? [{}] : Array.from({ length: count }, () => ({})),
  });

  it('SSN required field is hidden when noSsn is set', () => {
    // Render the dependent name page as an item page for dependents
    const { dependentName: page } = dependentsPages;

    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{ noSsn: true }] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const ssnEl = $(
      'va-text-input[name*="dependentSocialSecurityNumber"]',
      formDOM,
    );
    expect(ssnEl).to.not.exist;

    // // noSsn true should also hide
    // const formTop = render(
    //   <DefinitionTester
    //     arrayPath="dependents"
    //     schema={page.schema}
    //     uiSchema={page.uiSchema}
    //     pagePerItemIndex={0}
    //     data={{ dependents: [{}], noSsn: true }}
    //   />,
    // );
    // const formDOMTop = getFormDOM(formTop);
    // const ssnElTop = $(
    //   'va-text-input[name*="dependentSocialSecurityNumber"]',
    //   formDOMTop,
    // );
    // expect(ssnElTop).to.not.exist;

    // ssn set => show and required
  });

  it('introPage ui:description displays expected text', () => {
    const { dependentsIntro } = dependentsPages;

    const form = render(
      <DefinitionTester
        schema={dependentsIntro.schema}
        uiSchema={dependentsIntro.uiSchema}
        data={{}}
      />,
    );

    // Intro paragraph text
    expect(
      form.getByText(
        /Next we.?ll ask you about the Veteran.?s dependent children. You may add up to 3 dependents./i,
      ),
    ).to.exist;
  });

  it('SSN required field is visible when noSsn is false or unset', () => {
    // Render the dependent name page as an item page for dependents
    const { dependentName: page } = dependentsPages;

    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{ noSsn: false }] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const ssnEl = $(
      'va-text-input[name*="childSocialSecurityNumber"]',
      formDOM,
    );
    expect(ssnEl).to.exist;
    expect(ssnEl.getAttribute('required')).to.equal('true');

    // unset noSsn should also show and require SSN
    const formUnset = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{}] }}
      />,
    );
    const formDOMUnset = getFormDOM(formUnset);
    const ssnElUnset = $(
      'va-text-input[name*="childSocialSecurityNumber"]',
      formDOMUnset,
    );
    expect(ssnElUnset).to.exist;
    expect(ssnElUnset.getAttribute('required')).to.equal('true');
  });

  it('birthPlace state/country is displayed when bornOutsideUS is true', () => {
    const { dependentDobPlace: page } = dependentsPages;

    // bornOutsideUS => city shown and required, country shown and required
    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{ bornOutsideUS: true }] }}
      />,
    );
    const formDOM = getFormDOM(form);
    const citySelect = $('va-text-input[name*="birthPlace_city"]', formDOM);
    const stateSelect = $('va-select[name*="birthPlace_state"]', formDOM);
    const countrySelect = $(
      'va-select[name*="birthPlace_otherCountry"]',
      formDOM,
    );
    expect(stateSelect).to.not.exist;
    expect(citySelect).to.exist;
    expect(citySelect.getAttribute('required')).to.equal('true');
    expect(countrySelect).to.exist;
    expect(countrySelect.getAttribute('required')).to.equal('true');
  });

  it('birthPlace city/state is displayed when bornOutsideUS does not exist', () => {
    const { dependentDobPlace: page } = dependentsPages;

    // bornInsideUS => state shown and required, country hidden and not required
    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{}] }}
      />,
    );
    const formDOMNone = getFormDOM(form);
    const citySelect = $('va-text-input[name*="birthPlace_city"]', formDOMNone);
    const stateSelect = $('va-select[name*="birthPlace_state"]', formDOMNone);
    const countrySelect = $(
      'va-select[name*="birthPlace_country"]',
      formDOMNone,
    );
    expect(countrySelect).to.not.exist;
    expect(citySelect).to.exist;
    expect(citySelect.getAttribute('required')).to.equal('true');
    expect(stateSelect).to.exist;
    expect(stateSelect.getAttribute('required')).to.equal('true');
  });

  it('currentlyMarried expand-under configuration is correct', () => {
    const infoItemUi = findItemUi(dependentInfo);
    expect(infoItemUi, 'dependentInfo item UI not found').to.exist;
    const currently = infoItemUi.currentlyMarried;
    expect(currently['ui:options'].expandUnder).to.equal('hasBeenMarried');
    expect(currently['ui:options'].expandUnderCondition).to.equal(true);
  });

  it('seriouslyDisabledInfo description is rendered', () => {
    const { dependentInfo: page } = dependentsPages;
    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{ veteransChildren: [{}] }}
      />,
    );

    expect(
      form.getByText(
        /A child is seriously disabled if they developed a permanent physical or mental disability before they turned 18 years old. A seriously disabled child can’t support or care for themselves./i,
      ),
    ).to.exist;
  });

  it('should check if the item is incomplete', () => {
    const completeItem = {
      childFullName: { first: 'John', last: 'Doe' },
      childDateOfBirth: '1990-01-01',
    };
    const incompleteItem1 = {
      childFullName: null,
      childDateOfBirth: '1990-01-01',
    };
    const incompleteItem2 = {
      childFullName: { first: 'John', last: 'Doe' },
    };

    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(incompleteItem1)).to.be.true;
    expect(options.isItemIncomplete(incompleteItem2)).to.be.true;
  });

  it('should show the correct getItemName output', () => {
    const { text } = options;
    const itemWithName = {
      childFullName: { first: 'Jane', middle: 'A.', last: 'Smith' },
    };
    const itemWithoutName = {};

    expect(text.getItemName(itemWithName)).to.equal('Jane Smith');
    expect(text.getItemName(itemWithoutName)).to.equal('Dependent');
  });

  it('AdditionalDependentsAlert only displays when livesWith is explicitly false', () => {
    const householdItemUi = findItemUi(dependentHousehold);
    expect(householdItemUi, 'dependentHousehold item UI not found').to.exist;
    const alertOptions =
      householdItemUi.additionalDependentsAlert['ui:options'];

    // explicit false at item => alert visible (hideIf returns false)
    const itemFalse = { veteransChildren: [{ livesWith: false }] };
    expect(alertOptions.hideIf(itemFalse, 0)).to.be.false;

    // explicit true => hidden
    const itemTrue = { veteransChildren: [{ livesWith: true }] };
    expect(alertOptions.hideIf(itemTrue, 0)).to.be.true;

    // undefined => hidden
    const none = { veteranChildrenCount: '0', veteransChildren: [{}] };
    expect(alertOptions.hideIf(none, 0)).to.be.true;

    // Render the household page with livesWith false so the alert is visible
    const { dependentHousehold: page } = dependentsPages;
    const form = render(
      <DefinitionTester
        arrayPath="veteransChildren"
        schema={page.schema}
        uiSchema={page.uiSchema}
        pagePerItemIndex={0}
        data={{
          veteranChildrenCount: '1',
          veteransChildren: [{ livesWith: false }],
        }}
      />,
    );
    const formDOM = getFormDOM(form);
    const alertEl = $('va-alert-expandable', formDOM);
    expect(alertEl).to.exist;
  });

  // it('dependentMailingAddress depends shows only when livesWith is false', () => {
  //   const { dependentMailingAddress } = dependentsPages;

  //   const itemFalse = { veteransChildren: [{ livesWith: false }] };
  //   const itemTrue = { veteransChildren: [{ livesWith: true }] };
  //   const none = { veteransChildren: [{}] };

  //   expect(dependentMailingAddress.depends(itemFalse, 0)).to.be.true;
  //   expect(dependentMailingAddress.depends(itemTrue, 0)).to.be.false;
  //   expect(dependentMailingAddress.depends(none, 0)).to.be.false;
  // });

  // it('dependentCustodian depends shows only when livesWith is false', () => {
  //   const { dependentCustodian } = dependentsPages;

  //   const itemFalse = { veteransChildren: [{ livesWith: false }] };
  //   const itemTrue = { veteransChildren: [{ livesWith: true }] };
  //   const none = { veteransChildren: [{}] };

  //   expect(dependentCustodian.depends(itemFalse, 0)).to.be.true;
  //   expect(dependentCustodian.depends(itemTrue, 0)).to.be.false;
  //   expect(dependentCustodian.depends(none, 0)).to.be.false;
  // });
  it('dependentsIntro depends shows only when veteranChildrenCount is 1 or more', () => {
    const { dependentsIntro } = dependentsPages;

    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentsIntro.depends(itemZero)).to.be.false;
    expect(dependentsIntro.depends(itemOne)).to.be.true;
    expect(dependentsIntro.depends(itemTwo)).to.be.true;
  });

  it('dependentsSummary depends shows only when veteranChildrenCount is 1 or more', () => {
    const { dependentsSummary } = dependentsPages;

    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentsSummary.depends(itemZero)).to.be.false;
    expect(dependentsSummary.depends(itemOne)).to.be.true;
    expect(dependentsSummary.depends(itemTwo)).to.be.true;
  });

  it('dependentName depends shows only when veteranChildrenCount is 1 or more', () => {
    const { dependentName } = dependentsPages;

    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentName.depends(itemZero)).to.be.false;
    expect(dependentName.depends(itemOne)).to.be.true;
    expect(dependentName.depends(itemTwo)).to.be.true;
  });

  it('dependentDobPlace depends shows only when veteranChildrenCount is 1 or more', () => {
    const { dependentDobPlace } = dependentsPages;

    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentDobPlace.depends(itemZero)).to.be.false;
    expect(dependentDobPlace.depends(itemOne)).to.be.true;
    expect(dependentDobPlace.depends(itemTwo)).to.be.true;
  });

  it('dependentRelationship depends shows only when veteranChildrenCount is 1 or more', () => {
    const { dependentRelationship } = dependentsPages;

    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentRelationship.depends(itemZero)).to.be.false;
    expect(dependentRelationship.depends(itemOne)).to.be.true;
    expect(dependentRelationship.depends(itemTwo)).to.be.true;
  });

  it('dependentInfo depends shows only when veteranChildrenCount is 1 or more', () => {
    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentInfo.depends(itemZero)).to.be.false;
    expect(dependentInfo.depends(itemOne)).to.be.true;
    expect(dependentInfo.depends(itemTwo)).to.be.true;
  });

  it('dependentHousehold depends shows only when veteranChildrenCount is 1 or more', () => {
    const itemZero = getDependentsData(0);
    const itemOne = getDependentsData(1);
    const itemTwo = getDependentsData(2);

    expect(dependentHousehold.depends(itemZero)).to.be.false;
    expect(dependentHousehold.depends(itemOne)).to.be.true;
    expect(dependentHousehold.depends(itemTwo)).to.be.true;
  });

  it('dependentChildSupport depends shows only when livesWith is false', () => {
    const { dependentChildSupport } = dependentsPages;

    const itemFalse = {
      veteranChildrenCount: '1',
      veteransChildren: [{ livesWith: false }],
    };
    const itemTrue = {
      veteranChildrenCount: '1',
      veteransChildren: [{ livesWith: true }],
    };
    const none = { veteranChildrenCount: '0', veteransChildren: [{}] };

    expect(dependentChildSupport.depends(itemFalse, 0)).to.be.true;
    expect(dependentChildSupport.depends(itemTrue, 0)).to.be.false;
    expect(dependentChildSupport.depends(none, 0)).to.be.false;
  });
});
