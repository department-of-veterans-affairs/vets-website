import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SelectedFacilityInfoAlert from '../../../../components/FormAlerts/SelectedFacilityInfoAlert';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';

describe('CG <SelectedFacilityInfoAlert>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const defaultFacility = facilities[0];

  const subject = ({ facility: facilityProp = defaultFacility } = {}) => {
    const { queryByText } = render(
      <SelectedFacilityInfoAlert facility={facilityProp} />,
    );
    return { queryByText };
  };

  it('should render the alert with the mocked FacilityAddress', () => {
    const { queryByText } = subject({ facility: defaultFacility });
    expect(queryByText(/Your current selection/)).to.exist;
    expect(queryByText(new RegExp(defaultFacility.name))).to.exist;
  });

  it('should not render the alert if facility is null', () => {
    const { queryByText } = subject({ facility: null });
    expect(queryByText(/Your current selection/)).to.not.exist;
    expect(queryByText(new RegExp(defaultFacility.name))).to.not.exist;
  });
});
