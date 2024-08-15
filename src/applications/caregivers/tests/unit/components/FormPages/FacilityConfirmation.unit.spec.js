import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockLightHouseFacilitiesResponseWithTransformedAddresses } from '../../../mocks/responses';
import FacilityConfirmation from '../../../../components/FormPages/FacilityConfirmation';

describe('CG <FacilityConfirmation>', () => {
  const facilities =
    mockLightHouseFacilitiesResponseWithTransformedAddresses.data;
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
          name: 'The Veteran’s Facility you selected',
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
      formNavButtons: {
        back: getByText('Back'),
        forward: getByText('Continue'),
      },
    });
    return { selectors };
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
