import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

describe('guardianInformationChapter', () => {
  let screen;

  describe('guardianName page', () => {
    beforeEach(() => {
      const {
        schema,
        uiSchema,
      } = formConfig.chapters.guardianInformationChapter.pages.guardianName;
      screen = render(<DefinitionTester schema={schema} uiSchema={uiSchema} />);
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(
        screen.getByText(
          'Please enter your parent/guardian/custodian first name.',
        ),
      ).to.exist;
      expect(
        screen.getByText(
          'Please enter your parent/guardian/custodian last or family name.',
        ),
      ).to.exist;
    });

    it('should show errors when invalid characters are entered in name fields', async () => {
      const firstNameInput = screen.getByRole('textbox', {
        name: /First name/i,
      });
      const middleNameInput = screen.getByRole('textbox', {
        name: /Middle name/i,
      });
      const lastNameInput = screen.getByRole('textbox', {
        name: /Last or family name/i,
      });

      await userEvent.type(firstNameInput, 'John123');
      await userEvent.type(middleNameInput, 'Apt@4');
      await userEvent.type(lastNameInput, 'Doe!');
      await userEvent.tab(); // Need to blur the last input to trigger validation

      expect(
        screen.getAllByText(
          'Please enter a valid entry. Acceptable entries are letters, spaces, hyphens and apostrophes.',
        ),
      ).to.have.length(3);
    });

    it('should show errors when inputs have leading spaces or is only whitespace characters', async () => {
      const firstNameInput = screen.getByRole('textbox', {
        name: /First name/i,
      });
      const middleNameInput = screen.getByRole('textbox', {
        name: /Middle name/i,
      });
      const lastNameInput = screen.getByRole('textbox', {
        name: /Last or family name/i,
      });

      await userEvent.type(firstNameInput, ' ');
      await userEvent.type(middleNameInput, ' ');
      await userEvent.type(lastNameInput, ' Doe');
      await userEvent.tab(); // Need to blur the last input to trigger validation

      expect(
        screen.getAllByText(
          'First character must be a letter with no leading space.',
        ),
      ).to.have.length(3);
    });
  });

  describe('guardianMailingAddress page', () => {
    beforeEach(() => {
      const {
        schema,
        uiSchema,
      } = formConfig.chapters.guardianInformationChapter.pages.guardianMailingAddress;
      screen = render(<DefinitionTester schema={schema} uiSchema={uiSchema} />);
    });

    describe('military base address', () => {
      beforeEach(async () => {
        const militaryBaseCheckbox = screen.getByLabelText(
          'I live on a United States military base outside of the country',
        );

        await userEvent.click(militaryBaseCheckbox);
      });

      it('should show APO/FPO/DPO city options and AE/AA/AP state options', async () => {
        expect(screen.getByRole('option', { name: 'AE - APO/DPO/FPO' })).to
          .exist;
        expect(screen.getByRole('option', { name: 'AA - APO/DPO/FPO' })).to
          .exist;
        expect(screen.getByRole('option', { name: 'AP - APO/DPO/FPO' })).to
          .exist;
        expect(screen.getByRole('option', { name: 'APO' })).to.exist;
        expect(screen.getByRole('option', { name: 'DPO' })).to.exist;
        expect(screen.getByRole('option', { name: 'FPO' })).to.exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(
          screen.getAllByText('You must provide a response'),
        ).to.have.length(4);
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const street2Input = screen.getByRole('textbox', {
          name: 'Street address line 2',
        });
        const zipCodeInput = screen.getByRole('textbox', {
          name: /Zip code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(street2Input, ' ');
        await userEvent.type(zipCodeInput, 'abc');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(screen.getByText('Please enter your full street address')).to
          .exist;
        expect(screen.getByText('Please enter a valid street address line 2'))
          .to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });
    });

    describe('U.S. address', () => {
      beforeEach(async () => {
        const countryInput = screen.getByRole('combobox', {
          name: /Country/i,
        });

        await userEvent.selectOptions(countryInput, 'United States');
      });

      it('should render State dropdown and Zip code input', () => {
        expect(screen.getByRole('combobox', { name: 'State (*Required)' })).to
          .exist;
        expect(
          screen.queryByRole('combobox', { name: /State\/County\/Province/i }),
        ).not.to.exist;
        expect(screen.getByRole('textbox', { name: /Zip code/i })).to.exist;
        expect(screen.queryByRole('textbox', { name: /Postal code/i })).not.to
          .exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(
          screen.getAllByText('You must provide a response'),
        ).to.have.length(4);
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const street2Input = screen.getByRole('textbox', {
          name: 'Street address line 2',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const zipCodeInput = screen.getByRole('textbox', {
          name: /Zip code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(street2Input, ' ');
        await userEvent.type(cityInput, 'a');
        await userEvent.type(zipCodeInput, 'abc');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(screen.getByText('Please enter your full street address')).to
          .exist;
        expect(screen.getByText('Please enter a valid street address line 2'))
          .to.exist;
        expect(screen.getByText('Please enter a valid city')).to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });

      it('should show errors when inputs are only whitespace characters', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const street2Input = screen.getByRole('textbox', {
          name: 'Street address line 2',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const zipCodeInput = screen.getByRole('textbox', {
          name: /Zip code/i,
        });

        await userEvent.type(streetInput, '   ');
        await userEvent.type(street2Input, '  ');
        await userEvent.type(cityInput, '  ');
        await userEvent.type(zipCodeInput, ' ');
        await userEvent.tab(); // Need to blur the last input to trigger validation

        expect(screen.getByText('Please enter a valid street address line 2'))
          .to.exist;
        expect(
          screen.getAllByText('You must provide a response'),
        ).to.have.length(3);
      });
    });

    describe('International address', () => {
      beforeEach(async () => {
        const countryInput = screen.getByRole('combobox', {
          name: /Country/i,
        });

        await userEvent.selectOptions(countryInput, 'Afghanistan');
      });

      it('should render State/Country/Province input and Postal code input', () => {
        expect(
          screen.getByRole('textbox', { name: /State\/County\/Province/i }),
        ).to.exist;
        expect(screen.queryByRole('combobox', { name: 'State (*Required)' }))
          .not.to.exist;
        expect(screen.getByRole('textbox', { name: /Postal code/i })).to.exist;
        expect(screen.queryByRole('textbox', { name: /Zip code/i })).not.to
          .exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(
          screen.getAllByText('You must provide a response'),
        ).to.have.length(3);
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const street2Input = screen.getByRole('textbox', {
          name: 'Street address line 2',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const postalCodeInput = screen.getByRole('textbox', {
          name: /Postal code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(street2Input, ' ');
        await userEvent.type(cityInput, 'a');
        await userEvent.type(postalCodeInput, 'ab');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(screen.getByText('Please enter your full street address')).to
          .exist;
        expect(screen.getByText('Please enter a valid street address line 2'))
          .to.exist;
        expect(screen.getByText('Please enter a valid city')).to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });

      it('should show error Canadian postal code is invalid', async () => {
        const countryInput = screen.getByRole('combobox', {
          name: /Country/i,
        });
        const postalCodeInput = screen.getByRole('textbox', {
          name: /Postal code/i,
        });

        await userEvent.selectOptions(countryInput, 'Canada');
        await userEvent.type(postalCodeInput, '12345');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });
    });
  });
});
