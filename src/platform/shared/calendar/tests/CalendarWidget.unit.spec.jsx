import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  addDays,
  addMinutes,
  addMonths,
  addYears,
  format,
  startOfMonth,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import MockDate from 'mockdate';
import React from 'react';
import {
  getAppointmentConflict,
  parseDurationFromSlotId,
} from '../utils/utils';
import { DATE_FORMATS } from '../constants';
import CalendarWidget from '../CalendarWidget';

describe('Shared Component: CalendarWidget', () => {
  it('should render calendar with available slots', () => {
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const availableSlots = [
      {
        id: 'practitioner|uuid|2025-08-06T13:00:00Z|60m0s|timestamp|ov',
        start: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeLocal),
      },
    ];

    const { queryByTestId } = render(
      <CalendarWidget
        id="test-calendar"
        availableSlots={availableSlots}
        value={[]}
        timezone={timezone}
        minDate={nowUTC}
        maxDate={addYears(nowUTC, 1)}
        startMonth={nowUTC}
        onChange={() => {}}
      />,
    );

    expect(queryByTestId('vaos-calendar')).to.exist;
  });

  it('should show validation alert when max selections+1 dates selected for requests', async () => {
    const now = new Date();
    const selectedDates = [
      format(addDays(now, 1), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(now, 2), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(now, 3), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(now, 4), DATE_FORMATS.ISODateTimeLocal),
    ];

    const { queryByText } = render(
      <CalendarWidget
        id="test-calendar"
        maxSelections={3}
        value={selectedDates}
        minDate={now}
        startMonth={now}
        onChange={() => {}}
      />,
    );

    expect(
      queryByText(
        'You can only select 3 times for your appointment. Deselect the 4th time to continue.',
      ),
    ).to.exist;
  });

  it('should show validation alert when max selections+2 or more dates selected for requests', async () => {
    const minDate = new Date();
    const selectedDates = [
      format(addDays(minDate, 1), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(minDate, 2), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(minDate, 3), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(minDate, 4), DATE_FORMATS.ISODateTimeLocal),
      format(addDays(minDate, 5), DATE_FORMATS.ISODateTimeLocal),
    ];

    const { queryByText } = render(
      <CalendarWidget
        id="test-calendar"
        maxSelections={3}
        value={selectedDates}
        minDate={minDate}
        startMonth={minDate}
        onChange={() => {}}
      />,
    );

    expect(
      queryByText(
        'You can only select 3 times for your appointment. Deselect 2 times to continue.',
      ),
    ).to.exist;
  });

  it('should not show calendar when disabled and hideWhileDisabled is true', async () => {
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const availableSlots = [
      {
        start: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        id: 'practitioner|uuid|2025-08-06T13:00:00Z|60m0s|timestamp|ov',
      },
    ];

    const { queryByText, queryByTestId } = render(
      <CalendarWidget
        id="test-calendar"
        availableSlots={availableSlots}
        value={[]}
        timezone={timezone}
        disabled
        hideWhileDisabled
        disabledMessage="Calendar is currently disabled"
        minDate={nowUTC}
        maxDate={addYears(nowUTC, 1)}
        startMonth={nowUTC}
        onChange={() => {}}
      />,
    );

    expect(queryByText('Calendar is currently disabled')).to.exist;
    expect(queryByTestId('vaos-calendar')).to.exist;
    expect(queryByTestId('vaos-calendar')).to.have.class(
      'vads-u-visibility--hidden',
    );
    expect(queryByTestId('vaos-calendar')).to.have.class(
      'vaos-calendar__disabled',
    );
  });

  it('should show calendar when disabled and hideWhileDisabled is false', async () => {
    const timezone = 'America/Denver';
    const nowUTC = startOfMonth(addMonths(new Date(), 1));
    nowUTC.setHours(12, 0, 0, 0);
    const availableSlots = [
      {
        start: formatInTimeZone(nowUTC, 'UTC', DATE_FORMATS.ISODateTimeUTC),
        end: formatInTimeZone(
          addMinutes(nowUTC, 60),
          'UTC',
          DATE_FORMATS.ISODateTimeUTC,
        ),
      },
    ];

    const { queryByText, queryByTestId } = render(
      <CalendarWidget
        id="test-calendar"
        availableSlots={availableSlots}
        value={[]}
        timezone={timezone}
        disabled
        hideWhileDisabled={false}
        disabledMessage="Calendar is currently disabled"
        minDate={nowUTC}
        maxDate={addYears(nowUTC, 1)}
        startMonth={nowUTC}
        onChange={() => {}}
      />,
    );

    expect(queryByText('Calendar is currently disabled')).to.exist;
    expect(queryByTestId('vaos-calendar')).to.exist;
    expect(queryByTestId('vaos-calendar')).not.to.have.class(
      'vads-u-visibility--hidden',
    );
    expect(queryByTestId('vaos-calendar')).to.have.class(
      'vaos-calendar__disabled',
    );
  });
});

