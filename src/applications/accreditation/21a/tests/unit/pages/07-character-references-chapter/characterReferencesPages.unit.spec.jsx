import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import characterReferencesPages from '../../../../pages/07-character-references-chapter/characterReferencesPages';
import CharacterReferencesIntro from '../../../../components/07-character-references-chapter/CharacterReferencesIntro';

describe('educationalInstitutionsPages', () => {
  const formData = {
    relationship: 'Friend',
    phone: '123-123-3333',
    email: 'ginny@gmail.com',
    address: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '324 Main Street',
      city: 'Test',
      state: 'AK',
      postalCode: '23423',
    },
    fullName: {
      first: 'Ginny',
      last: 'Weasley',
    },
  };

  context('Show Intro page', () => {
    it('it renders the page pragraph and list items', () => {
      const { getByText, getAllByRole } = render(<CharacterReferencesIntro />);
      // Check for key phrase in the first praragraph
      expect(
        getByText(
          /over the next few pages, we will ask you to list at least three/i,
        ),
      ).to.exist;
      // Check for key phrases in the remaining paragraphs
      expect(
        getByText(/you are encouraged to notify your character references/i),
      ).to.exist;

      expect(
        getByText(
          /it is the applicant’s responsibility to ensure that responses/i,
        ),
      ).to.exist;

      const items = [
        'Full name',
        'Address',
        'Primary phone number',
        'Email address',
        'Your relationship to the reference',
      ];
      const listItems = getAllByRole('listitem');
      expect(listItems.length).to.equal(items.length);
      items.forEach((text, idx) => {
        expect(listItems[idx].textContent).to.equal(text);
      });
    });
  });

  context('Name of Character Reference Page', () => {
    const { characterReferenceNamePage } = characterReferencesPages;
    it('renders the name of character refrence page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={characterReferenceNamePage.schema}
          uiSchema={characterReferenceNamePage.uiSchema}
          data={{ characterReferences: [formData] }}
          arrayPath="characterReferences"
          pagePerItemIndex={0}
        />,
      );

      getByText('Name of character reference');
      expect($('va-text-input[label="First name"]'), container).to.exist;
      expect($('va-text-input[label="Middle name"]'), container).to.exist;
      expect($('va-text-input[label="Last name"]'), container).to.exist;
      expect($('va-select[label="Suffix"]'), container).to.exist;
    });
  });

  context('Character Reference Address Page', () => {
    const { characterReferenceNamePage } = characterReferencesPages;
    it('renders the character refrence address page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={characterReferenceNamePage.schema}
          uiSchema={characterReferenceNamePage.uiSchema}
          data={{ characterReferences: [formData] }}
          arrayPath="characterReferences"
          pagePerItemIndex={0}
        />,
      );

      getByText("Ginny Weasley's address");

      expect($('va-checkbox', container).getAttribute('label')).to.eq(
        'Institution is on a United States military base outside of the U.S.',
      );
      expect($('va-select', container).getAttribute('label')).to.eq('Country');
      expect($('va-text-input[label="Street address"]', container)).to.exist;
      expect($('va-text-input[label="Street address line 2"]', container)).to
        .exist;
      expect($('va-text-input[label="City"]', container)).to.exist;
      expect($('va-text-input[label="State, province, or region"]', container))
        .to.exist;
      expect($('va-text-input[label="Postal code"]', container)).to.exist;
    });
  });
});
