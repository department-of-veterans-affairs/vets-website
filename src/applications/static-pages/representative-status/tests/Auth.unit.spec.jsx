import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Auth } from '../components/States/Auth';

describe('Authenticated state component', () => {
  it('shows loading indicator while loading', () => {
    const mockHookReturn = () => {
      return {
        representative: null,
        isLoading: true,
        error: null,
      };
    };

    const wrapper = mount(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );

    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('renders rep when rep exists', () => {
    const mockHookReturn = () => {
      return {
        representative: {
          id: 174,
          poaType: 'representative',
          concatAddress: '123 Main St Springfield, IL 12345',
          addressLine1: '123 Main St',
          addressLine2: null,
          email: 'rep@example.com',
          addressLine3: null,
          addressType: 'Domestic',
          city: 'Springfield',
          countryName: 'United States',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          stateCode: 'IL',
          zipCode: '12345',
          zipSuffix: '2801',
          phone: '202-861-2700',
          name: 'Bob Smith',
        },
        isLoading: false,
        error: null,
      };
    };

    const wrapper = mount(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );

    expect(wrapper.html()).to.include('Bob Smith');
    wrapper.unmount();
  });

  it('renders email when email exists', () => {
    const mockHookReturn = () => {
      return {
        representative: {
          id: 174,
          poaType: 'representative',
          concatAddress: '123 Main St Springfield, IL 12345',
          addressLine1: '123 Main St',
          addressLine2: null,
          email: 'rep@example.com',
          addressLine3: null,
          addressType: 'Domestic',
          city: 'Springfield',
          countryName: 'United States',
          countryCodeIso3: 'USA',
          province: 'IL',
          internationalPostalCode: null,
          stateCode: 'DC',
          zipCode: '12345',
          zipSuffix: '2801',
          phone: '202-861-2700',
          name: 'Bob Smith',
        },
        isLoading: false,
        error: null,
      };
    };

    const tree = shallow(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );
    const text = tree.text();

    expect(text).to.include('rep@example.com');
    tree.unmount();
  });

  it('renders organization types', () => {
    const mockHookReturn = () => {
      return {
        representative: {
          id: 174,
          poaType: 'organization',
          concatAddress: '123 Main St Springfield, IL 12345',
          addressLine1: '123 Main St',
          addressLine2: null,
          addressLine3: null,
          email: null,
          addressType: 'Domestic',
          city: 'Springfield',
          countryName: 'United States',
          countryCodeIso3: 'USA',
          internationalPostalCode: null,
          stateCode: 'IL',
          zipCode: '12345',
          zipSuffix: '2801',
          phone: '202-861-2700',
          name: 'American Legion',
        },
        isLoading: false,
        error: null,
      };
    };

    const tree = shallow(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );
    const text = tree.text();

    expect(text).to.include('American Legion');
    tree.unmount();
  });

  it('renders authenticated-no-rep state', () => {
    const mockHookReturn = () => {
      return {
        representative: { id: null },
        isLoading: false,
        error: null,
      };
    };

    const wrapper = mount(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );
    expect(wrapper.html()).to.include(
      'You don’t have an accredited representative',
    );
    wrapper.unmount();
  });

  it('renders error state', () => {
    const mockHookReturn = () => {
      return {
        representative: null,
        isLoading: false,
        error: true,
      };
    };

    const wrapper = mount(
      <Auth
        DynamicHeader="h3"
        DynamicSubheader="h4"
        useRepresentativeStatus={mockHookReturn}
      />,
    );
    expect(wrapper.find('va-alert').exists()).to.be.true;
    wrapper.unmount();
  });
});
