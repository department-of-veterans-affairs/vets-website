import { expect } from 'chai';

import { addAppointmentIdToFormId } from '../index';

describe('health care questionnaire -- utils -- create form id from appointment id', () => {
  it('no form id', () => {
    const id = addAppointmentIdToFormId(undefined, undefined, undefined);
    expect(id).to.be.null;
  });

  it('no appointment id -- should still return a form id', () => {
    const formId = 'my-cool-form';
    const id = addAppointmentIdToFormId(formId, undefined);
    expect(id).to.equal(formId);
  });

  it('no questionnaire id -- should still return a form id', () => {
    const formId = 'my-cool-form';
    const id = addAppointmentIdToFormId(formId, 'defined', undefined);
    expect(id).to.equal(formId);
  });

  it('appointment is defined -- should the the whole id', () => {
    const formId = 'my-cool-form';
    const appointmentId = '123';
    const questionnaireId = '789';
    const id = addAppointmentIdToFormId(formId, appointmentId, questionnaireId);
    expect(id).to.equal('my-cool-form_123_789');
  });

  it('no duplication of both ids', () => {
    const formId = 'my-cool-form_123_789';
    const appointmentId = '123';
    const questionnaireId = '789';

    const id = addAppointmentIdToFormId(formId, appointmentId, questionnaireId);
    expect(id).to.equal('my-cool-form_123_789');
  });
});
