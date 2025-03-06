import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ReviewPage from '../../../../components/submit-flow/pages/ReviewPage';
import reducer from '../../../../redux/reducer';

const home = {
  addressLine1: '345 Home Address St.',
  addressLine2: 'Apt. 3B',
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'San Francisco',
  countryName: 'United States',
  countryCodeIso2: 'US',
  countryCodeIso3: 'USA',
  stateCode: 'CA',
  zipCode: '94118',
};

const mockAppt = {
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
};

const practitioner = 'Kenneth J. Bernardo';

const onSubmitSpy = sinon.spy();
const setIsAgreementCheckedSpy = sinon.spy();
const setPageIndexSpy = sinon.spy();
const setYesNoSpy = sinon.spy();

describe('Revew page', () => {
  const getData = ({ homeAddress = home, pract } = {}) => {
    return {
      user: {
        profile: {
          vapContactInfo: {
            residentialAddress: homeAddress,
          },
        },
      },
      travelPay: {
        appointment: {
          isLoading: false,
          error: null,
          data: { ...mockAppt, practitionerName: pract },
        },
        claimSubmission: {
          isSubmitting: false,
          error: null,
          data: null,
        },
      },
    };
  };

  const props = {
    onSubmit: () => onSubmitSpy(),
    isAgreementChecked: false,
    isError: false,
    setIsAgreementChecked: () => setIsAgreementCheckedSpy(),
    setPageIndex: () => setPageIndexSpy(),
    setYesNo: () => setYesNoSpy(),
  };

  it('should render properly with all data', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage {...props} />, {
      initialState: getData(),
      reducers: reducer,
    });

    expect(screen.getByText('Review your travel claim')).to.exist;
    expect(screen.queryByText(/with Kenneth J. Bernardo/i)).to.not.exist;
    expect(screen.getByText(/How you traveled/)).to.exist;
    expect(screen.getByText(/Where you traveled from/)).to.exist;
    expect(screen.getByText(/345 Home Address St./i)).to.exist;
    expect(screen.getByText(/Apt. 3B/i)).to.exist;
    // Check that text from the travel agreement is rendering
    expect(screen.getByText(/I have incurred a cost/i)).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.not.have.attribute('error');

    expect($('va-button-pair')).to.exist;

    await checkbox.__events.vaChange();

    await waitFor(() => {
      expect(setIsAgreementCheckedSpy.called).to.be.true;
    });
  });

  it('should render properly with practitioners if present', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage {...props} />, {
      initialState: getData({ pract: practitioner }),
      reducers: reducer,
    });

    expect(screen.getByText('Review your travel claim')).to.exist;
    expect(screen.getByText(/with Kenneth J. Bernardo/i)).to.exist;
    expect(screen.getByText(/What you’re claiming/i)).to.exist;
    expect(screen.getByText(/What you’re claiming/i)).to.exist;
    expect(screen.getByText(/How you traveled/)).to.exist;
    expect(screen.getByText(/Where you traveled from/)).to.exist;
    expect(screen.getByText(/345 Home Address St./i)).to.exist;
    expect(screen.getByText(/Apt. 3B/i)).to.exist;
    // Check that text from the travel agreement is rendering
    expect(screen.getByText(/I have incurred a cost/i)).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.not.have.attribute('error');

    expect($('va-button-pair')).to.exist;

    await checkbox.__events.vaChange();

    await waitFor(() => {
      expect(setIsAgreementCheckedSpy.called).to.be.true;
    });
  });

  it('should reset page index and answers when start over is pressed', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage {...props} />, {
      initialState: getData(),
      reducers: reducer,
    });

    expect(screen.getByText('Review your travel claim')).to.exist;

    $('va-button-pair').__events.secondaryClick(); // start over
    await waitFor(() => {
      expect(setPageIndexSpy.called).to.be.true;
      expect(setYesNoSpy.called).to.be.true;
    });
  });

  it('should not show the error message if the travel agreement is checked', () => {
    const screen = renderWithStoreAndRouter(
      <ReviewPage {...props} isAgreementChecked />,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect($('va-checkbox[name="accept-agreement"]')).to.have.attribute(
      'checked',
      'true',
    );

    expect($('va-checkbox[name="accept-agreement"]')).to.not.have.attribute(
      'error',
    );

    expect(
      screen.findAllByText(/You must accept the beneficiary travel agreement/i),
    ).to.be.empty;
  });

  it('should render an error if filing without agreeing to terms', async () => {
    const screen = renderWithStoreAndRouter(<ReviewPage {...props} isError />, {
      initialState: getData(),
      reducers: reducer,
    });

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.have.attribute(
      'error',
      'You must accept the beneficiary travel agreement before continuing.',
    );
    expect(
      screen.findAllByText(/You must accept the beneficiary travel agreement/i),
    ).to.exist;
  });
});
