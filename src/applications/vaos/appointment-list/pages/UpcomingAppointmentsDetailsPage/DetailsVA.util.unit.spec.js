import { expect } from 'chai';
import { formatHeader } from './DetailsVA.util';

describe('appointment-list / components / ConfirmedAppointmentDetailsPage / DetailsVA.util', () => {
  it('should return appointment type header as COVID-19 vaccine', () => {
    const appointment = {
      vaos: {
        isCOVIDVaccine: true,
      },
    };
    const header = formatHeader(appointment);
    expect(header).to.equal('COVID-19 vaccine');
  });
  it('should return appointment type header as VA appointment over the phone', () => {
    const appointment = {
      vaos: {
        isPhoneAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    expect(header).to.equal('VA appointment over the phone');
  });
  it('should return appointment type header as Claim exam for past c&p appointment', () => {
    const appointment = {
      status: 'booked',
      vaos: {
        isPastAppointment: true,
        isCompAndPenAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    expect(header).to.equal('Claim exam');
  });
  it('should return appointment type header as Claim exam for cancelled c&p appointment', () => {
    const appointment = {
      status: 'cancelled',
      vaos: {
        isPastAppointment: false,
        isCompAndPenAppointment: true,
      },
    };
    const header = formatHeader(appointment);
    expect(header).to.equal('Claim exam');
  });
  it('should return appointment type header as VA appointment', () => {
    const appointment = {
      status: 'booked',
      vaos: {
        isPhoneAppointment: false,
        isCompAndPenAppointment: false,
      },
    };
    const header = formatHeader(appointment);
    expect(header).to.equal('VA appointment');
  });
});
