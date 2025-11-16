import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import characterReferencesPages, {
  arrayBuilderOptions,
} from '../../../../pages/07-character-references-chapter/characterReferencesPages';
import CharacterReferencesIntro from '../../../../components/07-character-references-chapter/CharacterReferencesIntro';

describe('characterReferencesPages', () => {
  const formData = {
    relationship: 'Friend',
    phone: {
      callingCode: 1,
      contact: '123-123-3333',
    },
    email: 'ginny@gmail.com',
    address: {
      country: 'USA',
      street: '324 Main Street',
      street2: '',
      city: 'Test',
      state: 'AK',
      postalCode: '23423',
      isMilitary: false,
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
      expect($('va-text-input[label="First or given name"]'), container).to
        .exist;
      expect($('va-text-input[label="Middle name"]'), container).to.exist;
      expect($('va-text-input[label="Last or family name"]'), container).to
        .exist;
      expect($('va-select[label="Suffix"]'), container).to.exist;
    });
  });

  context('Character Reference Address Page', () => {
    const { characterReferenceAddressPage } = characterReferencesPages;
    context('when isMilitary is false', () => {
      it('renders the character refrence address page', () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={characterReferenceAddressPage.schema}
            uiSchema={characterReferenceAddressPage.uiSchema}
            data={{ characterReferences: [formData] }}
            arrayPath="characterReferences"
            pagePerItemIndex={0}
          />,
        );

        getByText("Ginny Weasley's address");

        expect($('va-checkbox', container).getAttribute('label')).to.eq(
          'Reference lives on a United States military base outside of the U.S.',
        );
        expect($('va-select[label="Country"]', container)).to.exist;
        expect($('va-text-input[label="Street address"]', container)).to.exist;
        expect($('va-text-input[label="Street address line 2"]', container)).to
          .exist;
        expect($('va-text-input[label="City"]', container)).to.exist;
        expect($('va-select[label="State"]', container)).to.exist;
        expect($('va-text-input[label="Postal code"]', container)).to.exist;
      });
      it('verifies values from the form data are populating the page', () => {
        const { container } = render(
          <DefinitionTester
            schema={characterReferenceAddressPage.schema}
            uiSchema={characterReferenceAddressPage.uiSchema}
            data={{ characterReferences: [formData] }}
            arrayPath="characterReferences"
            pagePerItemIndex={0}
          />,
        );

        expect($('va-checkbox', container).getAttribute('checked')).to.eq(
          'false',
        );
        expect(
          $('va-select[label="Country"]', container).getAttribute('value'),
        ).to.eq(formData.address.country);
        expect(
          $('va-text-input[label="Street address"]', container).getAttribute(
            'value',
          ),
        ).to.eq(formData.address.street);
        expect(
          $(
            'va-text-input[label="Street address line 2"]',
            container,
          ).getAttribute('value'),
        ).to.eq(formData.address.street2);
        expect(
          $('va-text-input[label="City"]', container).getAttribute('value'),
        ).to.eq(formData.address.city);
        expect(
          $('va-select[label="State"]', container).getAttribute('value'),
        ).to.eq(formData.address.state);
        expect(
          $('va-text-input[label="Postal code"]', container).getAttribute(
            'value',
          ),
        ).to.eq(formData.address.postalCode);
      });
    });

    context('when isMilitary is true', () => {
      const isMilitaryAddress = {
        street: '123 Main St',
        street2: '',
        city: 'APO',
        state: 'AA',
        postalCode: '34010',
        country: 'United States',
        isMilitary: true,
      };

      it('renders the character refrence address page', () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={characterReferenceAddressPage.schema}
            uiSchema={characterReferenceAddressPage.uiSchema}
            data={{
              characterReferences: [
                {
                  ...formData,
                  address: isMilitaryAddress,
                },
              ],
            }}
            arrayPath="characterReferences"
            pagePerItemIndex={0}
          />,
        );

        getByText("Ginny Weasley's address");

        expect($('va-checkbox', container).getAttribute('label')).to.eq(
          'Reference lives on a United States military base outside of the U.S.',
        );
        expect($('va-select[label="Country"]', container)).to.exist;
        expect($('va-text-input[label="Street address"]', container)).to.exist;
        expect($('va-text-input[label="Apartment or unit number"]', container))
          .to.exist;
        expect($('va-radio[label="Military post office"]', container)).to.exist;
        expect($('va-radio[label*="state"]', container)).to.exist;
        expect($('va-text-input[label="Postal code"]', container)).to.exist;
      });
      it('verifies values from the form data are populating the page', () => {
        const { container } = render(
          <DefinitionTester
            schema={characterReferenceAddressPage.schema}
            uiSchema={characterReferenceAddressPage.uiSchema}
            data={{
              characterReferences: [
                {
                  ...formData,
                  address: isMilitaryAddress,
                },
              ],
            }}
            arrayPath="characterReferences"
            pagePerItemIndex={0}
          />,
        );

        expect($('va-checkbox', container).getAttribute('checked')).to.eq(
          'true',
        );
        expect(
          $('va-select[label="Country"]', container).getAttribute('value'),
        ).to.eq(isMilitaryAddress.country);
        expect(
          $('va-text-input[label="Street address"]', container).getAttribute(
            'value',
          ),
        ).to.eq(isMilitaryAddress.street);
        expect(
          $(
            'va-text-input[label="Apartment or unit number"]',
            container,
          ).getAttribute('value'),
        ).to.eq(isMilitaryAddress.street2);
        expect(
          $('va-radio[label="Military post office"]', container).getAttribute(
            'value',
          ),
        ).to.eq(isMilitaryAddress.city);
        expect(
          $('va-radio[label*="state"]', container).getAttribute('value'),
        ).to.eq(isMilitaryAddress.state);
        expect(
          $('va-text-input[label="Postal code"]', container).getAttribute(
            'value',
          ),
        ).to.eq(isMilitaryAddress.postalCode);
      });
    });
  });

  context('Character Reference Contact Information Page', () => {
    const {
      characterReferenceContactInformationPage,
    } = characterReferencesPages;
    it('renders the character refrences contact information page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={characterReferenceContactInformationPage.schema}
          uiSchema={characterReferenceContactInformationPage.uiSchema}
          data={{ characterReferences: [formData] }}
          arrayPath="characterReferences"
          pagePerItemIndex={0}
        />,
      );

      getByText("Ginny Weasley's contact information");
      const vaPhoneInput = container.querySelector('va-telephone-input');
      expect(vaPhoneInput).to.exist;
      expect(vaPhoneInput.getAttribute('label')).to.equal('Home phone number');
      expect($('va-text-input[label="Email address"]'), container).to.exist;
    });
  });

  context('Character Reference Relationship Page', () => {
    const { characterReferenceRelationshipPage } = characterReferencesPages;
    it('renders the character refrences page', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={characterReferenceRelationshipPage.schema}
          uiSchema={characterReferenceRelationshipPage.uiSchema}
          data={{ characterReferences: [formData] }}
          arrayPath="characterReferences"
          pagePerItemIndex={0}
        />,
      );

      getByText('Relationship to Ginny Weasley');
      expect($('va-select', container).getAttribute('label')).to.eq(
        'What is your relationship to this reference?',
      );
    });
  });

  context('Summary Page', () => {
    const { characterReferencesSummary } = characterReferencesPages;
    it('renders the character refrences summary page with a yes/no question', () => {
      const { container } = render(
        <SchemaForm
          name="characterReferencesSummary"
          title={characterReferencesSummary.title}
          schema={characterReferencesSummary.schema}
          uiSchema={characterReferencesSummary.uiSchema}
          data={{}}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );

      expect($('va-radio', container).getAttribute('label')).to.eq(
        'Do you have a character reference to add?',
      );
      expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
      expect(
        $('va-radio-option:nth-child(2)', container).getAttribute('value'),
      ).to.eq('N');
    });
  });

  context('arrayBuilderOptions', () => {
    it('should have the correct arrayPath, nouns, and maxItems properties', () => {
      expect(arrayBuilderOptions.arrayPath).to.equal('characterReferences');
      expect(arrayBuilderOptions.nounSingular).to.equal('character reference');
      expect(arrayBuilderOptions.nounPlural).to.equal('character references');
      expect(arrayBuilderOptions.required).to.be.true;
    });

    it('should return the correct card title from getItemName', () => {
      const item = {
        fullName: {
          first: 'Harry',
          last: 'Potter',
          suffix: '',
        },
      };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(`${item.fullName.first} ${item.fullName.last}`)).to
        .exist;
    });

    it('should return the correct card title from getItemName when suffix exists', () => {
      const item = {
        fullName: {
          first: 'Harry',
          last: 'Potter',
          suffix: 'Jr.',
        },
      };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(
        getByText(
          `${item.fullName.first} ${item.fullName.last}, ${
            item.fullName.suffix
          }`,
        ),
      ).to.exist;
    });

    it('should return the correct card description with from and to dates', () => {
      const { getByText, queryByText } = render(
        arrayBuilderOptions.text.cardDescription(formData),
      );
      getByText('Phone Number:');
      expect(queryByText(/123-123-3333/)).to.exist;
      expect(queryByText(/\+/)).to.exist;
      expect(queryByText(/1/)).to.exist;
      getByText('Email:');
      getByText(formData.email);
      getByText('Relationship:');
      getByText(formData.relationship);
    });

    context('isItemIncomplete function', () => {
      it('should return true when item is null', () => {
        expect(arrayBuilderOptions.isItemIncomplete(null)).to.be.true;
      });

      it('should return true when item is undefined', () => {
        expect(arrayBuilderOptions.isItemIncomplete(undefined)).to.be.true;
      });

      it('should return true when item is empty object', () => {
        expect(arrayBuilderOptions.isItemIncomplete({})).to.be.true;
      });

      it('should return true when fullName is missing', () => {
        const item = {
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when fullName is null', () => {
        const item = {
          fullName: null,
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when address is missing', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when address is null', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: null,
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone is missing', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone is null', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: null,
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is missing', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: {},
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is null', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: null },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is empty string', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when email is missing', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when email is null', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: null,
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when email is empty string', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: '',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when relationship is missing', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when relationship is null', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: null,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when relationship is empty string', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: '',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return false when all required fields are present', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return false when all required fields are present with full data', () => {
        const item = {
          fullName: {
            first: 'John',
            middle: 'Michael',
            last: 'Doe',
            suffix: 'Jr.',
          },
          address: {
            street: '123 Main St',
            street2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
          },
          phone: { contact: '123-456-7890', callingCode: 1 },
          email: 'john.doe@example.com',
          relationship: 'Colleague',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return true when only fullName is missing (all others present)', () => {
        const item = {
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only address is missing (all others present)', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only phone.contact is missing (all others present)', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: {},
          email: 'test@example.com',
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only email is missing (all others present)', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          relationship: 'Friend',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only relationship is missing (all others present)', () => {
        const item = {
          fullName: { first: 'John', last: 'Doe' },
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          email: 'test@example.com',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });
    });
  });
});
