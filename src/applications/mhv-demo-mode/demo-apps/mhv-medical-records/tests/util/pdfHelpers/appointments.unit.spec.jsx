import { expect } from 'chai';
import { generateAppointmentsContent } from '../../../util/pdfHelpers/appointments';
import { NO_INFO_PROVIDED, UNKNOWN } from '../../../util/constants';

describe('generateAppointmentsContent', () => {
  it('should generate content for appointments with complete data', () => {
    const mockRecords = [
      {
        date: 'January 15, 2024',
        appointmentType: 'Primary Care',
        status: 'Confirmed',
        address: ['123 Main St', 'Building A', 'Suite 100'],
        clinicPhone: '555-1234',
        what: 'Annual physical exam',
        clinicName: 'VA Medical Center',
        location: 'Portland VA',
        detailsShared: {
          reason: 'Annual checkup',
          otherDetails: 'No additional details',
        },
      },
    ];

    const result = generateAppointmentsContent(mockRecords);

    expect(result.results.preface).to.equal(
      'Showing 1 appointments, sorted by date',
    );
    expect(result.results.sectionSeparators).to.be.false;
    expect(result.results.items).to.have.lengthOf(1);

    const appointment = result.results.items[0];
    expect(appointment.header).to.equal('January 15, 2024');
    expect(appointment.headerType).to.equal('H4');
    expect(appointment.items).to.have.lengthOf(11);

    // Verify key fields
    expect(appointment.items[0].value).to.equal('Primary Care');
    expect(appointment.items[1].value).to.equal('Confirmed');

    // Verify rich address fields
    expect(appointment.items[2].value).to.deep.equal([
      { value: '123 Main St' },
      { value: 'Building A' },
      { value: 'Suite 100' },
    ]);

    // Verify details shared
    const detailsField = appointment.items[10];
    expect(detailsField.value[0].value).to.equal('Annual checkup');
    expect(detailsField.value[1].value).to.equal('No additional details');
  });

  it('should handle UNKNOWN string address with UNKNOWN fallback', () => {
    const mockRecords = [
      {
        date: 'January 15, 2024',
        appointmentType: 'Primary Care',
        status: 'Confirmed',
        address: UNKNOWN,
        clinicPhone: '555-1234',
        detailsShared: { reason: 'Test', otherDetails: 'Test' },
      },
    ];

    const result = generateAppointmentsContent(mockRecords);
    const appointment = result.results.items[0];

    // Verify Provider field
    expect(appointment.items[2].value).to.deep.equal([{ value: UNKNOWN }]);
    // Verify Who field
    expect(appointment.items[2].value).to.deep.equal([{ value: UNKNOWN }]);
    // Verify Where to attend field
    expect(appointment.items[6].value).to.equal(UNKNOWN);
  });

  it('should handle missing detailsShared with NO_INFO_PROVIDED', () => {
    const mockRecords = [
      {
        date: 'January 15, 2024',
        appointmentType: 'Primary Care',
        status: 'Confirmed',
        address: ['123 Main St'],
        detailsShared: null,
      },
    ];

    const result = generateAppointmentsContent(mockRecords);
    const detailsShared = result.results.items[0].items[10];

    expect(detailsShared.value[0].value).to.equal(NO_INFO_PROVIDED);
    expect(detailsShared.value[1].value).to.equal(NO_INFO_PROVIDED);
  });

  it('should handle multiple appointments', () => {
    const mockRecords = [
      {
        date: 'January 15, 2024',
        appointmentType: 'Primary Care',
        status: 'Confirmed',
        address: ['123 Main St'],
        detailsShared: { reason: 'Test', otherDetails: 'Test' },
      },
      {
        date: 'February 20, 2024',
        appointmentType: 'Specialty Care',
        status: 'Pending',
        address: ['456 Oak Ave'],
        detailsShared: { reason: 'Follow-up', otherDetails: null },
      },
    ];

    const result = generateAppointmentsContent(mockRecords);

    expect(result.results.preface).to.equal(
      'Showing 2 appointments, sorted by date',
    );
    expect(result.results.items).to.have.lengthOf(2);
    expect(result.results.items[0].header).to.equal('January 15, 2024');
    expect(result.results.items[1].header).to.equal('February 20, 2024');
  });

  it('should handle empty records array', () => {
    const result = generateAppointmentsContent([]);

    expect(result.results.preface).to.equal(
      'Showing 0 appointments, sorted by date',
    );
    expect(result.results.items).to.deep.equal([]);
  });
});
