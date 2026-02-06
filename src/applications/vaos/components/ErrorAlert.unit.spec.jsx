import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import ErrorAlert from './ErrorAlert';
import * as selectors from '../appointment-list/redux/selectors';

describe('ErrorAlert', () => {
  let selectAppointmentTravelClaimStub;

  beforeEach(() => {
    selectAppointmentTravelClaimStub = sinon.stub(
      selectors,
      'selectAppointmentTravelClaim',
    );
  });

  afterEach(() => {
    selectAppointmentTravelClaimStub.restore();
  });

  it('should display both errors when claimData is unsuccessful and avsError is true', () => {
    const appointment = {
      avsError: 'some/path/Error',
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: false,
      },
    });

    const { getByTestId } = render(<ErrorAlert appointment={appointment} />);
    expect(getByTestId('avs-claim-error-content')).to.exist;
  });

  it('should display travel reimbursement error when claimData is unsuccessful and avsError is false', () => {
    const appointment = {
      avsPath: 'some/path',
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: false,
      },
    });

    const { getByTestId } = render(<ErrorAlert appointment={appointment} />);
    expect(getByTestId('claim-error-content')).to.exist;
  });

  it('should display avs error when claimData is successful and avsError is true', () => {
    const appointment = {
      avsError: 'some/path/Error',
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: true,
      },
    });

    const { getByTestId } = render(<ErrorAlert appointment={appointment} />);
    expect(getByTestId('avs-error-content')).to.exist;
  });

  it('should not display any error when claimData is successful', () => {
    const appointment = {
      avsPath: 'some/path',
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: true,
      },
    });

    const { queryByTestId } = render(<ErrorAlert appointment={appointment} />);
    expect(queryByTestId('avs-claim-error-content')).to.not.exist;
    expect(queryByTestId('avs-error-content')).to.not.exist;
    expect(queryByTestId('claim-error-content')).to.not.exist;
  });
});
