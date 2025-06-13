import { expect } from 'chai';

import { MockAppointment } from '../../tests/fixtures/MockAppointment';
import { getAppointmentType, transformVAOSAppointment } from './transformers';
import { VIDEO_TYPES } from '../../utils/constants';

describe('getAppointmentType util', () => {
  it('should return appointment type as request', async () => {
    const appointment = {
      id: 'CERN123',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('request');
  });
  it('should return appointment type as vaAppointment for cerner appointment', async () => {
    const appointment = {
      id: 'CERN123',
      end: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('vaAppointment');
  });
  it('should return appointment type as ccAppointment, useFeSourceOfTruthCC=false', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('ccAppointment');
  });
  it('should return appointment type as ccAppointment, useFeSourceOfTruthCC=true', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_APPOINTMENT',
    };
    const result = getAppointmentType(appointment, true, false);
    expect(result).to.equal('ccAppointment');
  });
  it('should return appointment type as ccRequest, useFeSourceOfTruthCC=false', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      requestedPeriods: [
        {
          start: '2021-08-31T17:00:00Z',
        },
      ],
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('ccRequest');
  });
  it('should return appointment type as ccRequest, useFeSourceOfTruthCC=true', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_REQUEST',
    };
    const result = getAppointmentType(appointment, true, false);
    expect(result).to.equal('ccRequest');
  });
  it('should return appointment type as vaAppointment, useFeSourceOfTruthVA=false', async () => {
    const appointment = {
      id: '123',
      kind: 'clinic',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('vaAppointment');
  });
  it('should return appointment type as vaAppointment, useFeSourceOfTruthVA=true', async () => {
    const appointment = {
      id: '123',
      type: 'VA',
    };
    const result = getAppointmentType(appointment, false, true);
    expect(result).to.equal('vaAppointment');
  });
});

describe('VAOS <transformVAOSAppointment>', () => {
  describe('When modality feature flag is on', () => {
    const useFeSourceOfTruthModality = true;
    const useFeSourceOfTruthTelehealth = true;

    it('should set modality fields for claim exams', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('claimExamAppointment');

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.true;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for phone appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaPhone');

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.true;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for vaccine appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaInPersonVaccine');

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.true;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for in person appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaInPerson');

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for video at home appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaVideoCareAtHome');

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.true;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for video at ATLAS appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaVideoCareAtAnAtlasLocation');
      appointment.telehealth = {
        atlas: {
          siteCode: 'VFW-DC-20011-01',
          confirmationCode: '271631',
          address: {
            streetAddress: '5929 Georgia Ave NW',
            city: 'Washington',
            state: 'DC',
            zipCode: '20011',
            country: 'USA',
            latitutde: 38.96198,
            longitude: -77.02791,
            additionalDetails: '',
          },
        },
      };

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.true;
    });
  });
  describe('When modality flag is off', () => {
    const useFeSourceOfTruthModality = false;
    const useFeSourceOfTruthTelehealth = false;

    it('should set modality fields for claim exams', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.serviceCategory = [
        {
          coding: [
            {
              system: 'http://www.va.gov/Terminology/VistADefinedTerms/409_1',
              code: 'COMPENSATION & PENSION',
              display: 'COMPENSATION & PENSION',
            },
          ],
          text: 'COMPENSATION & PENSION',
        },
      ];

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.true;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for phone appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.kind = 'phone';

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.true;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for vaccine appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.serviceType = 'covid';

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.true;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for in person appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
      expect(a.vaos.isVideo).to.be.false;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for video at home appointments', async () => {
      // Arrange
      const mobile = new MockAppointment();
      mobile.kind = 'telehealth';
      mobile.telehealth = {
        vvsKind: VIDEO_TYPES.mobile,
      };
      const adhoc = new MockAppointment();
      adhoc.kind = 'telehealth';
      adhoc.telehealth = {
        vvsKind: VIDEO_TYPES.adhoc,
      };

      // Act
      const a = transformVAOSAppointment(
        mobile,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );
      const b = transformVAOSAppointment(
        adhoc,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.true;
      expect(a.vaos.isAtlas).to.be.false;

      expect(b.vaos.isCompAndPenAppointment).to.be.false;
      expect(b.vaos.isPhoneAppointment).to.be.false;
      expect(b.vaos.isCOVIDVaccine).to.be.false;
      expect(b.vaos.isInPersonVisit).to.be.false;
      expect(b.vaos.isVideo).to.be.true;
      expect(b.vaos.isVideoAtHome).to.be.true;
      expect(a.vaos.isAtlas).to.be.false;
    });
    it('should set modality fields for video at ATLAS appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.kind = 'telehealth';
      appointment.telehealth = {
        vvsKind: VIDEO_TYPES.adhoc,
        atlas: {
          siteCode: 'VFW-DC-20011-01',
          confirmationCode: '271631',
          address: {
            streetAddress: '5929 Georgia Ave NW',
            city: 'Washington',
            state: 'DC',
            zipCode: '20011',
            country: 'USA',
            latitutde: 38.96198,
            longitude: -77.02791,
            additionalDetails: '',
          },
        },
      };

      // Act
      const a = transformVAOSAppointment(
        appointment,
        false,
        false,
        false,
        useFeSourceOfTruthModality,
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.true;
    });
  });
});
