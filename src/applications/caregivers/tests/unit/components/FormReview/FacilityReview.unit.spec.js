import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockFetchFacilitiesResponse } from '../../../mocks/fetchFacility';
import FacilityReview from '../../../../components/FormReview/FacilityReview';

describe('CG <FacilityReview>', () => {
  const { facilities } = mockFetchFacilitiesResponse;
  const selectedFacility = facilities[0];
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
    const { queryByText, getByText, container } = render(
      <FacilityReview {...props} />,
    );
    const selectors = () => ({
      selectedFacilityLabel: queryByText('The Veteran’s facility you selected'),
      caregiverFacilityLabel: queryByText(
        'Your assigned caregiver support facility',
      ),
      editButton: container.querySelector('va-button[text="Edit"]'),
    });
    return { selectors, getByText };
  };

  afterEach(() => {
    goToPath.reset();
  });

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
  });
});
