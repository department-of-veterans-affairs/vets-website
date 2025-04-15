import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ReplaceAccreditedRepresentative } from '../../components/ReplaceAccreditedRepresentative';

const selectedRep = {
  id: '26789',
  type: 'representative',
  attributes: {
    firstName: 'Bobby',
    lastName: 'Clark',
    fullName: 'Bobby Clark',
    addressLine1: 'Franklin County Service officer',
    addressLine2: '8389 Dinah Shore Blvd',
    addressLine3: null,
    addressType: 'Domestic',
    city: 'Winchester',
    countryName: 'United States',
    countryCodeIso3: 'USA',
    province: 'Tennessee',
    stateCode: 'TN',
    zipCode: '37398',
    email: 'csowin@franklincotn.us',
    phone: '931-967-9322',
    individualType: 'veteran_Service_officer',
    accreditedOrganizations: {
      data: [
        {
          id: '074',
          type: 'organization',
          attributes: {
            name: 'American Legion',
            addressLine1: '1608 K St NW',
            city: 'Washington',
            stateCode: 'DC',
            zipCode: '20006',
            phone: '202-861-2700',
            poaCode: '074',
          },
        },
      ],
    },
  },
};

const oldRep = {
  id: '074',
  type: 'organization',
  attributes: {
    addressLine1: '1608 K St NW',
    addressLine2: null,
    addressLine3: null,
    addressType: 'Domestic',
    city: 'Washington',
    countryName: null,
    countryCodeIso3: null,
    province: null,
    internationalPostalCode: null,
    stateCode: 'DC',
    zipCode: '20006',
    zipSuffix: '2801',
    phone: '202-861-2700',
    type: 'organization',
    name: 'American Legion',
  },
};

const attorney = {
  id: '20087',
  type: 'representative',
  attributes: {
    firstName: 'John',
    lastName: 'Adams',
    fullName: 'John Adams',
    addressLine1: '2342 Main St',
    addressLine2: null,
    addressLine3: null,
    addressType: 'Domestic',
    city: 'Anytown',
    countryName: 'United States',
    countryCodeIso3: 'USA',
    province: 'Connecticut',
    internationalPostalCode: null,
    stateCode: 'CT',
    zipCode: '54837',
    zipSuffix: '2319',
    email: 'attorney@law.com',
    phone: '585-878-0710ext.321',
    individualType: 'attorney',
    accreditedOrganizations: {
      data: [],
    },
  },
};

describe('<ReplaceAccreditedRepresentative>', () => {
  const getProps = ({
    submitted = false,
    setFormData = () => {},
    currentRep = oldRep,
  } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },
        formData: {
          'view:representativeStatus': currentRep, // Add necessary mock data here
          'view:selectedRepresentative': selectedRep, // Add necessary mock data here },
        },
        setFormData,
      },
      mockStore: {
        getState: () => ({
          form: {
            data: {
              'view:representativeStatus': currentRep, // Add necessary mock data here
              'view:selectedRepresentative': selectedRep, // Add necessary mock data here
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <ReplaceAccreditedRepresentative {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should render copy', () => {
    const { props, mockStore } = getProps();
    const { container } = render(
      <Provider store={mockStore}>
        <ReplaceAccreditedRepresentative {...props} />
      </Provider>,
    );

    expect(container.querySelector('h4')).to.contain.text(
      'You’ll replace this current accredited representative:',
    );
    expect(container.querySelector('p')).to.contain.text(
      'You’ll replace your current accredited representative with the new one you’ve selected.',
    );
  });

  it('should render selected rep address', () => {
    const { props, mockStore } = getProps();
    const { container } = render(
      <Provider store={mockStore}>
        <ReplaceAccreditedRepresentative {...props} />
      </Provider>,
    );

    expect(container.querySelector('a')).to.contain.text(
      '1608 K St NWWashington, DC 20006',
    );
  });

  context('when the current rep is an org or VSO', () => {
    it('should render the work with any rep note', () => {
      const { props, mockStore } = getProps();
      const { container } = render(
        <Provider store={mockStore}>
          <ReplaceAccreditedRepresentative {...props} />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="work-with-any-VSO-note"]',
      );

      expect(usedPolicy).to.exist;
    });
  });

  context('when the current rep is an attorney or claims agent', () => {
    it('should not render the work with any rep note', () => {
      const { props, mockStore } = getProps({ currentRep: attorney });
      const { container } = render(
        <Provider store={mockStore}>
          <ReplaceAccreditedRepresentative {...props} />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="work-with-any-VSO-note"]',
      );

      expect(usedPolicy).not.to.exist;
    });
  });
});
