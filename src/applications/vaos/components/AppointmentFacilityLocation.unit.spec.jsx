import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentFacilityLocation from './AppointmentFacilityLocation';

describe('AppointmentFacilityLocation', () => {
  it('should render location name when provided', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    expect(getByText('Community Medical Center')).to.exist;
  });

  it('should show "Facility name not available" when location name is missing', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationName={null}
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    expect(getByText('Facility name not available')).to.exist;
  });

  it('should show "Facility name not available" when location name is undefined', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    expect(getByText('Facility name not available')).to.exist;
  });

  it('should render ProviderAddress when location address is provided', () => {
    const { container } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    // ProviderAddress component should be rendered
    expect(container.querySelector('[data-testid="address-block"]')).to.exist;
  });

  it('should show "Address not available" when location address is missing', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={null}
        locationPhone="555-123-4567"
      />,
    );

    expect(getByText('Address not available')).to.exist;
  });

  it('should show "Address not available" when location address is undefined', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationPhone="555-123-4567"
      />,
    );

    expect(getByText('Address not available')).to.exist;
  });

  it('should render FacilityPhone component with location phone when provided', () => {
    const { container } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    // FacilityPhone component should be rendered (as clinic phone when location phone is provided)
    expect(container.querySelector('[data-testid="clinic-telephone"]')).to
      .exist;
  });

  it('should render FacilityPhone component even when location phone is missing', () => {
    const { container } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
      />,
    );

    // FacilityPhone component should still be rendered (will show VA 800 number)
    expect(container.querySelector('[data-testid="main-telephone"]')).to.exist;
  });

  it('should use location name for directions when provided', () => {
    const { container } = render(
      <AppointmentFacilityLocation
        locationName="Community Medical Center"
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    // Check that ProviderAddress is rendered with showDirections (directions link should exist)
    expect(container.querySelector('[data-testid="directions-link"]')).to.exist;
  });

  it('should use "Facility" as directions name when location name is not provided', () => {
    const { container } = render(
      <AppointmentFacilityLocation
        locationAddress={{
          street: '123 Main St',
          city: 'Springfield',
          state: 'MA',
          zipCode: '01101',
        }}
        locationPhone="555-123-4567"
      />,
    );

    // ProviderAddress should be rendered with "Facility" as fallback name in directions link
    const directionsLink = container.querySelector(
      '[data-testid="directions-link"]',
    );
    expect(directionsLink).to.exist;
    expect(directionsLink.getAttribute('aria-label')).to.include('Facility');
  });

  it('should handle all props being null or undefined gracefully', () => {
    const { getByText } = render(
      <AppointmentFacilityLocation
        locationName={null}
        locationAddress={null}
        locationPhone={null}
      />,
    );

    expect(getByText('Facility name not available')).to.exist;
    expect(getByText('Address not available')).to.exist;
  });
});
