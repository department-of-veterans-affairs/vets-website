import { expect } from 'chai';

import { addAppointmentIdToFormId } from '../../../utils';

describe('health care questionnaire -- utils -- create form id from appointment id', () => {
  it('no form id', () => {
    const id = addAppointmentIdToFormId(undefined, undefined);
    expect(id).to.be.null;
  });

  it('no appointment id -- should still return a form id', () => {
    const formId = 'my-cool-form';
    const id = addAppointmentIdToFormId(undefined, formId);
    expect(id).to.equal(formId);
  });

  it('appointment is defined -- should the the whole id', () => {
    const formId = 'my-cool-form';
    const appointmentId = '123';
    const id = addAppointmentIdToFormId(appointmentId, formId);
    expect(id).to.equal('my-cool-form-123');
  });

  it('no duplication of appointment id', () => {
    const formId = 'my-cool-form-123';
    const appointmentId = '123';
    const id = addAppointmentIdToFormId(appointmentId, formId);
    expect(id).to.equal('my-cool-form-123');
  });
});
