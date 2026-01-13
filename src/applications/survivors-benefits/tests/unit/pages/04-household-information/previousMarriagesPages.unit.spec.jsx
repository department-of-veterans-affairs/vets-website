import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  previousMarriagesPages,
  options,
} from '../../../../config/chapters/04-household-information/previousMarriagesPages';

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
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData1)).to.equal(true);
    expect(previousMarriagesSummary.depends(formData1)).to.equal(true);

    // when not recognized as spouse and hadPreviousMarriages false => shouldn't show
    const formData2 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false, // Answered NO
    };
    expect(previousMarriagesIntro.depends(formData2)).to.equal(false);
    expect(previousMarriagesSummary.depends(formData2)).to.equal(false);

    // when claimantRelationship not SURVIVING_SPOUSE => shouldn't show
    const formData3 = {
      claimantRelationship: 'CHILD',
      recognizedAsSpouse: false,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData3)).to.equal(false);
    expect(previousMarriagesSummary.depends(formData3)).to.equal(false);

    // when spouse has been married before => should show
    const formData4 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: true,
    };
    expect(previousMarriagesIntro.depends(formData4)).to.equal(true);
    expect(previousMarriagesSummary.depends(formData4)).to.equal(true);
  });

  it('shows Previous Spouse Name page only when spouse answered Yes to previous marriages', () => {
    // when recognizedAsSpouse true and hadPreviousMarriages false => shouldn't show
    const formData1 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false, // Answered NO
    };
    expect(previousMarriageItemPage.depends(formData1)).to.be.false;
    // console.log('dependentsIntro', dependentsIntro);

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageItemPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SURVIVING_SPOUSE => shouldn't show
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
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageDateAndLocationPage.depends(formData1)).to.be.false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageDateAndLocationPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SURVIVING_SPOUSE => shouldn't show
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
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndPage.depends(formData1)).to.be.false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndPage.depends(formData2)).to.be.false;

    // when claimantRelationship not SURVIVING_SPOUSE => shouldn't show
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
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: true,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndDateAndLocationPage.depends(formData1)).to.be
      .false;

    // when not recognized as spouse => shouldn't show
    const formData2 = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      recognizedAsSpouse: false,
      hadPreviousMarriages: false,
    };
    expect(previousMarriageEndDateAndLocationPage.depends(formData2)).to.be
      .false;

    // when claimantRelationship not SURVIVING_SPOUSE => shouldn't show
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
    const stateOptions = itemUi.locationOfMarriage.state['ui:options'];
    const stateRequired = itemUi.locationOfMarriage.state['ui:required'];
    const countryOptions = itemUi.locationOfMarriage.country['ui:options'];
    const countryRequired = itemUi.locationOfMarriage.country['ui:required'];

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
    const otherRequired = endItemUi.separationExplanation['ui:required'];
    expect(otherRequired).to.be.a('function');

    const itemOther = { spouseMarriages: [{ reasonForSeparation: 'OTHER' }] };
    expect(Boolean(otherRequired(itemOther, 0))).to.be.true;

    const itemNotOther = {
      spouseMarriages: [{ reasonForSeparation: 'DIVORCE' }],
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

  it('does NOT show the "Tell us how the marriage ended" input when reasonForSeparation is DIVORCE or DEATH', () => {
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
      spouseFullName: { first: 'John', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      reasonForSeparation: 'DIVORCE',
    };

    const missingFirstName = {
      spouseFullName: { first: '', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      reasonForSeparation: 'DIVORCE',
    };

    const missingLastName = {
      spouseFullName: { first: 'John', last: '' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      reasonForSeparation: 'DIVORCE',
    };

    const missingState = {
      spouseFullName: { first: 'John', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere' }, // missing state when marriedOutsideUS false
      marriedOutsideUS: false,
      reasonForSeparation: 'DIVORCE',
    };

    const missingCountry = {
      spouseFullName: { first: 'John', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere' }, // missing country when marriedOutsideUS true
      marriedOutsideUS: true,
      reasonForSeparation: 'DIVORCE',
    };

    const otherMissingExplanation = {
      spouseFullName: { first: 'John', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
      locationOfMarriage: { city: 'Somewhere', state: 'VA' },
      marriedOutsideUS: false,
      reasonForSeparation: 'OTHER',
      reasonForSeparationreasonForSeparationExplanation: '',
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
      spouseFullName: {
        first: 'Jane',
        middle: 'A.',
        last: 'Smith',
        suffix: 'Jr.',
      },
    };
    const missingName = {
      spouseFullName: {
        first: '',
        middle: 'A.',
        last: '',
        suffix: 'Jr.',
      },
    };
    const emptyName = {
      spouseFullName: {
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
      spouseFullName: {
        first: '',
        middle: '',
        last: 'Smith',
        suffix: '',
      },
    };
    expect(text.getItemName(lastOnly)).to.equal('Smith');

    const firstOnly = {
      spouseFullName: {
        first: 'Alex',
        middle: '',
        last: '',
        suffix: '',
      },
    };
    expect(text.getItemName(firstOnly)).to.equal('Alex');

    const middleAndLast = {
      spouseFullName: {
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
      spouseFullName: {
        first: 'Jane',
        middle: 'B.',
        last: 'Doe',
        suffix: 'Sr.',
      },
    };
    expect(text.getItemName(full)).to.equal('Jane B. Doe Sr.');

    // Only first provided -> should return first
    const firstOnly = {
      spouseFullName: {
        first: 'OnlyFirst',
        middle: '',
        last: '',
        suffix: '',
      },
    };
    expect(text.getItemName(firstOnly)).to.equal('OnlyFirst');

    // Only last provided -> should return last
    const lastOnly = {
      spouseFullName: {
        first: '',
        middle: '',
        last: 'OnlyLast',
        suffix: '',
      },
    };
    expect(text.getItemName(lastOnly)).to.equal('OnlyLast');

    // First missing AND last missing (even with middle & suffix) -> returns empty string
    const noFirstLast = {
      spouseFullName: { first: '', middle: 'X.', last: '', suffix: 'III' },
    };
    expect(text.getItemName(noFirstLast)).to.equal('');

    // spouseFullName completely missing -> returns ''
    const missingObject = {};
    expect(text.getItemName(missingObject)).to.equal('');

    // spouseFullName present but null -> returns ''
    const nullObject = { spouseFullName: null };
    expect(text.getItemName(nullObject)).to.equal('');

    // Parts order (first -> middle -> last -> suffix) maintained
    const partsOrder = {
      spouseFullName: {
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
      spouseFullName: { first: 'Eva', middle: '', last: '', suffix: 'III' },
    };
    // Because last missing but first present, early return not triggered; suffix appended.
    expect(text.getItemName(firstSuffix)).to.equal('Eva III');
  });

  it('cancels adding previous marriage confirmation texts are correct', () => {
    const { text } = options;

    expect(text.cancelAddTitle).to.equal(
      'Cancel adding this previous marriage?',
    );
    expect(text.cancelAddDescription).to.equal(
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage.',
    );
    expect(text.cancelAddYes).to.equal('Yes, cancel adding');
    expect(text.cancelAddNo).to.equal('No, continue adding');
  });

  it('cancels editing previous marriage confirmation texts are correct', () => {
    const { text } = options;

    expect(text.cancelEditTitle).to.equal(
      'Cancel editing this previous marriage?',
    );
    expect(text.cancelEditDescription).to.equal(
      'If you cancel, you’ll lose any changes you made to this previous marriage and you will be returned to the previous marriage review page.',
    );
    expect(text.cancelEditYes).to.equal('Yes, cancel editing');
    expect(text.cancelEditNo).to.equal('No, continue editing');
  });

  it('delete titles and descriptions are set correctly', () => {
    const { text } = options;

    expect(text.deleteTitle).to.equal('Delete this previous marriage?');
    expect(text.deleteDescription).to.equal(
      'This will delete the information from your list of previous marriages. You’ll return to a page where you can add a new previous marriage.',
    );
    expect(text.deleteYes).to.equal('Yes, delete');
    expect(text.deleteNo).to.equal('No, keep');
  });
});
