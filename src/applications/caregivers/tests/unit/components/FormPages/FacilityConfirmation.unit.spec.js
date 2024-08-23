import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockFetchFacilitiesResponse } from '../../../mocks/responses';
import FacilityConfirmation from '../../../../components/FormPages/FacilityConfirmation';

describe('CG <FacilityConfirmation>', () => {
  const facilities = mockFetchFacilitiesResponse;
  const selectedFacility = facilities[0];
  const caregiverFacility = facilities[1];

  const goBack = sinon.spy();
  const goForward = sinon.spy();

  const defaultProps = {
    data: {
      'view:plannedClinic': {
        veteranSelected: selectedFacility,
        caregiverSupport: caregiverFacility,
      },
    },
    goBack,
    goForward,
  };

  const subject = (props = defaultProps) => {
    const { getByText, getByRole } = render(
      <FacilityConfirmation {...props} />,
    );
    const selectedFacilityAddress = selectedFacility.address.physical;
    const caregiverFacilityAddress = caregiverFacility.address.physical;

    const selectors = () => ({
      selectedFacility: {
        name: getByText(new RegExp(selectedFacility.name)),
        address1: getByText(new RegExp(selectedFacilityAddress.address1)),
        address2: getByText(new RegExp(selectedFacilityAddress.address2)),
        address3: getByText(new RegExp(selectedFacilityAddress.address3)),
      },
      caregiverFacility: {
        name: getByText(new RegExp(caregiverFacility.name)),
        address1: getByText(new RegExp(caregiverFacilityAddress.address1)),
        address2: getByText(new RegExp(caregiverFacilityAddress.address2)),
        address3: getByText(new RegExp(caregiverFacilityAddress.address3)),
      },
      formNavButtons: {
        back: getByText('Back'),
        forward: getByText('Continue'),
      },
    });
    return { selectors, getByRole, getByText };
  };

  afterEach(() => {
    goBack.reset();
    goForward.reset();
  });

  context('formNavButtons', () => {
    it('renders back and forward buttons', () => {
      const { selectors } = subject();
      expect(selectors().formNavButtons.back).to.exist;
      expect(selectors().formNavButtons.forward).to.exist;
    });

    it('calls goBack callback on click', () => {
      const { selectors } = subject();
      userEvent.click(selectors().formNavButtons.back);
      expect(goBack.calledOnce).to.be.true;
    });

    it('calls goForward callback on click', () => {
      const { selectors } = subject();
      userEvent.click(selectors().formNavButtons.forward);
      expect(goForward.calledOnce).to.be.true;
    });
  });

  it('renders selected facility description text', () => {
    const { getByRole, getByText } = subject();
    expect(
      getByRole('heading', {
        level: 3,
        name: /Confirm your health care facilities/i,
      }),
    ).to.be.visible;
    expect(
      getByRole('heading', {
        level: 4,
        name: /The Veteran’s Facility you selected/i,
      }),
    ).to.be.visible;
    expect(
      getByText(
        /This is the facility where you told us the Veteran receives or plans to receive treatment/i,
      ),
    ).to.be.visible;
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

  it('renders caregive facility description text', () => {
    const { getByRole, getByText } = subject();
    expect(
      getByRole('heading', {
        level: 4,
        name: /Your assigned caregiver support facility/i,
      }),
    ).to.be.visible;
    expect(
      getByText(
        /This is the facility we’ve assigned to support you in the application process and has a caregiver support coordinator on staff. The coordinator at this facility will support you through the application process./i,
      ),
    ).to.be.visible;
  });

  it('should render caregiver facility name', () => {
    const { selectors } = subject();
    expect(selectors().caregiverFacility.name).to.exist;
  });

  it('should render caregiver facility address', () => {
    const { selectors } = subject();

    expect(selectors().caregiverFacility.address1).to.exist;
    expect(selectors().caregiverFacility.address2).to.exist;
    expect(selectors().caregiverFacility.address3).to.exist;
  });
});
