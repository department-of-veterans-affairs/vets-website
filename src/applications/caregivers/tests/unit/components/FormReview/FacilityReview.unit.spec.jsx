import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
<<<<<<< HEAD
import { mockFetchFacilitiesResponse } from '../../../mocks/responses';
import FacilityReview from '../../../../components/FormReview/FacilityReview';
=======
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityReview from '../../../../components/FormReview/FacilityReview';
import content from '../../../../locales/en/content.json';
>>>>>>> main

describe('CG <FacilityReview>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const selectedFacility = facilities[0];
<<<<<<< HEAD
  const caregiverFacility = facilities[1];
  const goToPath = sinon.spy();

  const defaultProps = {
    data: {
      'view:plannedClinic': {
        veteranSelected: selectedFacility,
        caregiverSupport: caregiverFacility,
      },
    },
    goToPath,
  };

  const subject = (props = defaultProps) => {
=======
  const assignedFacility = facilities[1];
  const goToPath = sinon.spy();

  const subject = ({
    plannedClinic = {
      veteranSelected: selectedFacility,
      caregiverSupport: assignedFacility,
    },
  } = {}) => {
    const props = {
      data: {
        'view:plannedClinic': plannedClinic,
      },
      goToPath,
    };
>>>>>>> main
    const { queryByText, getByText, container } = render(
      <FacilityReview {...props} />,
    );
    const selectors = () => ({
<<<<<<< HEAD
      selectedFacilityLabel: queryByText('The Veteran’s facility you selected'),
      caregiverFacilityLabel: queryByText(
        'Your assigned caregiver support facility',
=======
      selectedFacilityLabel: queryByText(
        content['facilities-review--selected-row-title'],
      ),
      assignedFacilityLabel: queryByText(
        content['facilities-review--assigned-row-title'],
>>>>>>> main
      ),
      editButton: container.querySelector('va-button[text="Edit"]'),
    });
    return { selectors, getByText };
  };

  afterEach(() => {
    goToPath.reset();
  });

<<<<<<< HEAD
  it('calls goToPath with review query string when clicking edit button', () => {
    const { selectors } = subject();
    userEvent.click(selectors().editButton);

    expect(
      goToPath.calledWith(
        '/veteran-information/va-medical-center/locator?review=true',
      ),
    ).to.be.true;
  });

  context('selected facility does not offer caregiver services', () => {
    it('displays selected facility and parent facility', () => {
      const { getByText, selectors } = subject();
      expect(getByText(new RegExp(selectedFacility.name))).to.exist;
      expect(getByText(new RegExp(selectedFacility.name))).to.exist;

      expect(selectors().selectedFacilityLabel).to.exist;
      expect(selectors().caregiverFacilityLabel).to.exist;
    });
  });

  context('selected facility is the same as caregiver facility', () => {
    const props = {
      data: {
        'view:plannedClinic': {
          veteranSelected: selectedFacility,
          caregiverSupport: selectedFacility,
        },
      },
      goToPath,
    };

    it('only displays the veteran selected facility', () => {
      const { getByText, selectors } = subject(props);

      expect(getByText(new RegExp(selectedFacility.name))).to.exist;
      expect(selectors().selectedFacilityLabel).to.exist;
      expect(selectors().caregiverFacilityLabel).not.to.exist;
    });
=======
  it('should call `goToPath` with review query param when edit button is clicked', () => {
    const expectedPath =
      '/veteran-information/va-medical-center/locator?review=true';
    const { selectors } = subject();
    userEvent.click(selectors().editButton);
    expect(goToPath.calledWith(expectedPath)).to.be.true;
  });

  it('should render selected and assigned facilities when selected facility does not offer caregiver services', () => {
    const { getByText, selectors } = subject();
    const { assignedFacilityLabel, selectedFacilityLabel } = selectors();
    expect(selectedFacilityLabel).to.exist;
    expect(assignedFacilityLabel).to.exist;
    expect(getByText(new RegExp(selectedFacility.name))).to.exist;
    expect(getByText(new RegExp(assignedFacility.name))).to.exist;
  });

  it('should only render selected facility when that facility offers caregiver services', () => {
    const { getByText, selectors } = subject({
      plannedClinic: {
        veteranSelected: selectedFacility,
        caregiverSupport: selectedFacility,
      },
    });
    const { assignedFacilityLabel, selectedFacilityLabel } = selectors();
    expect(getByText(new RegExp(selectedFacility.name))).to.exist;
    expect(selectedFacilityLabel).to.exist;
    expect(assignedFacilityLabel).not.to.exist;
>>>>>>> main
  });
});
