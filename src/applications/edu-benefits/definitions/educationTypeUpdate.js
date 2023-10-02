const educationTypeLabelsUpdate = {
  college:
    'College, university, or other educational program, including online courses',
  correspondence: 'Correspondence',
  apprenticeship: 'Apprenticeship or on-the-job training',
  flightTraining: 'Vocational flight training',
  testReimbursement: 'National test reimbursement (for example, SAT or CLEP)',
  licensingReimbursement:
    'Licensing or certification test reimbursement (for example, MCSE, CCNA, EMT, or NCLEX)',
  farmCoop: 'Farm cooperative',
  prepCourseForLoC:
    'Preparatory (PREP) Course for Licensing or Certification Test',
};

const uiSchemaUpdate = {
  'ui:title': 'Type of education or training',
  'ui:options': {
    labels: educationTypeLabelsUpdate,
  },
};

export default uiSchemaUpdate;
