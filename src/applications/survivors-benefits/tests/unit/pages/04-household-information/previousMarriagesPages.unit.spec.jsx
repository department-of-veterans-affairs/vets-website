import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { previousMarriagesPages } from '../../../../config/chapters/04-household-information/previousMarriagesPages';
import { options } from '../../fixtures/options-mocks/spouse-options';

describe('Previous marriages pages', () => {
  const {
    previousMarriagesIntro,
    previousMarriagesSummary,
    previousMarriageItemPage,
    previousMarriageDateAndLocationPage,
    previousMarriageEndPage,
    previousMarriageEndDateAndLocationPage,
  } = previousMarriagesPages;

  const findItemUi = page => {
    if (!page || !page.uiSchema) return null;
    const wrapper = Object.values(page.uiSchema).find(
      val => val && typeof val === 'object' && val.items,
    );
    return wrapper ? wrapper.items : null;
  };

  it('renders intro and summary only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages true => should show
    const formData1 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData1)).to.equal(true);
    expect(previousMarriagesSummary.depends(formData1)).to.equal(true);

    // when not recognized as spouse and hadPreviousMarriages false => shouldn't show
    const formData2 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false, // Answered NO
    };
    expect(previousMarriagesIntro.depends(formData2)).to.equal(false);
    expect(previousMarriagesSummary.depends(formData2)).to.equal(false);

    // when claimantRelationship not SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData3)).to.equal(false);
    expect(previousMarriagesSummary.depends(formData3)).to.equal(false);

    // when spouse has been married before => should show
    const formData4 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData4)).to.equal(true);
    expect(previousMarriagesSummary.depends(formData4)).to.equal(true);
  });

  it('shows Previous Spouse Name page only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages false => shouldn't show
    const formData1 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false, // Answered NO
    };
    expect(previousMarriageItemPage.depends(formData1)).to.be.false;
    // console.log('dependentsIntro', dependentsIntro);

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageItemPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriageItemPage.depends(formData3)).to.be.false;
  });

  it('shows Marriage Date and Location page only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages false => shouldn't show
    const formData1 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageDateAndLocationPage.depends(formData1)).to.be.false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageDateAndLocationPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriageDateAndLocationPage.depends(formData3)).to.be.false;
  });

  it('shows Marriage End Reason page only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages false => shouldn't show
    const formData1 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndPage.depends(formData1)).to.be.false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriageEndPage.depends(formData3)).to.be.false;
  });

  it('shows Marriage End Date and Location page only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages false => shouldn't show
    const formData1 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndDateAndLocationPage.depends(formData1)).to.be
      .false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndDateAndLocationPage.depends(formData2)).to.be
      .false;

    // when claimantRelationship not SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriageEndDateAndLocationPage.depends(formData3)).to.be
      .false;
  });

  it('toggles state/country visibility and requiredness based on marriedOutsideUS', () => {
    const itemUi = findItemUi(previousMarriageDateAndLocationPage);
    expect(itemUi, 'marriage date/location item UI not found').to.exist;
    const stateOptions = itemUi.marriageLocation.state['ui:options'];
    const stateRequired = itemUi.marriageLocation.state['ui:required'];
    const countryOptions = itemUi.marriageLocation.country['ui:options'];
    const countryRequired = itemUi.marriageLocation.country['ui:required'];

    const itemBornOutside = { spouseMarriages: [{ marriedOutsideUS: true }] };
    expect(stateOptions.hideIf(itemBornOutside, 0)).to.be.true;
    expect(Boolean(stateRequired(itemBornOutside, 0))).to.be.false;
    expect(countryOptions.hideIf(itemBornOutside, 0)).to.be.false;
    expect(Boolean(countryRequired(itemBornOutside, 0))).to.be.true;

    const topBornOutside = { marriedOutsideUS: true };
    expect(stateOptions.hideIf(topBornOutside, 0)).to.be.true;
    expect(Boolean(stateRequired(topBornOutside, 0))).to.be.false;
    expect(countryOptions.hideIf(topBornOutside, 0)).to.be.false;
    expect(Boolean(countryRequired(topBornOutside, 0))).to.be.true;
  });

  it("requires 'Tell us how the marriage ended' when reason is OTHER", () => {
    const endItemUi = findItemUi(previousMarriageEndPage);
    expect(endItemUi, 'marriage end item UI not found').to.exist;
    const otherRequired = endItemUi.marriageEndOtherExplanation['ui:required'];
    expect(otherRequired).to.be.a('function');

    const itemOther = { spouseMarriages: [{ marriageEndReason: 'OTHER' }] };
    expect(Boolean(otherRequired(itemOther, 0))).to.be.true;

    const itemNotOther = {
      spouseMarriages: [{ marriageEndReason: 'DIVORCE' }],
    };
    expect(Boolean(otherRequired(itemNotOther, 0))).to.be.false;
  });

  it("expands 'Tell us how the marriage ended' input when reason is OTHER", () => {
    const { previousMarriageEndPage: marriageEndPage } = previousMarriagesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath="spouseMarriages"
        schema={marriageEndPage.schema}
        uiSchema={marriageEndPage.uiSchema}
        pagePerItemIndex={0}
        data={{ spouseMarriages: [formData] }}
      />,
    );

    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio[label*="How did the marriage end?"]', formDOM);
    expect(vaRadio).to.exist;

    // select OTHER option
    vaRadio.__events.vaValueChange({ detail: { value: 'OTHER' } });

    expect($('va-text-input[label="Tell us how the marriage ended"]', formDOM))
      .to.exist;
  });

  it('marriage end location state and city display when marriageEndedOutsideUS is false or missing', () => {
    // no marriageEndedOutsideUS present -> state and city should show
    const formData1 = {};
    const form1 = render(
      <DefinitionTester
        arrayPath="spouseMarriages"
        schema={previousMarriageEndDateAndLocationPage.schema}
        uiSchema={previousMarriageEndDateAndLocationPage.uiSchema}
        pagePerItemIndex={0}
        data={{ spouseMarriages: [formData1] }}
      />,
    );
    const formDOM1 = getFormDOM(form1);
    expect($('va-text-input[label="City"]', formDOM1)).to.exist;
    expect($('va-select[label="State"]', formDOM1)).to.exist;

    // marriageEndedOutsideUS explicitly false -> state and city should show
    const formData2 = { marriageEndedOutsideUS: false };
    const form2 = render(
      <DefinitionTester
        arrayPath="spouseMarriages"
        schema={previousMarriageEndDateAndLocationPage.schema}
        uiSchema={previousMarriageEndDateAndLocationPage.uiSchema}
        pagePerItemIndex={0}
        data={{ spouseMarriages: [formData2] }}
      />,
    );
    const formDOM2 = getFormDOM(form2);
    expect($('va-text-input[label="City"]', formDOM2)).to.exist;
    expect($('va-select[label="State"]', formDOM2)).to.exist;
  });

  it('marriage end location city and country display when marriageEndedOutsideUS is true', () => {
    // marriageEndedOutsideUS explicitly true -> city and country should show, state should be hidden
    const formData = { marriageEndedOutsideUS: true };
    const form = render(
      <DefinitionTester
        arrayPath="spouseMarriages"
        schema={previousMarriageEndDateAndLocationPage.schema}
        uiSchema={previousMarriageEndDateAndLocationPage.uiSchema}
        pagePerItemIndex={0}
        data={{ spouseMarriages: [formData] }}
      />,
    );
    const formDOM = getFormDOM(form);
    expect($('va-text-input[label="City"]', formDOM)).to.exist;
    expect($('va-select[label="Country"]', formDOM)).to.exist;
    // state should be hidden when marriageEndedOutsideUS is true
    expect($('va-select[label="State"]', formDOM)).to.not.exist;
  });

  it('does NOT show the "Tell us how the marriage ended" input when marriageEndReason is DIVORCE or DEATH', () => {
    const { previousMarriageEndPage: marriageEndPage } = previousMarriagesPages;
    const formData = {};
    const form = render(
      <DefinitionTester
        arrayPath="spouseMarriages"
        schema={marriageEndPage.schema}
        uiSchema={marriageEndPage.uiSchema}
        pagePerItemIndex={0}
        data={{ spouseMarriages: [formData] }}
      />,
    );

    const formDOM = getFormDOM(form);
    const vaRadio = $('va-radio[label*="How did the marriage end?"]', formDOM);
    expect(vaRadio).to.exist;

    // select DIVORCE
    vaRadio.__events.vaValueChange({ detail: { value: 'DIVORCE' } });
    expect($('va-text-input[label="Tell us how the marriage ended"]', formDOM))
      .to.not.exist;

    // select DEATH
    vaRadio.__events.vaValueChange({ detail: { value: 'DEATH' } });
    expect($('va-text-input[label="Tell us how the marriage ended"]', formDOM))
      .to.not.exist;
  });

  it('marks a previous marriage item incomplete when required fields are missing', () => {
    const completeItem = {
      previousSpouseName: { first: 'John', last: 'Doe' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      marriageEndReason: 'DIVORCE',
    };

    const missingFirstName = {
      previousSpouseName: { first: '', last: 'Doe' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      marriageEndReason: 'DIVORCE',
    };

    const missingLastName = {
      previousSpouseName: { first: 'John', last: '' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      marriageEndReason: 'DIVORCE',
    };

    const missingState = {
      previousSpouseName: { first: 'John', last: 'Doe' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere' }, // missing state when marriedOutsideUS false
      marriedOutsideUS: false,
      marriageEndReason: 'DIVORCE',
    };

    const missingCountry = {
      previousSpouseName: { first: 'John', last: 'Doe' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere' }, // missing country when marriedOutsideUS true
      marriedOutsideUS: true,
      marriageEndReason: 'DIVORCE',
    };

    const otherMissingExplanation = {
      previousSpouseName: { first: 'John', last: 'Doe' },
      marriageToVeteranDate: '2000-01-01',
      marriageLocation: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      marriageEndReason: 'OTHER',
      marriageEndOtherExplanation: '',
    };

    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(missingFirstName)).to.be.true;
    expect(options.isItemIncomplete(missingLastName)).to.be.true;
    expect(options.isItemIncomplete(missingState)).to.be.true;
    expect(options.isItemIncomplete(missingCountry)).to.be.true;
    expect(options.isItemIncomplete(otherMissingExplanation)).to.be.true;
  });

  it('renders the expected intro description content', () => {
    const intro = previousMarriagesIntro.uiSchema['ui:description'];
    const { container } = render(intro());

    // Normalize whitespace to avoid line-break/indentation differences
    const text = container.textContent.replace(/\s+/g, ' ').trim();

    const firstParagraph =
      "Next we'll ask you about your previous marriages before your marriage to the Veteran. You may add up to 2 marriages.";
    const noteParagraph =
      'Note: We usually don’t need to contact a previous spouse. In very rare cases where we need information from this person, we’ll contact you first.';

    expect(text).to.include(firstParagraph);
    expect(text).to.include(noteParagraph);
  });

  it('formats a previous spouse name for card titles using getItemName()', () => {
    const { text } = options;
    const completeName = {
      previousSpouseName: {
        first: 'Jane',
        middle: 'A.',
        last: 'Smith',
        suffix: 'Jr.',
      },
    };
    const missingName = {
      previousSpouseName: {
        first: '',
        middle: 'A.',
        last: '',
        suffix: 'Jr.',
      },
    };
    const emptyName = {
      previousSpouseName: {
        first: '',
        middle: '',
        last: '',
        suffix: '',
      },
    };

    const itemName = text.getItemName(completeName);
    expect(itemName).to.equal('Jane A. Smith Jr.');

    const missingItemName = text.getItemName(missingName);
    expect(missingItemName).to.equal('');

    const emptyItemName = text.getItemName(emptyName);
    expect(emptyItemName).to.equal('');

    // Partial-name cases: ensure missing parts are skipped and order preserved
    const lastOnly = {
      previousSpouseName: {
        first: '',
        middle: '',
        last: 'Smith',
        suffix: '',
      },
    };
    expect(text.getItemName(lastOnly)).to.equal('Smith');

    const firstOnly = {
      previousSpouseName: {
        first: 'Alex',
        middle: '',
        last: '',
        suffix: '',
      },
    };
    expect(text.getItemName(firstOnly)).to.equal('Alex');

    const middleAndLast = {
      previousSpouseName: {
        first: '',
        middle: 'A.',
        last: 'Johnson',
        suffix: '',
      },
    };
    expect(text.getItemName(middleAndLast)).to.equal('A. Johnson');
  });

  it('getItemName returns empty when both first & last missing; builds ordered parts otherwise', () => {
    const { text } = options;

    // Full set of parts -> should join all in order
    const full = {
      previousSpouseName: {
        first: 'Jane',
        middle: 'B.',
        last: 'Doe',
        suffix: 'Sr.',
      },
    };
    expect(text.getItemName(full)).to.equal('Jane B. Doe Sr.');

    // Only first provided -> should return first
    const firstOnly = {
      previousSpouseName: {
        first: 'OnlyFirst',
        middle: '',
        last: '',
        suffix: '',
      },
    };
    expect(text.getItemName(firstOnly)).to.equal('OnlyFirst');

    // Only last provided -> should return last
    const lastOnly = {
      previousSpouseName: {
        first: '',
        middle: '',
        last: 'OnlyLast',
        suffix: '',
      },
    };
    expect(text.getItemName(lastOnly)).to.equal('OnlyLast');

    // First missing AND last missing (even with middle & suffix) -> returns empty string
    const noFirstLast = {
      previousSpouseName: { first: '', middle: 'X.', last: '', suffix: 'III' },
    };
    expect(text.getItemName(noFirstLast)).to.equal('');

    // previousSpouseName completely missing -> returns ''
    const missingObject = {};
    expect(text.getItemName(missingObject)).to.equal('');

    // previousSpouseName present but null -> returns ''
    const nullObject = { previousSpouseName: null };
    expect(text.getItemName(nullObject)).to.equal('');

    // Parts order (first -> middle -> last -> suffix) maintained
    const partsOrder = {
      previousSpouseName: {
        first: 'Al',
        middle: 'Q.',
        last: 'Smith',
        suffix: 'Jr.',
      },
    };
    const result = text.getItemName(partsOrder);
    expect(result).to.equal('Al Q. Smith Jr.');
    // Indirect parts assertion: splitting should yield expected tokens
    expect(result.split(' ')).to.deep.equal(['Al', 'Q.', 'Smith', 'Jr.']);

    // Mixed presence: first + suffix only
    const firstSuffix = {
      previousSpouseName: { first: 'Eva', middle: '', last: '', suffix: 'III' },
    };
    // Because last missing but first present, early return not triggered; suffix appended.
    expect(text.getItemName(firstSuffix)).to.equal('Eva III');
  });
});
