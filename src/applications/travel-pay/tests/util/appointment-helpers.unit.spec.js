import MockDate from 'mockdate';
import { expect } from 'chai';
import {
  getPractionerName,
  getTimezoneByFacilityId,
  transformVAOSAppointment,
  isPastAppt,
  getDaysLeft,
} from '../../util/appointment-helpers';

const appointment = require('../fixtures/appointment.json');

describe('getPractionerName', () => {
  it('Correctly generates the pracitioner name as a string', () => {
    const practionersArray = [
      {
        name: { family: 'Last', given: ['First', 'Middle'] },
      },
    ];

    expect(getPractionerName(practionersArray)).to.eq('First Middle Last');
  });
});

describe('getTimezoneByFacilityId', () => {
  it('returns the correct timezone for the facility', () => {
    const timeZone = getTimezoneByFacilityId('983');
    expect(timeZone).to.eq('America/Denver');
  });

  it('returns undefined if the facility ID is not found', () => {
    // Use a made up ID
    const timeZone = getTimezoneByFacilityId('banana');

    expect(timeZone).to.be.undefined;
  });
});

describe('isPastAppt', () => {
  const appt = appointment.data.attributes;
  const videoAppt = { ...appt, kind: 'telehealth' };

  // The date in the appt is "2024-12-30T14:00:00Z"

  afterEach(() => {
    MockDate.reset();
  });

  it('returns true for appointment last month', () => {
    MockDate.set('2025-01-30T15:00:00Z');
    expect(isPastAppt(appt)).to.be.true;
  });

  it('returns false for appointment in the future', () => {
    MockDate.set('2024-12-01T15:00:00Z');
    expect(isPastAppt(appt)).to.be.false;
  });

  it('returns true for clinic appt 2 hours ago', () => {
    MockDate.set('2024-12-30T16:00:00Z');
    expect(isPastAppt(appt)).to.be.true;
  });

  it('returns false for clinic appt 30 minutes ago', () => {
    MockDate.set('2024-12-30T14:30:00Z');
    expect(isPastAppt(appt)).to.be.false;
  });

  it('returns true for video appt 5 hours ago', () => {
    MockDate.set('2024-12-30T19:00:00Z');
    expect(isPastAppt(videoAppt)).to.be.true;
  });

  it('returns false for video appt 2 hours ago', () => {
    MockDate.set('2024-12-30T16:00:00Z');
    expect(isPastAppt(videoAppt)).to.be.false;
  });
});

describe('getDaysLeft', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('returns 10 for a date 20 days ago', () => {
    MockDate.set('2024-06-25T15:00:00Z');
    const actual = getDaysLeft('2024-06-05T14:00:00Z');
    expect(actual).to.eq(10);
  });

  it('returns 30 for an appointment on the day filed', () => {
    MockDate.set('2024-06-25T15:00:00Z');
    const actual = getDaysLeft('2024-06-25T14:00:00Z');
    expect(actual).to.eq(30);
  });

  it('returns 0 for a date more than 30 days ago', () => {
    MockDate.set('2024-06-25T14:00:00Z');
    const actual = getDaysLeft('2024-05-05T14:00:00Z');
    expect(actual).to.eq(0);
  });
});

describe('transformVAOSAppointment', () => {
  const appt = appointment.data.attributes;

  // The date in the appt is "2024-12-30T14:00:00Z"
  afterEach(() => {
    MockDate.reset();
  });

  it('appends all the correct properties, even if null or undefined', () => {
    MockDate.set('2025-01-15T15:00:00Z');
    const transformedAppt = transformVAOSAppointment(appt);

    expect(transformedAppt).to.have.property('isPast');
    expect(transformedAppt.isPast).to.be.true;
    expect(transformedAppt).to.have.property('daysSinceAppt');
    expect(transformedAppt.daysSinceAppt).to.eq(16);
    expect(transformedAppt).to.have.property('isCC');
    expect(transformedAppt.isCC).to.be.false;
    expect(transformedAppt).to.have.property('isAtlas');
    expect(transformedAppt.isAtlas).to.be.false;
    expect(transformedAppt).to.have.property('atlasLocation');
    expect(transformedAppt.atlasLocation).to.be.null;
    expect(transformedAppt).to.have.property('isCompAndPen');
    expect(transformedAppt.isCompAndPen).to.be.false;
    expect(transformedAppt).to.have.property('practitionerName');
    expect(transformedAppt.practitionerName).to.be.undefined;
  });

  it('returns isAtlas:true if Atlas appointment', () => {
    MockDate.set('2025-01-15T15:00:00Z');
    const videoAppt = {
      ...appt,
      kind: 'telehealth',
      telehealth: {
        atlas: {
          sitecode: '123',
          address: {
            streetAddress: '123 Main St.',
            city: 'Anywhere',
            state: 'NY',
            postalCode: '12345',
          },
          latitude: '1',
          longitude: '1',
        },
      },
    };

    const transformedAppt = transformVAOSAppointment(videoAppt);

    expect(transformedAppt.isAtlas).to.be.true;
  });

  it('returns isCC:true if community care appointment ', () => {
    MockDate.set('2025-01-15T15:00:00Z');
    const ccAppt = {
      ...appt,
      kind: 'cc',
    };
    const transformedAppt = transformVAOSAppointment(ccAppt);

    expect(transformedAppt.isCC).to.be.true;
  });

  it('returns isCompAndPen:true for comp and pen appt', () => {
    MockDate.set('2025-01-15T15:00:00Z');

    const compPenAppt = {
      ...appt,
      serviceCategory: [
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
      ],
    };
    const transformedAppt = transformVAOSAppointment(compPenAppt);

    expect(transformedAppt.isCompAndPen).to.be.true;
  });

  it('returns the practioners name as a string if present', () => {
    MockDate.set('2025-01-15T15:00:00Z');
    const practionersAppt = {
      ...appt,
      practitioners: [
        {
          name: { family: 'Last', given: ['First', 'Middle'] },
        },
      ],
    };
    const transformedAppt = transformVAOSAppointment(practionersAppt);

    expect(transformedAppt.practitionerName).to.eq('First Middle Last');
  });

  it('returns isPast:false for a future appt', () => {
    MockDate.set('2024-11-30T16:00:00Z');

    const transformedAppt = transformVAOSAppointment(appt);

    expect(transformedAppt.isPast).to.be.false;
    expect(transformedAppt.daysSinceAppt).to.be.null;
  });
});
