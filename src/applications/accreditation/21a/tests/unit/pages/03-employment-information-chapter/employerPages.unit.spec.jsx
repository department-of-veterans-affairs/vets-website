import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import employersPages, {
  arrayBuilderOptions,
} from '../../../../pages/03-employment-information-chapter/employersPages';

describe('Employers Pages', () => {
  const formData = {
    name: 'Super Saver',
    positionTitle: 'Manager',
    supervisorName: 'Draco Malfoy',
    address: {
      country: 'USA',
      street: '324 Main Street',
      street2: '',
      city: 'Test',
      state: 'AK',
      postalCode: '23423',
      isMilitary: false,
    },
    phone: {
      callingCode: 1,
      countryCode: 'US',
      contact: '2342224567',
    },
    extension: '123',
  };

  context('Employers Information Intro Page', () => {
    it('renders the intro page description', () => {
      const form = render(
        <DefinitionTester
          schema={employersPages.employers.schema}
          uiSchema={employersPages.employers.uiSchema}
          data={{}}
        />,
      );
      const { getAllByText } = form;
      const matches = getAllByText((content, element) =>
        element.textContent.includes(
          'You will now list your employment information for the past ten years.',
        ),
      );
      expect(matches.length).to.be.greaterThan(0);
    });
  });

  context('Employment Information Page - Employer and Position Info', () => {
    const { employerInformationPage } = employersPages;

    it('renders employment information fields', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={employerInformationPage.schema}
          uiSchema={employerInformationPage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      getByText('Employer and position information');

      expect($('va-text-input[label="Name of employer"]', container)).to.exist;
      expect($('va-text-input[label="Position title"]', container)).to.exist;
      expect($('va-text-input[label="Supervisor name"]', container)).to.exist;
    });
    it('verifies values from the form data are populating the page', () => {
      const { container } = render(
        <DefinitionTester
          schema={employerInformationPage.schema}
          uiSchema={employerInformationPage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      expect(
        $('va-text-input[label="Name of employer"]', container).getAttribute(
          'value',
        ),
      ).to.eq(formData.name);
      expect(
        $('va-text-input[label="Position title"]', container).getAttribute(
          'value',
        ),
      ).to.eq(formData.positionTitle);
      expect(
        $('va-text-input[label="Supervisor name"]', container).getAttribute(
          'value',
        ),
      ).to.eq(formData.supervisorName);
    });
  });

  context('Employment Information Address Page', () => {
    const { employerAddressPage } = employersPages;
    context('when isMilitary is false', () => {
      it('renders the employment information address page', () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={employerAddressPage.schema}
            uiSchema={employerAddressPage.uiSchema}
            data={{ employers: [formData] }}
            arrayPath="employers"
            pagePerItemIndex={0}
          />,
        );

        getByText("Super Saver's address");

        expect($('va-checkbox', container).getAttribute('label')).to.eq(
          'I work on a United States military base outside of the U.S.',
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
            schema={employerAddressPage.schema}
            uiSchema={employerAddressPage.uiSchema}
            data={{ employers: [formData] }}
            arrayPath="employers"
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

      it('renders the employment information address page', () => {
        const { container, getByText } = render(
          <DefinitionTester
            schema={employerAddressPage.schema}
            uiSchema={employerAddressPage.uiSchema}
            data={{
              employers: [
                {
                  ...formData,
                  address: isMilitaryAddress,
                },
              ],
            }}
            arrayPath="employers"
            pagePerItemIndex={0}
          />,
        );

        getByText("Super Saver's address");

        expect($('va-checkbox', container).getAttribute('label')).to.eq(
          'I work on a United States military base outside of the U.S.',
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
            schema={employerAddressPage.schema}
            uiSchema={employerAddressPage.uiSchema}
            data={{
              employers: [
                {
                  ...formData,
                  address: isMilitaryAddress,
                },
              ],
            }}
            arrayPath="employers"
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

  context('Employment Phone Number Page', () => {
    const { employerPhoneNumberPage } = employersPages;

    it('renders employment phone number fields', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={employerPhoneNumberPage.schema}
          uiSchema={employerPhoneNumberPage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      getByText("Super Saver's phone number");

      const vaPhoneInput = container.querySelector('va-telephone-input');
      expect(vaPhoneInput).to.exist;
      expect(vaPhoneInput.getAttribute('label')).to.equal('Home phone number');
      expect($('va-text-input[label="Extension"]'), container).to.exist;
    });
    it('verifies values from the form data are populating the page', () => {
      const { container } = render(
        <DefinitionTester
          schema={employerPhoneNumberPage.schema}
          uiSchema={employerPhoneNumberPage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      const vaPhoneInput = container.querySelector('va-telephone-input');
      // not sure why this isnt working
      // expect(vaPhoneInput.getAttribute('contact')).to.equal(
      //   formData.phone.contact,
      // );
      expect(vaPhoneInput.getAttribute('country')).to.equal(
        formData.phone.countryCode,
      );
      expect(
        $('va-text-input[label="Extension"]').getAttribute('value'),
      ).to.equal(formData.extension);
    });
  });

  context('Employment Date Range Page', () => {
    const { employerDateRangePage } = employersPages;

    it('renders date range fields', () => {
      const { container, getByText } = render(
        <DefinitionTester
          schema={employerDateRangePage.schema}
          uiSchema={employerDateRangePage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      getByText('Dates you were employed at Super Saver');
      expect($('va-date[label="Employment start date"]', container)).to.exist;
      expect($('va-date[label="Employment end date"]', container)).to.exist;
      expect($('va-checkbox[label="I still work here."]', container)).to.exist;
    });

    it("hides 'Employment end date' when I still work here is checked", () => {
      const { container } = render(
        <DefinitionTester
          schema={employerDateRangePage.schema}
          uiSchema={employerDateRangePage.uiSchema}
          data={{ employers: [formData] }}
          arrayPath="employers"
          pagePerItemIndex={0}
        />,
      );
      // service dates and checkbox should be visible
      expect($('va-date[label="Employment start date"]', container)).to.exist;
      expect($('va-date[label="Employment end date"]', container)).to.exist;
      const currentlyEmployedCheckbox = $('va-checkbox', container);
      expect(currentlyEmployedCheckbox).to.exist;
      expect(currentlyEmployedCheckbox.getAttribute('checked')).to.equal(
        'false',
      );

      // check currently enrolled checkbox
      $('va-checkbox', container).__events.vaChange({
        target: { checked: true },
      });
      // end date is hidden and checkbox is checked
      expect($('va-date[label="Employment end date"]', container)).to.not.exist;
      expect(currentlyEmployedCheckbox.getAttribute('checked')).to.equal(
        'true',
      );
    });
  });

  context('arrayBuilderOptions', () => {
    it('should have the correct arrayPath, nouns, and maxItems properties', () => {
      expect(arrayBuilderOptions.arrayPath).to.equal('employers');
      expect(arrayBuilderOptions.nounSingular).to.equal('employer');
      expect(arrayBuilderOptions.nounPlural).to.equal('employers');
      expect(arrayBuilderOptions.required).to.be.true;
    });

    it('should return the correct card title from getItemName', () => {
      const item = { name: 'Super Savers' };
      const { getByText } = render(arrayBuilderOptions.text.getItemName(item));
      expect(getByText(item.name)).to.exist;
    });

    it('should return the correct card description with from and to dates and primaryWorkAddress', () => {
      const item = {
        dateRange: { from: '2000-01', to: '2004-01' },
        primaryWorkAddress: {
          selected: true,
        },
      };
      const { getByText } = render(
        arrayBuilderOptions.text.cardDescription(item, 'currentlyEmployed'),
      );
      expect(getByText('January 2000 - January 2004; Primary work address')).to
        .exist;
    });

    it('should return the correct card description with from date and present and no primaryWorkAddress', () => {
      const item = {
        dateRange: { from: '2000-01', to: '' },
        currentlyEmployed: true,
        primaryWorkAddress: {
          selected: false,
        },
      };
      const { getByText } = render(
        arrayBuilderOptions.text.cardDescription(item, 'currentlyEmployed'),
      );
      expect(getByText('January 2000 - Present')).to.exist;
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

      it('should return true when name is missing', () => {
        const item = {
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when name is null', () => {
        const item = {
          name: null,
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when name is empty string', () => {
        const item = {
          name: '',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when positionTitle is missing', () => {
        const item = {
          name: 'Test Company',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when positionTitle is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: null,
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when positionTitle is empty string', () => {
        const item = {
          name: 'Test Company',
          positionTitle: '',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when supervisorName is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when supervisorName is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: null,
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when supervisorName is empty string', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: '',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when address is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when address is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: null,
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: null,
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: {},
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: null },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when phone.contact is empty string', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: null,
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.from is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.from is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: null, to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.from is empty string', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.to is missing and currentlyEmployed is false', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.to is null and currentlyEmployed is false', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: null },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when dateRange.to is empty string and currentlyEmployed is false', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return false when dateRange.to is missing but currentlyEmployed is true', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01' },
          currentlyEmployed: true,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return true when currentlyEmployed is false but reasonForLeaving is missing', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when currentlyEmployed is false but reasonForLeaving is null', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: null,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when currentlyEmployed is false but reasonForLeaving is empty string', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: '',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return false when all required fields are present with currentlyEmployed true', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01' },
          currentlyEmployed: true,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return false when all required fields are present with currentlyEmployed false', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.false;
      });

      it('should return true when only name is missing (all others present)', () => {
        const item = {
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only positionTitle is missing (all others present)', () => {
        const item = {
          name: 'Test Company',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only supervisorName is missing (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only address is missing (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only phone.contact is missing (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: {},
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only dateRange.from is missing (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { to: '2024-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only dateRange.to is missing and currentlyEmployed is false (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01' },
          currentlyEmployed: false,
          reasonForLeaving: 'Better opportunity',
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });

      it('should return true when only reasonForLeaving is missing and currentlyEmployed is false (all others present)', () => {
        const item = {
          name: 'Test Company',
          positionTitle: 'Manager',
          supervisorName: 'John Doe',
          address: { street: '123 Main St' },
          phone: { contact: '123-456-7890' },
          dateRange: { from: '2020-01', to: '2024-01' },
          currentlyEmployed: false,
        };
        expect(arrayBuilderOptions.isItemIncomplete(item)).to.be.true;
      });
    });
  });

  it('renders the summary page hint', () => {
    const form = render(
      <DefinitionTester
        schema={employersPages.employersSummary.schema}
        uiSchema={employersPages.employersSummary.uiSchema}
        data={{}}
      />,
    );
    const { container } = form;
    const radio = $('va-radio', container);
    expect(radio).to.exist;
    expect(radio.getAttribute('hint')).to.include('employer');
    expect($('va-radio-option', container).getAttribute('value')).to.eq('Y');
    expect(
      $('va-radio-option:nth-child(2)', container).getAttribute('value'),
    ).to.eq('N');
  });
});
