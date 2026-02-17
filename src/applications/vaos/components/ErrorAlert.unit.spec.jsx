import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ErrorAlert from './ErrorAlert';
import * as selectors from '../appointment-list/redux/selectors';
import { renderWithStoreAndRouter } from '../tests/mocks/setup';
import {
  AVS_ERROR_RETRIEVAL,
  AVS_ERROR_EMPTY_BINARY,
} from '../utils/constants';

describe('ErrorAlert', () => {
  let selectAppointmentTravelClaimStub;

  const initialState = {
    featureToggles: {
      vaOnlineSchedulingAddOhAvs: true,
    },
  };

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

    const { getByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
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

    const { getByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
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

    const { getByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
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

    const { queryByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
    expect(queryByTestId('avs-claim-error-content')).to.not.exist;
    expect(queryByTestId('avs-error-content')).to.not.exist;
    expect(queryByTestId('claim-error-content')).to.not.exist;
  });

  it('should display avs error when has retrieval errors and claimData is successful', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          noteType: 'ambulatory_patient_summary',
          error: AVS_ERROR_RETRIEVAL,
        },
      ],
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: true,
      },
    });

    const { getByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
    expect(getByTestId('avs-error-content')).to.exist;
  });

  it('should display both errors when has retrieval errors and claimData is unsuccessful', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          noteType: 'ambulatory_patient_summary',
          error: AVS_ERROR_RETRIEVAL,
        },
      ],
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: false,
      },
    });

    const { getByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
    expect(getByTestId('avs-claim-error-content')).to.exist;
  });

  it('should NOT display avs error when only empty binary errors present', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          noteType: 'ambulatory_patient_summary',
          error: AVS_ERROR_EMPTY_BINARY,
        },
      ],
    };
    selectAppointmentTravelClaimStub.returns({
      metadata: {
        success: true,
      },
    });

    const { queryByTestId } = renderWithStoreAndRouter(
      <ErrorAlert appointment={appointment} />,
      { initialState },
    );
    expect(queryByTestId('avs-error-content')).to.not.exist;
    expect(queryByTestId('avs-claim-error-content')).to.not.exist;
    expect(queryByTestId('claim-error-content')).to.not.exist;
  });
});
