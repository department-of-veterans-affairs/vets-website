import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { mockFetchFacilitiesResponse } from '../../mocks/fetchFacility';
import FacilityAddress from '../../../components/FacilityAddress';

describe('CG <FacilityAddress>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const facility = facilities[0];

  const subject = ({ facility: facilityProp = facility } = {}) => {
    const { queryByText } = render(<FacilityAddress facility={facilityProp} />);
    return { queryByText };
  };

  it('should render the facility name and address when data is provided', () => {
    const { queryByText } = subject();
    const address = facility.address.physical;
    expect(queryByText(new RegExp(facility.name))).to.exist;
    expect(queryByText(new RegExp(address.address1))).to.exist;
    expect(queryByText(new RegExp(address.address2))).to.exist;
    expect(queryByText(new RegExp(address.address3))).to.exist;
  });

  it('should render just the facility name when address is omitted from facility data', () => {
    const { queryByText } = subject({
      facility: { ...facility, address: undefined },
    });
    const address = facility.address.physical;
    expect(queryByText(new RegExp(facility.name))).to.exist;
    expect(queryByText(new RegExp(address.address1))).to.not.exist;
    expect(queryByText(new RegExp(address.address2))).to.not.exist;
    expect(queryByText(new RegExp(address.address3))).to.not.exist;
  });

  it('should gracefully render without any facility data', () => {
    const { queryByText } = subject({ facility: null });
    expect(queryByText(new RegExp(facility.name))).to.not.exist;
  });
});
