import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { mockConstants, renderWithStoreAndRouter } from '../../helpers';
import ResultCard from '../../../containers/search/ResultCard';

const INSTITUTION = {
  name: "AUSTIN'S BEAUTY COLLEGE INC",
  facilityCode: '25008642',
  city: 'CLARKSVILLE',
  state: 'TN',
  country: 'USA',
  accreditationType: 'hybrid',
  studentCount: 28,
  ratingAverage: null,
  ratingCount: 0,
  institutionRating: {
    institutionRatingCount: 200,
    overallAvg: 3.7,
  },
  type: 'FOR PROFIT',
  cautionFlags: [],
  cautionFlag: null,
  studentVeteran: null,
  yr: false,
  campusType: 'Y',
  highestDegree: 'Certificate',
  hbcu: 0,
  menonly: 0,
  womenonly: 0,
  relaffil: null,
  hsi: 0,
  nanti: 0,
  annhi: 0,
  aanapii: 0,
  pbi: 0,
  tribal: 0,
  preferredProvider: true,
  dodBah: 1596,
  bah: 1707,
  latitude: 36.5277607,
  longitude: -87.3588703,
  distance: null,
  accredited: true,
  vetTecProvider: true,
  programCount: null,
  programLengthInHours: null,
  schoolProvider: true,
  employerProvider: false,
  vrrap: null,
};

describe('<ResultCard>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={INSTITUTION} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
  it('should handle checkbox changes for comparison', () => {
    const dispatchAddCompareInstitutionSpy = sinon.spy();
    const dispatchRemoveCompareInstitutionSpy = sinon.spy();
    const screen = renderWithStoreAndRouter(
      <ResultCard
        institution={INSTITUTION}
        dispatchAddCompareInstitution={dispatchAddCompareInstitutionSpy}
        dispatchRemoveCompareInstitution={dispatchRemoveCompareInstitutionSpy}
        key={25008642}
        version={null}
      />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const checkbox = screen.getByRole('checkbox');
    userEvent.click(checkbox);
    expect(dispatchAddCompareInstitutionSpy.called).to.be.false;
  });
  it('should handle institution rating when all properties are present', () => {
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={INSTITUTION} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    expect(screen.getByText('200 veterans rated this institution')).to.exist;
    expect(screen.getByText('3.7 out of 4 overall')).to.exist;
  });
  it('should show Preferred Provider', () => {
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={INSTITUTION} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    expect(screen.getByText('Preferred Provider')).to.exist;
  });
  it('should show Approved programs', () => {
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={INSTITUTION} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    expect(screen.getByText('Approved programs:')).to.exist;
  });
  it('should not show You may be eligible for up to when type is FLIGHT', () => {
    const institution = { ...INSTITUTION, type: 'FLIGHT' };
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={institution} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    expect(screen.queryByText('You may be eligible for up to:')).to.not.exist;
  });
  it('should show You may be eligible for up to when type is not FLIGHT', () => {
    const institution = { ...INSTITUTION, type: 'PUBLIC' };
    const screen = renderWithStoreAndRouter(
      <ResultCard institution={institution} key={25008642} version={null} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    expect(screen.queryByText('You may be eligible for up to:')).to.exist;
  });
});
