const emptyMigration = savedData => savedData;

const movedSpouseDob = savedData => {
  const { formData, metadata } = savedData;
  // Spouse date of birth was moved from /personal-information to the page
  // before /current-legal-name, so if the returnUrl indicates that the in
  // progress is on that page. We can't assume that the birth date is valid
  // so that's why we're including this redirect
  if (metadata.returnUrl?.includes('add-spouse/personal-information')) {
    metadata.returnUrl = '/add-spouse/current-legal-name';
  }
  return { formData, metadata };
};

const migrations = [emptyMigration, movedSpouseDob];

export default migrations;
