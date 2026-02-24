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
      expect(screen.getByRole('option', { name: 'Armed Forces Americas (AA)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'Armed Forces Europe (AE)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'Armed Forces Pacific (AP)' }))
        .to.exist;
      expect(screen.getByRole('option', { name: 'APO' })).to.exist;
      expect(screen.getByRole('option', { name: 'DPO' })).to.exist;
      expect(screen.getByRole('option', { name: 'FPO' })).to.exist;
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(screen.getAllByText('You must provide a response')).to.have.length(
        4,
      );
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

      expect(screen.getByText('Please provide your full street address')).to
        .exist;
      expect(screen.getByText('Please provide a valid zip code')).to.exist;
    });
  });

  describe('U.S. address', () => {
    beforeEach(() => {
      screen = renderPage({ mailingAddress: { country: 'USA' } });
    });

    it('should render State dropdown', () => {
      expect(screen.getByRole('combobox', { name: 'State (*Required)' })).to
        .exist;
      expect(
        screen.queryByRole('combobox', { name: /State\/County\/Province/i }),
      ).not.to.exist;
    });

    it('should show errors when required fields are left blank', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await userEvent.click(submitButton);

      expect(screen.getAllByText('You must provide a response')).to.have.length(
        4,
      );
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

      expect(screen.getByText('Please provide your full street address')).to
        .exist;
      expect(screen.getByText('Please provide a valid city')).to.exist;
      expect(screen.getByText('Please provide a valid zip code')).to.exist;
    });
  });

  describe('International address', () => {
    describe('Canadian address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'CAN' } });
      });

      it('should render State/County/Province dropdown', () => {
        expect(
          screen.getByRole('combobox', {
            name: /Province\/Territory/i,
          }),
        ).to.exist;
        expect(
          screen.queryByRole('textbox', {
            name: /Province\/Territory/i,
          }),
        ).not.to.exist;
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

        expect(screen.getByText('Please provide your full street address')).to
          .exist;
        expect(screen.getByText('Please provide a valid city')).to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });
    });

    describe('Mexican address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'MEX' } });
      });

      it('should render State dropdown', () => {
        expect(screen.getByRole('combobox', { name: 'State (*Required)' })).to
          .exist;
        expect(
          screen.queryByRole('textbox', { name: /State\/County\/Province/i }),
        ).not.to.exist;
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

        expect(screen.getByText('Please provide your full street address')).to
          .exist;
        expect(screen.getByText('Please provide a valid city')).to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });
    });

    describe('Other international address', () => {
      beforeEach(() => {
        screen = renderPage({ mailingAddress: { country: 'ALB' } });
      });

      it('should render State/Country/Province input', () => {
        expect(
          screen.getByRole('textbox', { name: /State\/County\/Province/i }),
        ).to.exist;
        expect(screen.queryByRole('combobox', { name: 'State (*Required)' }))
          .not.to.exist;
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

        expect(screen.getByText('Please provide your full street address')).to
          .exist;
        expect(screen.getByText('Please provide a valid city')).to.exist;
        expect(screen.getByText('Please provide a valid postal code')).to.exist;
      });
    });
  });
});
