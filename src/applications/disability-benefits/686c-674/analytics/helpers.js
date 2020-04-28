import recordEvent from 'platform/monitoring/record-event';

export const fireAnalytics = (formConfig, form) => {
  recordEvent({
    event: 'disability-21-686c-submission-successful',
    'disability-under18AndUnmarried':
      form.data['view:selectable686Options'].reportMarriageOfChildUnder18,
    'disability-childAttendingSchool':
      form.data['view:selectable686Options']
        .reportChild18OrOlderIsNotAttendingSchool,
    'disability-reportingDivorce':
      form.data['view:selectable686Options'].reportDivorce,
    'disability-stepchildLeftHousehold':
      form.data['view:selectable686Options'].reportStepchildNotInHousehold,
    'disability-deathOfDependent':
      form.data['view:selectable686Options'].reportDeath,
    'disability-marriageOfChild':
      form.data['view:selectable686Options'].reportStepchildNotInHousehold,
    'disability-childStoppedAttendingSchool':
      form.data['view:selectable686Options'].reportStepchildNotInHousehold,
  });

  return form.data;
};
