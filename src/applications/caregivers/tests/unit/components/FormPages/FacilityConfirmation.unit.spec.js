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

  const goBack = sinon.spy();
  const goForward = sinon.spy();

  const defaultProps = {
    data: {
      'view:plannedClinic': {
        veteranSelected: facilities[0],
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

    const selectors = () => ({
      pageDescription: {
        confirmHeader: getByRole('heading', { level: 3 }),
        veteranSelectedHeader: getByRole('heading', { level: 4 }),
      },
      selectedFacility: {
        name: getByText(new RegExp(selectedFacility.name)),
        address1: getByText(new RegExp(selectedFacilityAddress.address1)),
        address2: getByText(new RegExp(selectedFacilityAddress.address2)),
        address3: getByText(new RegExp(selectedFacilityAddress.address3)),
      },
      formNavButtons: {
        back: getByText('Back'),
        forward: getByText('Continue'),
      },
    });
    return { selectors, getByRole, getByText };
  };

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
    const { selectors, getByText } = subject();
    expect(selectors().pageDescription.confirmHeader).to.have.text(
      'Confirm your health care facilities',
    );
    expect(selectors().pageDescription.veteranSelectedHeader).to.have.text(
      'The Veteran’s Facility you selected',
    );
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
});
