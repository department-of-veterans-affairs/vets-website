import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityConfirmation from '../../../../components/FormPages/FacilityConfirmation';

describe('CG <FacilityConfirmation>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const selectedFacility = facilities[0];
  const caregiverFacility = facilities[1];

  const goBack = sinon.spy();
  const goForward = sinon.spy();
  const goToPath = sinon.spy();

  const defaultProps = {
    data: {
      'view:plannedClinic': {
        veteranSelected: selectedFacility,
        caregiverSupport: caregiverFacility,
      },
    },
    goBack,
    goForward,
    goToPath,
  };

  const subject = (props = defaultProps) => {
    const { getByText, getByRole } = render(
      <FacilityConfirmation {...props} />,
    );

    const selectors = () => ({
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
    goToPath.reset();
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

    context('review mode', () => {
      beforeEach(() => {
        global.window.location = { search: '?review=true' };
      });

      it('calls goToPath to facility search on back click', () => {
        const { selectors } = subject();
        userEvent.click(selectors().formNavButtons.back);
        expect(
          goToPath.calledWith(
            '/veteran-information/va-medical-center/locator?review=true',
          ),
        ).to.be.true;
      });

      it('calls goToPath callback to review page on forward click', () => {
        const { selectors } = subject();
        userEvent.click(selectors().formNavButtons.forward);
        expect(goToPath.calledWith('/review-and-submit')).to.be.true;
      });
    });
  });

  it('should render caregiver facility name and address', () => {
    const { getByText } = subject();
    const caregiverFacilityAddress = caregiverFacility.address.physical;

    expect(getByText(new RegExp(caregiverFacility.name))).to.exist;
    expect(getByText(new RegExp(caregiverFacilityAddress.address1))).to.exist;
    expect(getByText(new RegExp(caregiverFacilityAddress.address2))).to.exist;
    expect(getByText(new RegExp(caregiverFacilityAddress.address3))).to.exist;
  });

  it('should render veteran selected facility name and address', () => {
    const { getByText } = subject();
    const selectedFacilityAddress = selectedFacility.address.physical;

    expect(getByText(new RegExp(selectedFacility.name))).to.exist;
    expect(getByText(new RegExp(selectedFacilityAddress.address1))).to.exist;
    expect(getByText(new RegExp(selectedFacilityAddress.address2))).to.exist;
    expect(getByText(new RegExp(selectedFacilityAddress.address3))).to.exist;
  });
});
