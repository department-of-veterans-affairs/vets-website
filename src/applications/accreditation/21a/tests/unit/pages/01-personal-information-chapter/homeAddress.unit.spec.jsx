import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import homeAddressPage from '../../../../pages/01-personal-information-chapter/homeAddress';

describe('Home address page', () => {
  context('when isMilitary is false', () => {
    const data = {
      homeAddress: {
        street: '123 Main St',
        street2: '',
        city: 'Springfield',
        state: 'IL',
        postalCode: '12345',
        country: 'United States',
        isMilitary: false,
      },
    };

    it('renders the title and home address fields', () => {
      const { container, getByText } = render(
        <SchemaForm
          name="homeAddress"
          title={homeAddressPage.title}
          schema={homeAddressPage.schema}
          uiSchema={homeAddressPage.uiSchema}
          data={{}}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );

      getByText('Primary home address');
      expect($('va-checkbox', container).getAttribute('label')).to.eq(
        'I live on a U.S. military base outside of the United States.',
      );
      expect($('va-select[name="root_homeAddress_country"]', container)).to
        .exist;
      expect($('va-text-input[name="root_homeAddress_street"]', container)).to
        .exist;
      expect($('va-text-input[name="root_homeAddress_street2"]', container)).to
        .exist;
      expect($('va-text-input[name="root_homeAddress_city"]', container)).to
        .exist;
      expect($('va-text-input[name="root_homeAddress_state"]', container)).to
        .exist;
      expect($('va-text-input[name="root_homeAddress_postalCode"]', container))
        .to.exist;
    });

    it('verifies values from the form data are populating the page', () => {
      const { container } = render(
        <SchemaForm
          name="homeAddress"
          title={homeAddressPage.title}
          schema={homeAddressPage.schema}
          uiSchema={homeAddressPage.uiSchema}
          data={data}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );

      expect($('va-checkbox', container).getAttribute('checked')).to.eq(
        'false',
      );
      expect(
        $('va-select[name="root_homeAddress_country"]', container).getAttribute(
          'value',
        ),
      ).to.eq(data.homeAddress.country);
      expect(
        $(
          'va-text-input[name="root_homeAddress_street"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.street);
      expect(
        $(
          'va-text-input[name="root_homeAddress_street2"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.street2);
      expect(
        $(
          'va-text-input[name="root_homeAddress_city"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.city);
      expect(
        $(
          'va-text-input[name="root_homeAddress_state"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.state);
      expect(
        $(
          'va-text-input[name="root_homeAddress_postalCode"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.postalCode);
    });
  });

  context('when isMilitary is true', () => {
    const data = {
      homeAddress: {
        street: '123 Main St',
        street2: '',
        city: 'APO',
        state: 'AA',
        postalCode: '34010',
        country: 'United States',
        isMilitary: true,
      },
    };

    it('verifies values from the form data are populating the page when isMilitary is true', () => {
      const { container } = render(
        <SchemaForm
          name="homeAddress"
          title={homeAddressPage.title}
          schema={homeAddressPage.schema}
          uiSchema={homeAddressPage.uiSchema}
          data={data}
          onChange={() => {}}
          onSubmit={() => {}}
        />,
      );

      expect($('va-checkbox', container).getAttribute('checked')).to.eq('true');
      expect(
        $('va-select[name="root_homeAddress_country"]', container).getAttribute(
          'value',
        ),
      ).to.eq(data.homeAddress.country);
      expect(
        $(
          'va-text-input[name="root_homeAddress_street"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.street);
      expect(
        $(
          'va-text-input[name="root_homeAddress_street2"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.street2);
      expect(
        $(
          'va-text-input[name="root_homeAddress_city"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.city);
      expect(
        $(
          'va-text-input[name="root_homeAddress_state"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.state);
      expect(
        $(
          'va-text-input[name="root_homeAddress_postalCode"]',
          container,
        ).getAttribute('value'),
      ).to.eq(data.homeAddress.postalCode);
    });
  });
});
