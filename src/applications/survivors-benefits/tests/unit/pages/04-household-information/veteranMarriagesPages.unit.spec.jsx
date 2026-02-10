import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  veteranMarriagesPages,
  options,
} from '../../../../config/chapters/04-household-information/veteranMarriagesPages';
import { previousMarriageEndOptions } from '../../../../utils/labels';

describe('Veteran Previous Marriages pages', () => {
  const {
    veteranMarriagesIntro,
    veteranMarriagesSummary,
    veteranPreviousSpouseName,
    veteranMarriageDatePlace,
    veteranMarriageEnded,
    veteranMarriageEndDateLocation,
  } = veteranMarriagesPages;

  const findItemUi = page => {
    if (!page || !page.uiSchema) return null;
    const wrapper = Object.values(page.uiSchema).find(
      val => val && typeof val === 'object' && val.items,
    );
    return wrapper ? wrapper.items : null;
  };

  it('renders intro description and depends logic honors SURVIVING_SPOUSE + hadPreviousMarriages', () => {
    expect(veteranMarriagesIntro, 'intro page').to.exist;

    // depends logic scenarios
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(veteranMarriagesIntro.depends(showData)).to.be.true;
    expect(veteranMarriagesIntro.depends(hideDataNotSpouse)).to.be.false;
    expect(veteranMarriagesIntro.depends(hideDataNoPrevious)).to.be.false;

    // ui:description rendering
    const introDescFn = veteranMarriagesIntro.uiSchema['ui:description'];
    expect(introDescFn, 'ui:description should be function-like').to.be.a(
      'function',
    );
    const element = introDescFn();
    expect(element, 'ui:description function should return text').to.exist;
    const { container } = render(element);
    const text = container.textContent;
    expect(text).to.include(
      'Next we’ll ask you about the Veteran’s previous marriages. You may add up to 2 marriages.',
    );
  });

  it('renders summary description and depends logic honors SPOUSE + hadPreviousMarriages', () => {
    expect(veteranMarriagesSummary, 'summary page').to.exist;

    // depends logic scenarios
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(veteranMarriagesSummary.depends(showData)).to.be.true;
    expect(veteranMarriagesSummary.depends(hideDataNotSpouse)).to.be.false;
    expect(veteranMarriagesSummary.depends(hideDataNoPrevious)).to.be.false;

    // Render title/description
    const summaryDesc = veteranMarriagesSummary.title;
    const { container } = render(summaryDesc);
    const text = container.textContent;
    expect(text).to.include(
      'Was the Veteran married to someone else before being married to you?',
    );
  });

  it('renders veteran previous spouse name and depends logic honors SPOUSE + hadPreviousMarriages', () => {
    expect(
      veteranPreviousSpouseName,
      'veteranPreviousSpouseName page definition',
    ).to.exist;

    // depends logic scenarios (same gating as intro/summary pages)
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(veteranPreviousSpouseName.depends(showData)).to.be.true;
    expect(veteranPreviousSpouseName.depends(hideDataNotSpouse)).to.be.false;
    expect(veteranPreviousSpouseName.depends(hideDataNoPrevious)).to.be.false;

    // verify the array item UI schema wrapper and the presence of spouseFullName field config
    const itemUi = findItemUi(veteranPreviousSpouseName);
    expect(itemUi, 'array item uiSchema wrapper (items) should exist').to.exist;
    expect(itemUi.spouseFullName, 'spouseFullName field uiSchema should exist')
      .to.exist;

    // Explicit ui:title checks for name subfields
    const nameUi = itemUi.spouseFullName;
    expect(nameUi.first?.['ui:title'], 'First or given name').to.exist;
    expect(nameUi.middle?.['ui:title'], 'Middle name').to.exist;
    expect(nameUi.last?.['ui:title'], 'Last or family name').to.exist;
    expect(nameUi.suffix?.['ui:title'], 'Suffix').to.exist;

    // Verify required titles (first & last typically required)
    if (typeof nameUi.first?.['ui:required'] === 'function') {
      expect(Boolean(nameUi.first['ui:required']({}))).to.be.true;
    }
    if (typeof nameUi.last?.['ui:required'] === 'function') {
      expect(Boolean(nameUi.last['ui:required']({}))).to.be.true;
    }
  });

  it('marriage date/place state/country hideIf and required respond to marriedOutsideUS', () => {
    const itemUi = findItemUi(veteranMarriageDatePlace);
    expect(itemUi, 'marriage date/place item UI not found').to.exist;
    const stateOptions = itemUi.locationOfMarriage.state['ui:options'];
    const stateRequired = itemUi.locationOfMarriage.state['ui:required'];
    const countryOptions = itemUi.locationOfMarriage.otherCountry['ui:options'];
    const countryRequired =
      itemUi.locationOfMarriage.otherCountry['ui:required'];

    const itemBornOutside = { veteranMarriages: [{ marriedOutsideUS: true }] };
    expect(Boolean(stateOptions.hideIf(itemBornOutside, 0))).to.be.true;
    expect(Boolean(stateRequired(itemBornOutside, 0))).to.be.false;
    expect(Boolean(countryOptions.hideIf(itemBornOutside, 0))).to.be.false;
    expect(Boolean(countryRequired(itemBornOutside, 0))).to.be.true;

    const neither = { veteranMarriages: [{}] };
    expect(Boolean(stateOptions.hideIf(neither, 0))).to.be.false;
    expect(Boolean(stateRequired(neither, 0))).to.be.true;
    expect(Boolean(countryOptions.hideIf(neither, 0))).to.be.true;
    expect(Boolean(countryRequired(neither, 0))).to.be.false;
  });

  it('marriage end date/location state/country hideIf and required respond to marriageEndedOutsideUS', () => {
    const itemUi = findItemUi(veteranMarriageEndDateLocation);
    expect(itemUi, 'marriage end date/location item UI not found').to.exist;
    const stateOptions = itemUi.locationOfSeparation.state['ui:options'];
    const stateRequired = itemUi.locationOfSeparation.state['ui:required'];
    const countryOptions =
      itemUi.locationOfSeparation.otherCountry['ui:options'];
    const countryRequired =
      itemUi.locationOfSeparation.otherCountry['ui:required'];

    const itemEndedOutside = {
      veteranMarriages: [{ marriageEndedOutsideUS: true }],
    };
    expect(Boolean(stateOptions.hideIf(itemEndedOutside, 0))).to.be.true;
    expect(Boolean(stateRequired(itemEndedOutside, 0))).to.be.false;
    expect(Boolean(countryOptions.hideIf(itemEndedOutside, 0))).to.be.false;
    expect(Boolean(countryRequired(itemEndedOutside, 0))).to.be.true;
  });

  it('veteranMarriageDatePlace depends logic honors SPOUSE + hadPreviousMarriages and shows dateOfMarriage', () => {
    // depends logic scenarios
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(
      veteranMarriageDatePlace.depends(showData),
      'should show for SURVIVING_SPOUSE with previous marriages',
    ).to.be.true;
    expect(
      veteranMarriageDatePlace.depends(hideDataNotSpouse),
      'should hide when not spouse',
    ).to.be.false;
    expect(
      veteranMarriageDatePlace.depends(hideDataNoPrevious),
      'should hide when spouse has no previous marriages',
    ).to.be.false;

    const { schema, uiSchema } = veteranMarriageDatePlace;
    const form = render(
      <DefinitionTester
        arrayPath="veteranMarriages"
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={0}
        data={{ veteranMarriages: [{}] }}
      />,
    );

    const formDOM = getFormDOM(form);
    const dateEl = $('*[label="Date of marriage"]', formDOM);
    expect(dateEl, 'dateOfMarriage field should be visible').to.exist;
    // Verify title and ui:description on the dateOfMarriage config
    expect(
      uiSchema.veteranMarriages.items.dateOfMarriage?.['ui:title'],
    ).to.equal('Date of marriage');
    expect(
      uiSchema.veteranMarriages.items.dateOfMarriage?.['ui:options']?.[
        'ui:description'
      ],
    ).to.equal(
      'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
    );
    // Safety-net: if visible, the required function evaluates true for initial render
    const requiredFn =
      uiSchema.veteranMarriages.items.dateOfMarriage?.['ui:required'] ||
      uiSchema.veteranMarriages.items.dateOfMarriage?.required ||
      uiSchema.veteranMarriages.items.dateOfMarriage?.['ui:options']?.required;
    expect(requiredFn, "dateOfMarriage 'required'").to.be.a('function');
    expect(Boolean(requiredFn({}))).to.be.true;
  });

  it('veteranMarriageEnded depends logic honors SPOUSE + hadPreviousMarriages and includes reasonForSeparation radio + reasonForSeparationExplanation expansion and validation', () => {
    // depends logic scenarios
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(
      veteranMarriageEnded.depends(showData),
      'should show for SURVIVING_SPOUSE with previous marriages',
    ).to.be.true;
    expect(
      veteranMarriageEnded.depends(hideDataNotSpouse),
      'should hide when not spouse',
    ).to.be.false;
    expect(
      veteranMarriageEnded.depends(hideDataNoPrevious),
      'should hide when spouse has no previous marriages',
    ).to.be.false;

    const itemUi = findItemUi(veteranMarriageEnded);
    expect(itemUi, 'marriage ended item UI not found').to.exist;

    // Radio field
    const radioUi = itemUi.reasonForSeparation;
    expect(radioUi, 'reasonForSeparation').to.exist;
    expect(radioUi['ui:title']).to.equal('How did the marriage end?');
    const radioOptions = radioUi['ui:options'] || {};
    expect(radioOptions.labelHeaderLevel).to.equal(3);
    // Labels should match previousMarriageEndOptions mapping
    Object.keys(previousMarriageEndOptions).forEach(key => {
      expect(radioOptions.labels[key]).to.equal(
        previousMarriageEndOptions[key],
      );
    });

    // Text field config
    const otherUi = itemUi.separationExplanation;
    expect(otherUi, 'separationExplanation').to.exist;
    expect(otherUi['ui:title']).to.equal('Tell us how the marriage ended');
    const otherOptions = otherUi['ui:options'] || {};

    // expandUnderCondition should expand only for OTHER
    expect(otherOptions.expandUnder).to.equal('reasonForSeparation');
    expect(otherOptions.expandUnderCondition('OTHER')).to.be.true;
    expect(otherOptions.expandUnderCondition('DIVORCE')).to.be.false;

    // Required function logic
    const requiredFn =
      otherUi['ui:required'] || otherUi.required || otherOptions.required;
    expect(requiredFn, 'required').to.be.a('function');
    expect(Boolean(requiredFn({ reasonForSeparation: 'OTHER' }))).to.be.true;
    expect(Boolean(requiredFn({ reasonForSeparation: 'DEATH' }))).to.be.false;

    // Error messages
    const errorMessages =
      otherUi['ui:errorMessages'] ||
      otherOptions.errorMessages ||
      otherUi.errorMessages;
    expect(errorMessages, 'error messages').to.exist;
    expect(errorMessages.required).to.equal(
      'Please tell us how the marriage ended',
    );
  });

  it('veteranMarriageEndDateLocation depends logic honors SPOUSE + hadPreviousMarriages and dateOfSeparation is visible with correct title, description, and is required', () => {
    // depends logic scenarios
    const showData = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: true,
    };
    const hideDataNotSpouse = {
      claimantRelationship: 'CHILD',
      hadPreviousMarriages: true,
    };
    const hideDataNoPrevious = {
      claimantRelationship: 'SURVIVING_SPOUSE',
      hadPreviousMarriages: false,
    };
    expect(
      veteranMarriageEndDateLocation.depends(showData),
      'should show for SPOUSE with previous marriages',
    ).to.be.true;
    expect(
      veteranMarriageEndDateLocation.depends(hideDataNotSpouse),
      'should hide when not spouse',
    ).to.be.false;
    expect(
      veteranMarriageEndDateLocation.depends(hideDataNoPrevious),
      'should hide when spouse has no previous marriages',
    ).to.be.false;

    const { schema, uiSchema } = veteranMarriageEndDateLocation;
    const form = render(
      <DefinitionTester
        arrayPath="veteranMarriages"
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={0}
        data={{ veteranMarriages: [{}] }}
      />,
    );

    const formDOM = getFormDOM(form);
    const endDateEl = $('*[label="Date marriage ended"]', formDOM);
    expect(endDateEl, 'dateOfSeparation field should be visible').to.exist;

    // Verify title & description from uiSchema
    const endDateUi = uiSchema.veteranMarriages.items.dateOfSeparation;
    expect(endDateUi?.['ui:title']).to.equal('Date marriage ended');
    expect(endDateUi?.['ui:options']?.['ui:description']).to.equal(
      'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
    );

    // Saftey-net required function logic: visible implies initial required returns true
    const requiredFn =
      endDateUi?.['ui:required'] ||
      endDateUi?.required ||
      endDateUi?.['ui:options']?.required;
    expect(requiredFn, 'dateOfSeparation required').to.be.a('function');
    expect(Boolean(requiredFn({}))).to.be.true;
    expect(Boolean(requiredFn({ 'view:dateOfSeparation': '2024-01-01' }))).to.be
      .false;
  });

  it('should check if the item is incomplete', () => {
    const completeItem = {
      spouseFullName: { first: 'John', last: 'Doe' },
      dateOfMarriage: '2000-01-01',
    };

    const missingName = {
      spouseFullName: null,
      dateOfMarriage: '2000-01-01',
    };

    const missingDate = {
      spouseFullName: { first: 'John', last: 'Doe' },
    };

    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.isItemIncomplete(missingName)).to.be.true;
    expect(options.isItemIncomplete(missingDate)).to.be.true;
  });

  it('summaryTitle returns the correct heading text', () => {
    // expect(
    //   options.text.summaryTitle,
    //   'summaryTitle should be a function',
    // ).to.be.a('function');
    const title = options.text.summaryTitle;
    expect(title).to.be.a('string');
    expect(title).to.equal("Review the Veteran's previous marriages");
  });

  it('cancel titles and descriptions are set correctly', () => {
    expect(options.text.cancelTitle, 'cancelTitle should be set').to.equal(
      'Cancel adding this previous marriage?',
    );
    expect(
      options.text.cancelDescription,
      'cancelDescription should be set',
    ).to.equal(
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage for the Veteran.',
    );
  });

  it('cancelAdd titles and descriptions are set correctly', () => {
    expect(
      options.text.cancelAddTitle,
      'cancelAddTitle should be set',
    ).to.equal('Cancel adding this previous marriage?');
    expect(
      options.text.cancelAddDescription,
      'cancelAddDescription should be set',
    ).to.equal(
      'If you cancel, we won’t add this previous marriage to the list of marriages. You’ll return to a page where you can add another previous marriage for the Veteran.',
    );
  });

  it('cancelEdit titles and descriptions are set correctly', () => {
    expect(
      options.text.cancelEditTitle,
      'cancelEditTitle should be set',
    ).to.equal('Cancel editing this previous marriage?');
    expect(
      options.text.cancelEditDescription,
      'cancelEditDescription should be set',
    ).to.equal(
      'If you cancel, you’ll lose any changes you made to this previous marriage and you will be returned to the previous marriage review page.',
    );
  });

  it('delete titles and descriptions are set correctly', () => {
    expect(options.text.deleteTitle, 'deleteTitle should be set').to.equal(
      'Delete this previous marriage?',
    );
    expect(
      options.text.deleteDescription,
      'deleteDescription should be set',
    ).to.equal(
      'This will delete the information from your list of previous marriages. You’ll return to a page where you can add a new previous marriage for the Veteran.',
    );
    expect(options.text.deleteYes, 'deleteYes should be set').to.equal(
      'Yes, delete',
    );
    expect(options.text.deleteNo, 'deleteNo should be set').to.equal(
      'No, keep',
    );
  });

  it("getItemName returns joined name when present or default 'Previous marriage'", () => {
    // Full name present: returns all parts in correect order
    const full = {
      spouseFullName: {
        first: 'Alex',
        middle: 'Q.',
        last: 'Smith',
        suffix: 'Jr.',
      },
    };
    expect(options.text.getItemName(full)).to.equal('Alex Q. Smith Jr.');

    // Partial name: only last -> returns just that part
    const lastOnly = { spouseFullName: { last: 'Doe' } };
    expect(options.text.getItemName(lastOnly)).to.equal('Doe');

    // Empty parts object: all empty strings -> default label
    const emptyParts = {
      spouseFullName: { first: '', middle: '', last: '', suffix: '' },
    };
    expect(options.text.getItemName(emptyParts)).to.equal('Previous marriage');

    // Missing spouseFullName entirely -> default label
    const missing = {};
    expect(options.text.getItemName(missing)).to.equal('Previous marriage');

    // Null spouseFullName -> default label
    const nullName = { spouseFullName: null };
    expect(options.text.getItemName(nullName)).to.equal('Previous marriage');
  });
});
