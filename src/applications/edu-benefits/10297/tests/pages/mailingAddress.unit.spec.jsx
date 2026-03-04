import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-10297 Mailing address page', () => {
  afterEach(cleanup);

  let screen;

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.mailingAddress;

  const renderPage = (data = { mailingAddress: {} }) => {
    return render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={data} />,
    );
  };

  describe('Military base address', () => {
    beforeEach(() => {
      screen = renderPage({ mailingAddress: { isMilitary: true } });
    });

    it('should show APO/FPO/DPO city options and AE/AA/AP state options', () => {
      expect(screen.getByRole('option', { name: 'AA (Armed Forces Americas)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'AE (Armed Forces Europe)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'AP (Armed Forces Pacific)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'APO' })).to.exist;
      expect(screen.getByRole('option', { name: 'DPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'FPO' })).to.exist;
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Enter a street address')).to.exist;
      expect(
        screen.getByText(
          'Select a type of military post office: APO (Air or Army post office), DPO (Diplomatic post office), or FPO (Fleet post office)',
        ),
      ).to.exist;
      expect(
        screen.getByText(
          'Select an abbreviation: AA (Armed Forces America), AE (Armed Forces Europe), or AP (Armed Forces Pacific)',
        ),
      ).to.exist;
      expect(screen.getByText('Enter a valid 5-digit or 9-digit zip code')).to
        .exist;
    });

    it('should show errors when user input is invalid', async () => {
      const streetInput = screen.getByRole('textbox', {
        name: 'Street address (*Required)',
      });

      const zipCodeInput = screen.getByRole('textbox', {
        name: /Zip code/i,
      });

      await userEvent.type(streetInput, '1');
      await userEvent.type(zipCodeInput, 'abc');
      await userEvent.tab(); // Need to blur the input to trigger validation

      expect(
        screen.getByText(
          'Enter a minimum of 3 characters and maximum of 40 characters',
        ),
      ).to.exist;
      expect(screen.getByText('Enter a valid 5-digit or 9-digit zip code')).to
        .exist;
    });

    it('should validate AA zip codes', async () => {
      const zipCodeInput = screen.getByRole('textbox', {
        name: /Zip code/i,
      });

      await userEvent.selectOptions(
        screen.getByRole('combobox', {
          name: 'AA/AE/AP (*Required)',
        }),
        'AA',
      );
      await userEvent.type(zipCodeInput, 'abc');
      await userEvent.tab(); // Need to blur the input to trigger validation

      expect(
        screen.getByText(
          'Enter a valid zip code for AA. Must start with 340 and be a 5-digit or 9-digit zip code',
        ),
      ).to.exist;
    });

    it('should validate AE zip codes', async () => {
      const zipCodeInput = screen.getByRole('textbox', {
        name: /Zip code/i,
      });

      await userEvent.selectOptions(
        screen.getByRole('combobox', {
          name: 'AA/AE/AP (*Required)',
        }),
        'AE',
      );
      await userEvent.type(zipCodeInput, 'abc');
      await userEvent.tab(); // Need to blur the input to trigger validation

      expect(
        screen.getByText(
          'Enter a valid zip code for AE. Must start with 09 and be a 5-digit or 9-digit zip code',
        ),
      ).to.exist;
    });

    it('should validate AP zip codes', async () => {
      const zipCodeInput = screen.getByRole('textbox', {
        name: /Zip code/i,
      });

      await userEvent.selectOptions(
        screen.getByRole('combobox', {
          name: 'AA/AE/AP (*Required)',
        }),
        'AP',
      );
      await userEvent.type(zipCodeInput, 'abc');
      await userEvent.tab(); // Need to blur the input to trigger validation

      expect(
        screen.getByText(
          'Enter a valid zip code for AP. Must start in the range 962 - 966 and be a 5-digit or 9-digit zip code',
        ),
      ).to.exist;
    });
  });

  describe('U.S. address', () => {
    beforeEach(() => {
      screen = renderPage({ mailingAddress: { country: 'USA' } });
    });

    it('should render State or territory dropdown', () => {
      expect(
        screen.getByRole('combobox', {
          name: 'State or territory (*Required)',
        }),
      ).to.exist;
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Enter a street address')).to.exist;
      expect(screen.getByText('Enter a city')).to.exist;
      expect(screen.getByText('Select a state or territory')).to.exist;
      expect(screen.getByText('Enter a valid 5-digit or 9-digit zip code')).to
        .exist;
    });

    it('should show errors when user input is invalid', async () => {
      const streetInput = screen.getByRole('textbox', {
        name: 'Street address (*Required)',
      });
      const cityInput = screen.getByRole('textbox', {
        name: /City/i,
      });
      const zipCodeInput = screen.getByRole('textbox', {
        name: /Zip code/i,
      });

      await userEvent.type(streetInput, '1');
      await userEvent.type(cityInput, 'a');
      await userEvent.type(zipCodeInput, 'abc');
      await userEvent.tab(); // Need to blur the input to trigger validation

      expect(
        screen.getByText(
          'Enter a minimum of 3 characters and maximum of 40 characters',
        ),
      ).to.exist;
      expect(
        screen.getByText(
          'Enter a minimum of 2 characters and maximum of 20 characters',
        ),
      ).to.exist;
      expect(screen.getByText('Enter a valid 5-digit or 9-digit zip code')).to
        .exist;
    });
  });

  describe('International address', () => {
    describe('Canadian address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'CAN' } });
      });

      it('should render Province or territory dropdown', () => {
        expect(
          screen.getByRole('combobox', {
            name: /Province or territory/i,
          }),
        ).to.exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Enter a street address')).to.exist;
        expect(screen.getByText('Enter a city')).to.exist;
        expect(screen.getByText('Select a province or territory')).to.exist;
        expect(screen.getByText('Enter a valid 6-character postal code')).to
          .exist;
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const postalCodeInput = screen.getByRole('textbox', {
          name: /Postal code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(cityInput, 'a');
        await userEvent.type(postalCodeInput, 'ab');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(
          screen.getByText(
            'Enter a minimum of 3 characters and maximum of 40 characters',
          ),
        ).to.exist;
        expect(
          screen.getByText(
            'Enter a minimum of 2 characters and maximum of 20 characters',
          ),
        ).to.exist;
        expect(screen.getByText('Enter a valid 6-character postal code')).to
          .exist;
      });
    });

    describe('Mexican address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'MEX' } });
      });

      it('should render State dropdown', () => {
        expect(screen.getByRole('combobox', { name: 'State (*Required)' })).to
          .exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Enter a street address')).to.exist;
        expect(screen.getByText('Enter a city')).to.exist;
        expect(screen.getByText('Select a state')).to.exist;
        expect(screen.getByText('Enter a valid 5-digit postal code')).to.exist;
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const postalCodeInput = screen.getByRole('textbox', {
          name: /Postal code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(cityInput, 'a');
        await userEvent.type(postalCodeInput, 'ab');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(
          screen.getByText(
            'Enter a minimum of 3 characters and maximum of 40 characters',
          ),
        ).to.exist;
        expect(
          screen.getByText(
            'Enter a minimum of 2 characters and maximum of 20 characters',
          ),
        ).to.exist;
        expect(screen.getByText('Enter a valid 5-digit postal code')).to.exist;
      });
    });

    describe('Other international address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'ALB' } });
      });

      it('should render State, county, or province text input', () => {
        expect(
          screen.getByRole('textbox', { name: /State, county, or province/i }),
        ).to.exist;
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Enter a street address')).to.exist;
        expect(screen.getByText('Enter a city')).to.exist;
        expect(
          screen.getByText(
            'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter NA.',
          ),
        ).to.exist;
      });

      it('should show errors when user input is invalid', async () => {
        const streetInput = screen.getByRole('textbox', {
          name: 'Street address (*Required)',
        });
        const cityInput = screen.getByRole('textbox', {
          name: /City/i,
        });
        const postalCodeInput = screen.getByRole('textbox', {
          name: /Postal code/i,
        });

        await userEvent.type(streetInput, '1');
        await userEvent.type(cityInput, 'a');
        await userEvent.type(postalCodeInput, 'ab');
        await userEvent.tab(); // Need to blur the input to trigger validation

        expect(
          screen.getByText(
            'Enter a minimum of 3 characters and maximum of 40 characters',
          ),
        ).to.exist;
        expect(
          screen.getByText(
            'Enter a minimum of 2 characters and maximum of 20 characters',
          ),
        ).to.exist;
        expect(
          screen.getByText(
            'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter NA.',
          ),
        ).to.exist;
      });
    });
  });
});
