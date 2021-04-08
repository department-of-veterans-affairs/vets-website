import add from 'date-fns/add';

class AppointmentData {
  constructor() {
    this.id = 'I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0000';
    this.status = 'booked';
    this.description = 'Scheduled Visit';
    this.start = '2020-11-18T08:00:00Z';
    this.end = '2020-11-18T08:30:00Z';
    this.minutesDuration = 30;
    this.created = '2020-11-02';
    this.comment = 'LS=8/17/20, PID=11/18/20';
    this.status = 'accepted';
    this.resourceType = 'Appointment';
    this.participant = [
      {
        actor: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000',
          display: 'TEM MH PSO TRS IND93EH 2',
        },
        status: 'accepted',
      },
      {
        actor: {
          reference:
            'https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792',
          display: 'Mrs. Sheba703 Harris789',
        },
        status: 'accepted',
      },
    ];
  }

  withStatus(status) {
    this.status = status;
    return this;
  }

  withId(id) {
    this.id = id;
    return this;
  }

  inFuture(days = 1) {
    this.start = add(new Date(), { days });
    return this;
  }

  toString() {
    return JSON.stringify(this);
  }
}

export { AppointmentData };
