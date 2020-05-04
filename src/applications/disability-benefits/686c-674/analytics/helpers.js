import recordEvent from 'platform/monitoring/record-event';

export const fireAnalytics = submission => {
  recordEvent({
    event: 'disability-21-686c-submission-successful',
    'disability-claimSpouse': submission['view:selectable686Options'].addSpouse,
    'disability-under18AndUnmarried':
      submission['view:selectable686Options'].addChild,
    'disability-childAttendingSchool':
      submission['view:selectable686Options'].report674,
    'disability-reportingDivorce':
      submission['view:selectable686Options'].reportDivorce,
    'disability-stepchildLeftHousehold':
      submission['view:selectable686Options'].reportStepchildNotInHousehold,
    'disability-deathOfDependent':
      submission['view:selectable686Options'].reportDeath,
    'disability-marriageOfChild':
      submission['view:selectable686Options'].reportMarriageOfChildUnder18,
    'disability-childStoppedAttendingSchool':
      submission['view:selectable686Options']
        .reportChild18OrOlderIsNotAttendingSchool,
  });
};
