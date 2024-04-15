import { expect } from 'chai';
import sinon from 'sinon';
import lolex from 'lolex';

import { PREPARER_TYPES } from '../../config/constants';
import {
  getMockData,
  getPreparerString,
  getPersonalInformationChapterTitle,
  getNameAndDobPageTitle,
  getNameAndDobPageDescription,
  getIdentityInfoPageTitle,
  getVeteranIdentityInfoPageTitle,
  getLivingSituationChapterTitle,
  validateLivingSituation,
  getContactInfoChapterTitle,
  getMailindAddressPageTitle,
  getPhoneAndEmailPageTitle,
  createPayload,
  parseResponse,
  dateOfDeathValidation,
  powConfinementDateRangeValidation,
  powConfinement2DateRangeValidation,
  statementOfTruthFullNamePath,
  getSubmitterName,
} from '../../helpers';

describe('getMockData', () => {
  it('should return mockData if mockData is truthy and isLocalhost returns true and window.Cypress is falsy', () => {
    const mockData = { key: 'value' };
    const isLocalhost = () => true;
    global.window = { Cypress: undefined };

    const result = getMockData(mockData, isLocalhost);

    expect(result).to.deep.equal(mockData);
  });

  it('should return undefined if mockData is falsy', () => {
    const mockData = null;
    const isLocalhost = () => true;
    global.window = { Cypress: undefined };

    const result = getMockData(mockData, isLocalhost);

    expect(result).to.be.undefined;
  });

  it('should return undefined if isLocalhost returns false', () => {
    const mockData = { key: 'value' };
    const isLocalhost = () => false;
    global.window = { Cypress: undefined };

    const result = getMockData(mockData, isLocalhost);

    expect(result).to.be.undefined;
  });

  it('should return undefined if window.Cypress is truthy', () => {
    const mockData = { key: 'value' };
    const isLocalhost = () => true;
    global.window = { Cypress: 'exists' };

    const result = getMockData(mockData, isLocalhost);

    expect(result).to.be.undefined;
  });
});

describe('getPreparerString()', () => {
  it('returns correct string for preparerType', () => {
    expect(getPreparerString(PREPARER_TYPES.THIRD_PARTY_VETERAN)).to.equal(
      'Veteran’s',
    );
    expect(getPreparerString(PREPARER_TYPES.THIRD_PARTY_NON_VETERAN)).to.equal(
      'Claimant’s',
    );
    expect(getPreparerString(PREPARER_TYPES.VETERAN)).to.equal('Your');
    expect(getPreparerString(PREPARER_TYPES.NON_VETERAN)).to.equal('Your');
  });
});

