import { expect } from 'chai';
import { generateICS } from './calendar';

describe('VASS calendar utils', () => {
  describe('generateICS', () => {
    const mockStartDate = new Date('2025-11-17T20:00:00Z');
    const mockEndDate = new Date('2025-11-17T20:30:00Z');
    const mockSummary = 'Solid Start Phone Call';
    const mockDescription =
      'Your representative will call you from 8008270611.';

    it('should generate a valid ICS file', () => {
      const ics = generateICS(
        mockSummary,
        mockDescription,
        mockStartDate,
        mockEndDate,
      );

      expect(ics).to.be.a('string');
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('END:VCALENDAR');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain(`SUMMARY:${mockSummary}`);
      expect(ics).to.contain(`DESCRIPTION:${mockDescription}`);
      expect(ics).to.contain('LOCATION:Phone call');
      expect(ics).to.contain('DTSTART:');
      expect(ics).to.contain('DTEND:');
      expect(ics).to.contain('DTSTAMP:');
      expect(ics).to.contain('UID:');
    });

    it('should handle empty description', () => {
      const ics = generateICS(mockSummary, '', mockStartDate, mockEndDate);

      expect(ics).to.contain('DESCRIPTION:');
    });

    it('should truncate long descriptions to 74 characters', () => {
      const longDescription =
        'This is a very long description that exceeds the 74 character limit for ICS files and should be truncated';
      const ics = generateICS(
        mockSummary,
        longDescription,
        mockStartDate,
        mockEndDate,
      );

      const descriptionLine = ics
        .split('\r\n')
        .find(line => line.startsWith('DESCRIPTION:'));
      expect(descriptionLine.length).to.be.at.most(74);
    });
  });
});
