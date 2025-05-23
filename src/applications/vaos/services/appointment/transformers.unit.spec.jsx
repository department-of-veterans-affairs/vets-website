import { expect } from 'chai';

import { MockAppointment } from '../../tests/fixtures/MockAppointment';
import { getAppointmentType, transformVAOSAppointment } from './transformers';

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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.true;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.true;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.true;
      expect(a.vaos.isInPersonVisit).to.be.true;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
    });
  });
  describe('When modality flag is off', () => {
    const useFeSourceOfTruthModality = false;

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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.true;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.true;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.false;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.true;
      expect(a.vaos.isInPersonVisit).to.be.true;
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
      );

      // Assert
      expect(a.vaos.isCompAndPenAppointment).to.be.false;
      expect(a.vaos.isPhoneAppointment).to.be.false;
      expect(a.vaos.isCOVIDVaccine).to.be.false;
      expect(a.vaos.isInPersonVisit).to.be.true;
    });
  });
});
