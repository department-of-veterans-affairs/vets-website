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
      expect(screen.getByRole('option', { name: 'AE - APO/DPO/FPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'AA - APO/DPO/FPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'AP - APO/DPO/FPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'APO' })).to.exist;
      expect(screen.getByRole('option', { name: 'DPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'FPO' })).to.exist;
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(screen.getByText('Enter a street address')).to.exist;
      expect(screen.getByText('Select a type of post office: APO, DPO, or FPO'))
        .to.exist;
      expect(screen.getByText('Select an abbreviation: AA, AE, or AP')).to
        .exist;
      expect(screen.getByText('Enter a zip code')).to.exist;
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

      expect(screen.getByText('Enter your full street address')).to.exist;
      expect(screen.getByText('Enter a valid 5-digit zip code')).to.exist;
    });
  });

  describe('U.S. address', () => {
    beforeEach(() => {
      screen = renderPage({ mailingAddress: { country: 'USA' } });
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

      expect(screen.getByText('Enter a street address')).to.exist;
      expect(screen.getByText('Enter a city')).to.exist;
      expect(screen.getByText('Select a state')).to.exist;
      expect(screen.getByText('Enter a zip code')).to.exist;
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

      expect(screen.getByText('Enter your full street address')).to.exist;
      expect(screen.getByText('Enter a valid city')).to.exist;
      expect(screen.getByText('Enter a valid 5-digit zip code')).to.exist;
    });
  });

  describe('International address', () => {
    describe('Canadian address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'CAN' } });
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Enter a street address')).to.exist;
        expect(screen.getByText('Enter a city')).to.exist;
        expect(screen.getByText('Select a province or territory')).to.exist;
        expect(screen.getByText('Enter a postal code')).to.exist;
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

        expect(screen.getByText('Enter your full street address')).to.exist;
        expect(screen.getByText('Enter a valid city')).to.exist;
        expect(screen.getByText('Enter a valid 6-character postal code')).to
          .exist;
      });
    });

    describe('Mexican address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'MEX' } });
      });

      it('should show errors when required fields are left blank', async () => {
        const submitButton = screen.getByRole('button', { name: /Submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Enter a street address')).to.exist;
        expect(screen.getByText('Enter a city')).to.exist;
        expect(screen.getByText('Select a state')).to.exist;
        expect(screen.getByText('Enter a postal code')).to.exist;
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

        expect(screen.getByText('Enter your full street address')).to.exist;
        expect(screen.getByText('Enter a valid city')).to.exist;
        expect(screen.getByText('Enter a valid 5-digit postal code')).to.exist;
      });
    });

    describe('Other international address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'ALB' } });
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

        expect(screen.getByText('Enter your full street address')).to.exist;
        expect(screen.getByText('Enter a valid city')).to.exist;
        expect(screen.getByText('Enter a valid postal code')).to.exist;
      });
    });
  });
});
