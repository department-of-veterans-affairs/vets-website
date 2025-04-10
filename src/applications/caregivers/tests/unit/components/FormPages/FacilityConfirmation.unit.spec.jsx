import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityConfirmation, {
  reviewModeRoutes,
} from '../../../../components/FormPages/FacilityConfirmation';

describe('CG <FacilityConfirmation>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const selectedFacility = facilities[0];
  const caregiverFacility = facilities[1];

  const goBack = sinon.spy();
  const goForward = sinon.spy();
  const goToPath = sinon.spy();

  const subject = ({
    selected = selectedFacility,
    assigned = caregiverFacility,
  } = {}) => {
    const props = {
      data: {
        'view:plannedClinic': {
          veteranSelected: selected !== null ? selected : null,
          caregiverSupport: assigned !== null ? assigned : null,
        },
      },
      goBack,
      goForward,
      goToPath,
    };
    const { queryByText } = render(<FacilityConfirmation {...props} />);
    const selectors = () => ({
      backBtn: queryByText('Back'),
      continueBtn: queryByText('Continue'),
    });
    return { selectors, queryByText };
  };

  afterEach(() => {
    goBack.reset();
    goForward.reset();
    goToPath.reset();
  });

  context('when the page renders in the normal form flow', () => {
    it('should render the selected facility name and address when data is provied', () => {
      const { queryByText } = subject();
      const address = selectedFacility.address.physical;
      expect(queryByText(new RegExp(selectedFacility.name))).to.exist;
      expect(queryByText(new RegExp(address.address1))).to.exist;
      expect(queryByText(new RegExp(address.address2))).to.exist;
      expect(queryByText(new RegExp(address.address3))).to.exist;
    });

    it('should render the assigned support facility name and address when data is provided', () => {
      const { queryByText } = subject();
      const address = caregiverFacility.address.physical;
      expect(queryByText(new RegExp(caregiverFacility.name))).to.exist;
      expect(queryByText(new RegExp(address.address1))).to.exist;
      expect(queryByText(new RegExp(address.address2))).to.exist;
      expect(queryByText(new RegExp(address.address3))).to.exist;
    });

    it('should render just the facility name when address is omitted from facility data', () => {
      const { queryByText } = subject({
        assigned: { ...caregiverFacility, address: undefined },
      });
      const address = caregiverFacility.address.physical;
      expect(queryByText(new RegExp(caregiverFacility.name))).to.exist;
      expect(queryByText(new RegExp(address.address1))).to.not.exist;
      expect(queryByText(new RegExp(address.address2))).to.not.exist;
      expect(queryByText(new RegExp(address.address3))).to.not.exist;
    });

    it('should call `goBack` when the Back button is clicked', () => {
      const { selectors } = subject();
      userEvent.click(selectors().backBtn);
      expect(goBack.calledOnce).to.be.true;
    });

    it('should call `goForward` when the Continue button is clicked', () => {
      const { selectors } = subject();
      userEvent.click(selectors().continueBtn);
      expect(goForward.calledOnce).to.be.true;
    });
  });

  context('when the page renders in review mode', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { search: '?review=true' },
        configurable: true,
      });
    });

    it('should call `goToPath` with the correct route when the Back button is clicked', () => {
      const { selectors } = subject();
      userEvent.click(selectors().backBtn);
      expect(goToPath.calledWith(reviewModeRoutes.back)).to.be.true;
    });

    it('should call `goToPath` with the correct route when the Continue button is clicked', () => {
      const { selectors } = subject();
      userEvent.click(selectors().continueBtn);
      expect(goToPath.calledWith(reviewModeRoutes.forward)).to.be.true;
    });
  });

  context('when the page renders outside of the normal form flow', () => {
    it('should gracefully render without any facility data', () => {
      const { queryByText } = subject({ selected: null, assigned: null });
      expect(queryByText(new RegExp(selectedFacility.name))).to.not.exist;
      expect(queryByText(new RegExp(caregiverFacility.name))).to.not.exist;
    });
  });
});