describe('getPersonalInformationChapterTitle()', () => {
  const titleEnding = 'personal information';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getPersonalInformationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getNameAndDobPageTitle()', () => {
  const titleEnding = 'name and date of birth';

  it('returns correct page-title for preparerType', () => {
    expect(
      getNameAndDobPageTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getNameAndDobPageTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getNameAndDobPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getNameAndDobPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getNameAndDobPageDescription()', () => {
  it('returns correct page-description for preparerType', () => {
    expect(
      getNameAndDobPageDescription({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal('Please provide your information as the Veteran.');
    expect(
      getNameAndDobPageDescription({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal('Please provide your information as the person with the claim.');
    expect(
      getNameAndDobPageDescription({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal('Please provide the Veteran’s information.');
    expect(
      getNameAndDobPageDescription({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(
      'Please provide information on the person with the claim (also called the claimant).',
    );
  });
});

describe('getIdentityInfoPageTitle()', () => {
  const titleEnding = 'identification information';

  it('returns correct page-title for preparerType', () => {
    expect(
      getIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getVeteranIdentityInfoPageTitle()', () => {
  const titleEnding = 'identification information';

  it('returns correct page-title for preparerType', () => {
    expect(
      getVeteranIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getVeteranIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getVeteranIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getVeteranIdentityInfoPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
  });
});

describe('getLivingSituationChapterTitle()', () => {
  const titleEnding = 'living situation';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getLivingSituationChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('validateLivingSituation()', () => {
  let errors;

  beforeEach(() => {
    errors = { livingSituation: { addError: sinon.spy() } };
  });
  it('adds an error if "NONE" is selected with other options', () => {
    const livingSituation = { NONE: true, OTHER: true };
    const fieldsVet = {
      livingSituation,
      preparerType: PREPARER_TYPES.VETERAN,
    };
    const fieldsNonVet = {
      livingSituation,
      preparerType: PREPARER_TYPES.NON_VETERAN,
    };
    const fields3rdPtyVet = {
      livingSituation,
      preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
    };
    const fields3rdPtyNonVet = {
      livingSituation,
      preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    };

    validateLivingSituation(errors, fieldsVet);
    expect(errors.livingSituation.addError.calledOnce).to.be.true;
    expect(
      errors.livingSituation.addError.calledWith(
        'If none of these situations apply to you, unselect the other options you selected',
      ),
    ).to.be.true;
    errors.livingSituation.addError.reset();

    validateLivingSituation(errors, fieldsNonVet);
    expect(errors.livingSituation.addError.calledOnce).to.be.true;
    expect(
      errors.livingSituation.addError.calledWith(
        'If none of these situations apply to you, unselect the other options you selected',
      ),
    ).to.be.true;
    errors.livingSituation.addError.reset();

    validateLivingSituation(errors, fields3rdPtyVet);
    expect(errors.livingSituation.addError.calledOnce).to.be.true;
    expect(
      errors.livingSituation.addError.calledWith(
        'If none of these situations apply to the Veteran, unselect the other options you selected',
      ),
    ).to.be.true;
    errors.livingSituation.addError.reset();

    validateLivingSituation(errors, fields3rdPtyNonVet);
    expect(errors.livingSituation.addError.calledOnce).to.be.true;
    expect(
      errors.livingSituation.addError.calledWith(
        'If none of these situations apply to the Claimant, unselect the other options you selected',
      ),
    ).to.be.true;
    errors.livingSituation.addError.reset();
  });

  it('doesn’t add an error if "NONE" is the only option selected', () => {
    const fields = {
      livingSituation: { NONE: true },
      preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    };

    validateLivingSituation(errors, fields);

    expect(errors.livingSituation.addError.called).to.be.false;
  });

  it('doesn’t add an error if "NONE" is not selected', () => {
    const fields = {
      livingSituation: { OTHER: true },
      preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
    };

    validateLivingSituation(errors, fields);

    expect(errors.livingSituation.addError.called).to.be.false;
  });
});

describe('getContactInfoChapterTitle()', () => {
  const titleEnding = 'contact information';

  it('returns correct chapter-title for preparerType', () => {
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getContactInfoChapterTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getMailindAddressPageTitle()', () => {
  const titleEnding = 'mailing address';

  it('returns correct page-title for preparerType', () => {
    expect(
      getMailindAddressPageTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getMailindAddressPageTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getMailindAddressPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getMailindAddressPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('getPhoneAndEmailPageTitle()', () => {
  const titleEnding = 'phone and email address';

  it('returns correct page-title for preparerType', () => {
    expect(
      getPhoneAndEmailPageTitle({
        preparerType: PREPARER_TYPES.VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getPhoneAndEmailPageTitle({
        preparerType: PREPARER_TYPES.NON_VETERAN,
      }),
    ).to.equal(`Your ${titleEnding}`);
    expect(
      getPhoneAndEmailPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
      }),
    ).to.equal(`Veteran’s ${titleEnding}`);
    expect(
      getPhoneAndEmailPageTitle({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
      }),
    ).to.equal(`Claimant’s ${titleEnding}`);
  });
});

describe('createPayload()', () => {
  let mockFile;
  let formId;

  beforeEach(() => {
    mockFile = new File([''], 'filename');
    formId = '1234';
  });

  it('should create a FormData instance with form_id and file', () => {
    const payload = createPayload(mockFile, formId);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('file')).to.equal(mockFile);
  });

  it('should append password to FormData if provided', () => {
    const password = 'password';
    const payload = createPayload(mockFile, formId, password);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('file')).to.equal(mockFile);
    expect(payload.get('password')).to.equal(password);
  });

  it('should not append password to FormData if not provided', () => {
    const payload = createPayload(mockFile, formId);

    expect(payload.get('form_id')).to.equal(formId);
    expect(payload.get('file')).to.equal(mockFile);
    expect(payload.get('password')).to.be.null;
  });
});

describe('parseResponse', () => {
  let clock;

  beforeEach(() => {
    clock = lolex.install({
      shouldAdvanceTime: true,
      advanceTimeDelta: 20,
      toFake: ['setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate'],
    });

    const ul = document.createElement('ul');
    ul.className = 'schemaform-file-list';
    const li = document.createElement('li');
    li.textContent = 'name';
    ul.appendChild(li);

    document.body.appendChild(ul);
  });

  afterEach(() => {
    if (clock) {
      clock.uninstall();
    }

    document.body.innerHTML = '';
  });

  it('parses the response and focuses the file card', () => {
    const data = {
      attributes: {
        name: 'name',
        confirmationCode: '1234',
      },
    };

    const result = parseResponse({ data });

    expect(result).to.deep.equal({
      name: data.attributes.name,
      confirmationCode: data.attributes.confirmationCode,
    });
  });
});

describe('dateOfDeathValidation()', () => {
  let errors;
  let fields;

  beforeEach(() => {
    errors = {
      veteranDateOfDeath: { addError: sinon.spy() },
    };

    fields = {
      veteranDateOfBirth: '2020-01-01',
      veteranDateOfDeath: '2019-01-01',
    };
  });

  it('adds an error if date of death is before date of birth', () => {
    dateOfDeathValidation(errors, fields);

    expect(errors.veteranDateOfDeath.addError.calledOnce).to.be.true;
    expect(
      errors.veteranDateOfDeath.addError.calledWith(
        'Provide a date that is after the date of birth',
      ),
    ).to.be.true;
  });

  it('doesn’t add an error if date of death is after date of birth', () => {
    fields.veteranDateOfDeath = '2021-01-01';

    dateOfDeathValidation(errors, fields);

    expect(errors.veteranDateOfDeath.addError.called).to.be.false;
  });
});

describe('powConfinementDateRangeValidation()', () => {
  let errors;
  let fields;

  beforeEach(() => {
    errors = {
      powConfinementEndDate: { addError: sinon.spy() },
    };

    fields = {
      powConfinementStartDate: '2020-01-01',
      powConfinementEndDate: '2019-01-01',
    };
  });

  it('adds an error if end date is before start date', () => {
    powConfinementDateRangeValidation(errors, fields);

    expect(errors.powConfinementEndDate.addError.calledOnce).to.be.true;
    expect(
      errors.powConfinementEndDate.addError.calledWith(
        'The end date must be after the start date',
      ),
    ).to.be.true;
  });

  it('doesn’t add an error if end date is after start date', () => {
    fields.powConfinementEndDate = '2021-01-01';

    powConfinementDateRangeValidation(errors, fields);

    expect(errors.powConfinementEndDate.addError.called).to.be.false;
  });
});

describe('powConfinement2DateRangeValidation()', () => {
  let errors;
  let fields;

  beforeEach(() => {
    errors = {
      powConfinement2EndDate: { addError: sinon.spy() },
    };

    fields = {
      powConfinement2StartDate: '2020-01-01',
      powConfinement2EndDate: '2019-01-01',
    };
  });

  it('adds an error if end date is before start date', () => {
    powConfinement2DateRangeValidation(errors, fields);

    expect(errors.powConfinement2EndDate.addError.calledOnce).to.be.true;
    expect(
      errors.powConfinement2EndDate.addError.calledWith(
        'The end date must be after the start date',
      ),
    ).to.be.true;
  });

  it('doesn’t add an error if end date is after start date', () => {
    fields.powConfinement2EndDate = '2021-01-01';

    powConfinement2DateRangeValidation(errors, fields);

    expect(errors.powConfinement2EndDate.addError.called).to.be.false;
  });
});

describe('statementOfTruthFullNamePath()', () => {
  it('returns correct path for preparerType', () => {
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.VETERAN },
      }),
    ).to.equal('veteranFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.NON_VETERAN },
      }),
    ).to.equal('nonVeteranFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN },
      }),
    ).to.equal('thirdPartyFullName');
    expect(
      statementOfTruthFullNamePath({
        formData: { preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN },
      }),
    ).to.equal('thirdPartyFullName');
  });
});

describe('getSubmitterName()', () => {
  it('returns correct name for preparerType', () => {
    expect(
      getSubmitterName({
        preparerType: PREPARER_TYPES.VETERAN,
        veteranFullName: 'veteranName',
      }),
    ).to.equal('veteranName');
    expect(
      getSubmitterName({
        preparerType: PREPARER_TYPES.NON_VETERAN,
        nonVeteranFullName: 'nonVeteranName',
      }),
    ).to.equal('nonVeteranName');
    expect(
      getSubmitterName({
        preparerType: PREPARER_TYPES.THIRD_PARTY_VETERAN,
        thirdPartyFullName: 'thirdPartyName',
      }),
    ).to.equal('thirdPartyName');
    expect(
      getSubmitterName({
        preparerType: PREPARER_TYPES.THIRD_PARTY_NON_VETERAN,
        thirdPartyFullName: 'thirdPartyName',
      }),
    ).to.equal('thirdPartyName');
  });
});
