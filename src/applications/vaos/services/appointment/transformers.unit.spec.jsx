import { expect } from 'chai';
import sinon from 'sinon';

import MockAppointmentResponse from '../../tests/fixtures/MockAppointmentResponse';
import { getAppointmentType, getAppointmentTimezone } from './transformers';
import * as timezoneUtils from '../../utils/timezone';

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

describe('getAppointmentTimezone util', () => {
  let getTimezoneByFacilityIdStub;

  beforeEach(() => {
    getTimezoneByFacilityIdStub = sinon
      .stub(timezoneUtils, 'getTimezoneByFacilityId')
      .returns('America/Chicago');
  });

  afterEach(() => {
    getTimezoneByFacilityIdStub.restore();
  });

  it('should return appointment timezone when available', () => {
    const appointment = {
      locationId: '123',
      location: {
        attributes: {
          timezone: {
            timeZoneId: 'America/Los_Angeles',
          },
        },
      },
    };

    const result = getAppointmentTimezone(appointment);
    expect(result).to.equal('America/Los_Angeles');
    expect(getTimezoneByFacilityIdStub.called).to.be.false;
  });

  it('should return null and fallback when timezone is GMT', () => {
    const appointment = {
      locationId: '456',
      location: {
        attributes: {
          timezone: {
            timeZoneId: 'GMT',
          },
        },
      },
    };

    const result = getAppointmentTimezone(appointment);
    expect(result).to.equal('America/Chicago');
    expect(getTimezoneByFacilityIdStub.calledWith('456')).to.be.true;
  });

  it('should return null and fallback when timezone is UTC', () => {
    const appointment = {
      locationId: '789',
      location: {
        attributes: {
          timezone: {
            timeZoneId: 'UTC',
          },
        },
      },
    };

    const result = getAppointmentTimezone(appointment);
    expect(result).to.equal('America/Chicago');
    expect(getTimezoneByFacilityIdStub.calledWith('789')).to.be.true;
  });

  it('should fallback to facility timezone when appointment timezone is unavailable', () => {
    const appointment = {
      locationId: '999',
      location: {
        attributes: {},
      },
    };

    const result = getAppointmentTimezone(appointment);
    expect(result).to.equal('America/Chicago');
    expect(getTimezoneByFacilityIdStub.calledWith('999')).to.be.true;
  });

  it('should pass featureUseBrowserTimezone to getTimezoneByFacilityId', () => {
    const appointment = {
      locationId: '555',
      location: {
        attributes: {
          timezone: {
            timeZoneId: 'UTC',
          },
        },
      },
    };

    const result = getAppointmentTimezone(appointment, true);
    expect(result).to.equal('America/Chicago');
    expect(getTimezoneByFacilityIdStub.calledWith('555', true)).to.be.true;
  });

  it('should handle missing location attribute gracefully', () => {
    const appointment = {
      locationId: '111',
    };

    const result = getAppointmentTimezone(appointment);
    expect(result).to.equal('America/Chicago');
    expect(getTimezoneByFacilityIdStub.calledWith('111')).to.be.true;
  });
});

describe('VAOS <transformVAOSAppointment>', () => {
  it('should set modality fields for claim exams', async () => {
    // Arrange
    const response = MockAppointmentResponse.createCEResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
    const response = MockAppointmentResponse.createPhoneResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
    const response = MockAppointmentResponse.createCovidResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
    const response = MockAppointmentResponse.createVAResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
  it('should set modality fields for video at home appointments', async () => {
    // Arrange
    const response = MockAppointmentResponse.createMobileResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
    const response = MockAppointmentResponse.createAtlasResponse({
      localStartTime: new Date(),
    });

    // Act
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
    const a = MockAppointmentResponse.getTransformedResponse(response);

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
