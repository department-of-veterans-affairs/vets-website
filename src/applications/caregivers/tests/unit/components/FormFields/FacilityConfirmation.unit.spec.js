import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import FacilityConfirmation from '../../../../components/FormFields/FacilityConfirmation';
import { mockLightHouseFacilitiesResponseWithTransformedAddresses } from '../../../mocks/responses';

describe('CG <FacilityConfirmation>', () => {
  const facilities =
    mockLightHouseFacilitiesResponseWithTransformedAddresses.data;

  const selectedFacility = facilities[0];
  const preferredFacility = facilities[1];

  const getData = () => ({
    mockStore: {
      getState: () => ({
        form: {
          data: {
            veteranPreferredFacility: 'my-facility-id',
            'view:selectedFacilityAddressData': selectedFacility,
            'view:preferredFacilityAddressData': preferredFacility,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  const subject = () => {
    const { mockStore } = getData();
    const { getByText, getByRole } = render(
      <Provider store={mockStore}>
        <FacilityConfirmation />
      </Provider>,
    );
    const selectedFacilityAddress =
      selectedFacility.attributes.address.physical;
    const selectors = () => ({
      descriptionText: {
        header3: getByRole('heading', {
          level: 3,
          name: 'Confirm your health care facilities',
        }),
        header4: getByRole('heading', {
          level: 4,
          name: "The Veteran's Facility you selected",
        }),
        paragraph: getByText(
          'This is the facility where you told us the Veteran receives or plans to receive treatment.',
        ),
      },
      selectedFacility: {
        name: getByText(new RegExp(selectedFacility.attributes.name)),
        address1: getByText(new RegExp(selectedFacilityAddress.address1)),
        address2: getByText(new RegExp(selectedFacilityAddress.address2)),
        address3: getByText(new RegExp(selectedFacilityAddress.address3)),
      },
    });
    return { selectors };
  };

  it('renders selected facility description text', () => {
    const { selectors } = subject();
    expect(selectors().descriptionText.header3).to.exist;
    expect(selectors().descriptionText.header4).to.exist;
    expect(selectors().descriptionText.paragraph).to.exist;
  });

  it('should render veteran selected facility name', () => {
    const { selectors } = subject();
    expect(selectors().selectedFacility.name).to.exist;
  });

  it('should render veteran selected facility address', () => {
    const { selectors } = subject();

    expect(selectors().selectedFacility.address1).to.exist;
    expect(selectors().selectedFacility.address2).to.exist;
    expect(selectors().selectedFacility.address3).to.exist;
  });
});
