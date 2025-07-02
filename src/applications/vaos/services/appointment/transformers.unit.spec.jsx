import { expect } from 'chai';

import { MockAppointment } from '../../tests/fixtures/MockAppointment';
import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import { VIDEO_TYPES } from '../../utils/constants';
import { parseApiObject } from '../utils';
import { getAppointmentType, transformVAOSAppointment } from './transformers';

describe('getAppointmentType util', () => {
  it('should return appointment type as ccAppointment', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_APPOINTMENT',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('ccAppointment');
  });

  it('should return appointment type as ccRequest', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_REQUEST',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('ccRequest');
  });

  it('should return appointment type as vaAppointment', async () => {
    const appointment = {
      id: '123',
      type: 'VA',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('vaAppointment');
  });

  it('should return appointment type as vaRequest', async () => {
    const appointment = {
      id: '123',
      type: 'REQUEST',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('request');
  });
});

describe('VAOS <transformVAOSAppointment>', () => {
  it('should set modality fields for claim exams', async () => {
    // Arrange
    const appointment = new MockAppointment();
    appointment.setModality('claimExamAppointment');

    // Act
    const a = transformVAOSAppointment(appointment);

    // Assert
    expect(a.vaos.isCompAndPenAppointment).to.be.true;
    expect(a.vaos.isPhoneAppointment).to.be.false;
    expect(a.vaos.isCOVIDVaccine).to.be.false;
    expect(a.vaos.isInPersonVisit).to.be.true;
    expect(a.vaos.isVideo).to.be.false;
    expect(a.vaos.isVideoAtHome).to.be.false;
    expect(a.vaos.isAtlas).to.be.false;
    expect(a.vaos.isVideoAtVA).to.be.false;
  });
  it('should set modality fields for phone appointments', async () => {
    // Arrange
    const appointment = new MockAppointment();
    appointment.setModality('vaPhone');

    // Act
    const a = transformVAOSAppointment(appointment);

    // Assert
    expect(a.vaos.isCompAndPenAppointment).to.be.false;
    expect(a.vaos.isPhoneAppointment).to.be.true;
    expect(a.vaos.isCOVIDVaccine).to.be.false;
    expect(a.vaos.isInPersonVisit).to.be.false;
    expect(a.vaos.isVideo).to.be.false;
    expect(a.vaos.isVideoAtHome).to.be.false;
    expect(a.vaos.isAtlas).to.be.false;
    expect(a.vaos.isVideoAtVA).to.be.false;
  });
  it('should set modality fields for vaccine appointments', async () => {
    // Arrange
    const appointment = new MockAppointment();
    appointment.setModality('vaInPersonVaccine');

    // Act
    const a = transformVAOSAppointment(appointment);

    // Assert
    expect(a.vaos.isCompAndPenAppointment).to.be.false;
    expect(a.vaos.isPhoneAppointment).to.be.false;
    expect(a.vaos.isCOVIDVaccine).to.be.true;
    expect(a.vaos.isInPersonVisit).to.be.true;
    expect(a.vaos.isVideo).to.be.false;
    expect(a.vaos.isVideoAtHome).to.be.false;
    expect(a.vaos.isAtlas).to.be.false;
    expect(a.vaos.isVideoAtVA).to.be.false;
  });
  it('should set modality fields for in person appointments', async () => {
    // Arrange
    const appointment = new MockAppointment();
    appointment.setModality('vaInPerson');

    // Act
    const a = transformVAOSAppointment(appointment);

    // Assert
    expect(a.vaos.isCompAndPenAppointment).to.be.false;
    expect(a.vaos.isPhoneAppointment).to.be.false;
    expect(a.vaos.isCOVIDVaccine).to.be.false;
    expect(a.vaos.isInPersonVisit).to.be.true;
    expect(a.vaos.isVideo).to.be.false;
    expect(a.vaos.isVideoAtHome).to.be.false;
    expect(a.vaos.isAtlas).to.be.false;
    expect(a.vaos.isVideoAtVA).to.be.false;
  });

  describe('When modality feature flag is on', () => {
    const useFeSourceOfTruthTelehealth = true;

    it('should set modality fields for video at home appointments', async () => {
      // Arrange
      const appointment = new MockAppointment();
      appointment.setModality('vaVideoCareAtHome');

      // Act
      const a = transformVAOSAppointment(
        appointment,
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
      expect(a.vaos.isVideoAtVA).to.be.false;
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
      expect(a.vaos.isVideoAtVA).to.be.false;
    });
    it('should set modality fields for video at VA appointments', async () => {
      // Arrange
      const response = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      });

      // Act
      const a = transformVAOSAppointment(
        parseApiObject({ data: response }),
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
      expect(a.vaos.isVideoAtVA).to.be.true;
    });
  });
  describe('When modality flag is off', () => {
    const useFeSourceOfTruthTelehealth = false;

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
      const a = transformVAOSAppointment(mobile, useFeSourceOfTruthTelehealth);
      const b = transformVAOSAppointment(adhoc, useFeSourceOfTruthTelehealth);

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.true;
      expect(a.vaos.isAtlas).to.be.false;
      expect(a.vaos.isVideoAtVA).to.be.false;

      expect(b.vaos.isCompAndPenAppointment).to.be.false;
      expect(b.vaos.isPhoneAppointment).to.be.false;
      expect(b.vaos.isCOVIDVaccine).to.be.false;
      expect(b.vaos.isInPersonVisit).to.be.false;
      expect(b.vaos.isVideo).to.be.true;
      expect(b.vaos.isVideoAtHome).to.be.true;
      expect(a.vaos.isAtlas).to.be.false;
      expect(a.vaos.isVideoAtVA).to.be.false;
    });
    it('should set modality fields for video at VA appointments', async () => {
      // Arrange
      const mobile = MockAppointmentResponse.createClinicResponse({
        localStartTime: new Date(),
      });
      const storeForward = MockAppointmentResponse.createStoreForwardResponse({
        localStartTime: new Date(),
      });

      // Act
      const a = transformVAOSAppointment(
        parseApiObject({ data: mobile }),
        useFeSourceOfTruthTelehealth,
      );
      const b = transformVAOSAppointment(
        parseApiObject({ data: storeForward }),
        useFeSourceOfTruthTelehealth,
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
      expect(a.vaos.isVideo).to.be.true;
      expect(a.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
      expect(a.vaos.isVideoAtVA).to.be.true;

      expect(b.vaos.isCompAndPenAppointment).to.be.false;
      expect(b.vaos.isPhoneAppointment).to.be.false;
      expect(b.vaos.isCOVIDVaccine).to.be.false;
      expect(b.vaos.isInPersonVisit).to.be.false;
      expect(b.vaos.isVideo).to.be.true;
      expect(b.vaos.isVideoAtHome).to.be.false;
      expect(a.vaos.isAtlas).to.be.false;
      expect(a.vaos.isVideoAtVA).to.be.true;
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
      expect(a.vaos.isVideoAtVA).to.be.false;
    });
  });
});