describe('CalendarUtils: getAppointmentConflict', () => {
  before(() => {
    MockDate.set('2024-12-05T00:00:00Z');
  });
  after(() => {
    MockDate.reset();
  });
  const appointmentsByMonth = {
    '2024-12': [
      {
        start: '2024-12-06T17:00:00Z',
        startUtc: '2024-12-06T17:00:00Z',
        minutesDuration: 60,
      },
    ],
  };
  const availableSlots = [
    {
      start: '2024-12-06T16:00:00Z',
      end: '2024-12-06T17:00:00Z',
    },
    {
      start: '2024-12-06T17:00:00Z',
      end: '2024-12-06T18:00:00Z',
    },
    {
      start: '2024-12-06T16:30:00Z',
      end: '2024-12-06T17:30:00Z',
    },
  ];
  it('returns false when there is no conflict', () => {
    expect(
      getAppointmentConflict(
        '2024-12-06T16:00:00Z',
        appointmentsByMonth,
        availableSlots,
      ),
    ).to.be.false;
  });
  it('returns true when there is a conflict', () => {
    expect(
      getAppointmentConflict(
        '2024-12-06T17:00:00Z',
        appointmentsByMonth,
        availableSlots,
      ),
    ).to.be.true;
  });
  it('returns true when there is a conflict with overlapping appointment', () => {
    expect(
      getAppointmentConflict(
        '2024-12-06T16:30:00Z',
        appointmentsByMonth,
        availableSlots,
      ),
    ).to.be.true;
  });
});

describe('CalendarUtils: parseDurationFromSlotId', () => {
  describe('valid duration formats', () => {
    it('should parse minutes only format', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|30m0s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(30);
    });

    it('should parse hours only without minutes/seconds', () => {
      const slotId = 'practitioner|uuid|2025-08-06T13:00:00Z|1h|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(60);
    });

    it('should handle complex duration with hours, minutes, and seconds', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|1h15m45s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(76); // 60 + 15 + 1 (rounded up for seconds)
    });

    it('should handle 45-minute appointment', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|45m0s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(45);
    });

    it('should handle 2.5-hour appointment', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|2h30m0s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(150);
    });
  });

  describe('invalid inputs', () => {
    it('should return default duration for null input', () => {
      expect(parseDurationFromSlotId(null)).to.equal(30);
    });

    it('should return default duration for undefined input', () => {
      expect(parseDurationFromSlotId(undefined)).to.equal(30);
    });

    it('should return default duration for empty string', () => {
      expect(parseDurationFromSlotId('')).to.equal(30);
    });

    it('should return default duration for insufficient pipe-separated parts', () => {
      expect(parseDurationFromSlotId('practitioner|uuid|timestamp')).to.equal(
        30,
      );
      expect(parseDurationFromSlotId('practitioner')).to.equal(30);
    });

    it('should return default duration for empty duration part', () => {
      const slotId = 'practitioner|uuid|2025-08-06T13:00:00Z||timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(30);
    });

    it('should return default duration for malformed duration', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|abc123|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(30);
    });
  });

  describe('edge cases', () => {
    it('should return default for zero duration calculation', () => {
      const slotId =
        'practitioner|uuid|2025-08-06T13:00:00Z|0h0m0s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(30);
    });

    it('should handle duration with only seconds', () => {
      const slotId = 'practitioner|uuid|2025-08-06T13:00:00Z|45s|timestamp|ov';
      expect(parseDurationFromSlotId(slotId)).to.equal(1); // rounds up to 1 minute
    });
  });
});
