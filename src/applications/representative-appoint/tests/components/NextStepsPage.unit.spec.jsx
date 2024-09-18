import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import NextStepsPage from '../../containers/NextStepsPage';

const getData = ({
  formData = {
    'view:selectedRepresentative': {
      type: 'organization',
      fullName: 'Brian Daniel',
      name: 'Disabled American Veterans',
      addressLine1: '400 South 18th Street',
      addressLine2: 'Room 119',
      addressLine3: '',
      city: 'Newark',
      stateCode: 'NJ',
      zipCode: '07102',
      phone: '7026842997',
      email: 'bdaniel@veterans.nj.gov',
      attributes: {
        accreditedOrganizations: {
          data: [
            {
              id: '1',
              attributes: { name: 'Disabled American Veterans' },
            },
          ],
        },
      },
    },
    selectedAccreditedOrganizationId: '1',
    repTypeRadio: 'Attorney',
  },
} = {}) => ({
  props: {},
  mockStore: {
    getState: () => ({
      form: {
        data: formData,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('NextStepsPage', () => {
  it('should render with correct heading and text', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <NextStepsPage {...props} />
      </Provider>,
    );

    expect($('h1', container).textContent).to.contain(
      'Fill out your form to appoint a VA accredited representative or VSO',
    );
    expect($('h2', container).textContent).to.contain('Your next steps');
    expect($('p', container).textContent).to.contain(
      'Both you and the accredited attorney will need to sign your form.',
    );
  });

  it('should render the AddressBlock with correct data', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <NextStepsPage {...props} />
      </Provider>,
    );

    expect($('.va-address-block', container).textContent).to.contain(
      'Brian Daniel',
    );
    expect($('.va-address-block', container).textContent).to.contain(
      'Disabled American Veterans',
    );
    expect($('.va-address-block', container).textContent).to.contain(
      '400 South 18th Street',
    );
    expect($('.va-address-block', container).textContent).to.contain(
      'Newark, NJ 07102',
    );
  });

  it('should display representative type correctly as lowercase', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <NextStepsPage {...props} />
      </Provider>,
    );

    expect($('p', container).textContent).to.contain('attorney');
  });

  it('should render the ContactCard with correct representative info', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <NextStepsPage {...props} />
      </Provider>,
    );

    expect($('.va-contact-card', container).textContent).to.contain(
      'Brian Daniel',
    );
    expect($('.va-contact-card', container).textContent).to.contain(
      '7026842997',
    );
    expect($('.va-contact-card', container).textContent).to.contain(
      'bdaniel@veterans.nj.gov',
    );
  });

  it('should render the NeedHelp component with phone numbers', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <NextStepsPage {...props} />
      </Provider>,
    );

    expect($('va-telephone[contact="8006982411"]', container)).to.exist;
    expect($('va-telephone[contact="711"]', container)).to.exist;
  });
});
