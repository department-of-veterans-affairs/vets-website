const { createSaveInProgressUpdate } = require('./update');

// const prefill214138 = {
//   formData: {
//     statementType: 'not-listed',
//     fullName: {
//       first: 'John',
//       last: 'Veteran',
//     },
//     emailAddress: 'testing@gmail.com',
//     dateOfBirth: '1980-01-01',
//     idNumber: {
//       ssn: '321540987',
//     },
//     mailingAddress: {
//       country: 'USA',
//       street: '123 Any St',
//       city: 'Anytown',
//       state: 'CA',
//       postalCode: '12345',
//     },
//     phone: '1234567890',
//     statement:
//       'John stood at the towering gates of bureaucracy, a maze of forms and lines that seemed endless. Clutched in his hand was the VA Form 21-4138, a cryptic relic said to grant access to essential benefits. As he stepped forward, he encountered gatekeepers—the clerks—each with riddles to solve and documents to verify. Armed with a pen and a folder filled with proof, he navigated the maze, dodging a storm of paper, crossing the chasm of deadlines, and fighting the dragon of waiting times. In the end, he emerged triumphant, his form stamped with approval, the quest for benefits achieved. The adventure, though arduous, had its reward.',
//   },
//   metadata: {
//     version: 0,
//     prefill: true,
//     returnUrl: '',
//   },
// };

const empty214138 = {
  fullName: {
    first: '',
    middle: '',
    last: '',
  },
  statementType: 'not-listed',
  emailAddress: '',
  dateOfBirth: '',
  idNumber: { ssn: '', vaFileNumber: undefined },
  mailingAddress: {
    country: '',
    street: '',
    street2: undefined,
    city: '',
    state: '',
    postalCode: '',
    militaryBaseDescription: {}, // view:militaryBaseDescription
  },
  phone: '',
  statement: '',
  // additionalInfoStatementType:
  //   {},
  // layOrWitnessContent:
  //   {},
  // decisionReviewContent:
  //   {},
  // noticeOfDisagreementContent:
  //   {},
  // priorityProcessingContent:
  //   {},
  // recordsRequestHandoffContent:
  //   {},
  // newEvidenceHandoffContent:
  //   {},
};

let tempData = {
  ...empty214138,
};

const emptyMetaData = {
  version: 0,
  prefill: true,
};

let tempMetaData = {
  ...emptyMetaData,
};

let formCompleted = false;

const get214138Data = () => {
  return {
    formData: tempData,
    metadata: tempMetaData,
  };
};

const updateTempData = req => {
  const body = req?.body?.formData || {};
  const {
    fullName = tempData.fullName,
    statementType = tempData.statementType,
    emailAddress = tempData.emailAddress,
    dateOfBirth = tempData.dateOfBirth,
    idNumber = tempData.idNumber,
    mailingAddress = tempData.mailingAddress,
    phone = tempData.phone,
    statement = tempData.statement,
  } = body;
  tempData = {
    fullName,
    statementType,
    emailAddress,
    dateOfBirth,
    idNumber,
    mailingAddress,
    phone,
    statement,
  };
};

const updateMetaData = req => {
  tempMetaData = {
    ...tempMetaData,
    returnUrl:
      req?.body?.metadata?.returnUrl ||
      '/veteran-information?noReturnUrlSpecified',
  };
};

const saveInProgress214138 = req => {
  // UpdateProgress gets called one more time after it goes
  // to confirmation page so catch it here so it does not
  // update the payload with old data when you start a new form
  if (formCompleted) {
    // reset and return fake payload
    formCompleted = false;
    return createSaveInProgressUpdate(req);
  }
  updateTempData(req);
  updateMetaData(req);

  return createSaveInProgressUpdate(req);
};

// called for confirmation
const clearInProgressForm214138 = () => {
  tempData = {
    ...empty214138,
  };
  tempMetaData = {
    ...emptyMetaData,
  };
  formCompleted = true;
};

module.exports = {
  get214138Data,
  saveInProgress214138,
  clearInProgressForm214138,
};
