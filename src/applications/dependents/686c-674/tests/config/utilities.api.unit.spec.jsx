import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
  networkError,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import {
  isClientError,
  isServerError,
  getData,
  checkAddingDependentsNot674ForPension,
  checkAdding674ForPension,
  showPensionBackupPath,
  isVetInReceiptOfPension,
  showPensionRelatedQuestions,
  show674IncomeQuestions,
  shouldShowStudentIncomeQuestions,
} from '../../config/utilities/api';

describe('Utilities', () => {
  it('parses client errors', () => {
    expect(isClientError(500)).to.be.false;
    expect(isClientError(400)).to.be.true;
  });

  it('parses server errors', () => {
    expect(isServerError(500)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });
});

describe('getData', () => {
  it('should succeed', async () => {
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/some/api-route`, () =>
        jsonResponse({ data: { attributes: { name: 'John' } } }),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.eql({ name: 'John' });
  });

  it('should fail', async () => {
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/some/api-route`,
        networkError(),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.throw;
  });
});

describe('isServerError', () => {
  it('should return true for server errors (5xx)', () => {
    expect(isServerError('500')).to.be.true;
    expect(isServerError('501')).to.be.true;
    expect(isServerError('599')).to.be.true;
  });

  it('should return false for non-server errors', () => {
    expect(isServerError('400')).to.be.false;
    expect(isServerError('200')).to.be.false;
    expect(isServerError('404')).to.be.false;
  });
});

describe('isClientError', () => {
  it('should return true for client errors (4xx)', () => {
    expect(isClientError('400')).to.be.true;
    expect(isClientError('404')).to.be.true;
    expect(isClientError('499')).to.be.true;
  });

  it('should return false for non-client errors', () => {
    expect(isClientError('500')).to.be.false;
    expect(isClientError('200')).to.be.false;
    expect(isClientError('201')).to.be.false;
  });
});

describe('checkAddingDependentsNot674ForPension', () => {
  it('should return false if not adding dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return true if adding dependents outside of 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addSpouse: true, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return false if not adding dependents outside of 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
      'view:addDependentOptions': { addSpouse: false, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return false if only adding 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addSpouse: false, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return true when adding child', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addChild: true, report674: false },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return true when adding disabled child', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addDisabledChild: true, report674: false },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return false with empty form data', () => {
    expect(checkAddingDependentsNot674ForPension({})).to.be.undefined;
  });

  it('should return false with undefined form data', () => {
    expect(checkAddingDependentsNot674ForPension()).to.be.undefined;
  });
});

describe('checkAdding674ForPension', () => {
  it('should return true when adding 674 dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { report674: true, addSpouse: false },
    };
    expect(checkAdding674ForPension(formData)).to.be.true;
  });

  it('should return false if not adding dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
      'view:addDependentOptions': { report674: true },
    };
    expect(checkAdding674ForPension(formData)).to.be.false;
  });

  it('should return false if report674 is false', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { report674: false, addSpouse: true },
    };
    expect(checkAdding674ForPension(formData)).to.be.false;
  });

  it('should return false with empty form data', () => {
    expect(checkAdding674ForPension({})).to.be.undefined;
  });

  it('should return false with undefined form data', () => {
    expect(checkAdding674ForPension()).to.be.undefined;
  });

  it('should return true when adding 674 along with other dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': {
        report674: true,
        addSpouse: true,
        addChild: true,
      },
    };
    expect(checkAdding674ForPension(formData)).to.be.true;
  });
});

describe('isVetInReceiptOfPension', () => {
  it('should return true when isInReceiptOfPension is 1', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: 1 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.true;
  });

  it('should return false when isInReceiptOfPension is 0', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: 0 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });

  it('should return true when isInReceiptOfPension is -1 and backup path indicates pension', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
      'view:checkVeteranPension': true,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.true;
  });

  it('should return false when isInReceiptOfPension is -1 and backup path indicates no pension', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
      'view:checkVeteranPension': false,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });

  it('should return false when isInReceiptOfPension is -1 and no backup path data', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.undefined;
  });

  it('should return false with empty form data', () => {
    expect(isVetInReceiptOfPension({})).to.be.false;
  });

  it('should return false with undefined form data', () => {
    expect(isVetInReceiptOfPension()).to.be.false;
  });

  it('should return false when veteranInformation is missing', () => {
    const formData = {
      'view:checkVeteranPension': true,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });
});

describe('showPensionBackupPath', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return false', () => {
      expect(showPensionBackupPath({ vaDependentsNetWorthAndPension: false }))
        .to.be.false;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when adding dependents - not 674', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: false },
          }),
        ).to.be.true;
      });

      it('should return false if isInReceiptOfPension is not -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: false },
          }),
        ).to.be.false;
      });

      it('should return true when adding child and isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addChild: true, report674: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding disabled child and isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': {
              addDisabledChild: true,
              report674: false,
            },
          }),
        ).to.be.true;
      });
    });

    describe('when adding dependents - 674 only', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: false, report674: true },
          }),
        ).to.be.true;
      });

      it('should return false if isInReceiptOfPension is not -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: false, report674: true },
          }),
        ).to.be.false;
      });
    });

    describe('when adding both 674 and non-674 dependents', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: true },
          }),
        ).to.be.true;
      });
    });

    describe('edge cases', () => {
      it('should return false with empty form data', () => {
        expect(showPensionBackupPath({})).to.be.undefined;
      });

      it('should return false with undefined form data', () => {
        expect(showPensionBackupPath()).to.be.undefined;
      });

      it('should return false when not adding any dependents', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: false, remove: true },
            'view:addDependentOptions': { addSpouse: false, report674: false },
          }),
        ).to.be.false;
      });
    });
  });
});

describe('show674IncomeQuestions', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return true', () => {
      expect(show674IncomeQuestions({ vaDependentsNetWorthAndPension: false }))
        .to.be.true;
    });

    it('should return true with undefined form data', () => {
      expect(show674IncomeQuestions()).to.be.true;
    });

    it('should return true with empty form data', () => {
      expect(show674IncomeQuestions({})).to.be.true;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when veteran is in receipt of pension', () => {
      it('should return true when adding 674 and veteran has pension (isInReceiptOfPension = 1)', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding 674 and backup path indicates pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': true,
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding 674 along with other dependents and veteran has pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: true },
          }),
        ).to.be.true;
      });
    });

    describe('when veteran is not in receipt of pension', () => {
      it('should return false when adding 674 but veteran not in receipt of pension (isInReceiptOfPension = 0)', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 0 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.false;
      });

      it('should return false when adding 674 but backup path indicates no pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': false,
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.false;
      });
    });

    describe('when not adding 674 dependents', () => {
      it('should return false when not adding 674 even if veteran has pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: false, addSpouse: true },
          }),
        ).to.be.false;
      });

      it('should return false when only adding non-674 dependents', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': {
              report674: false,
              addChild: true,
              addDisabledChild: true,
            },
          }),
        ).to.be.false;
      });
    });

    describe('when not adding any dependents', () => {
      it('should return false when not adding dependents at all', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: false, remove: true },
            'view:addDependentOptions': { report674: true },
          }),
        ).to.be.false;
      });
    });

    describe('edge cases', () => {
      it('should return false with empty form data when feature flag is on', () => {
        expect(show674IncomeQuestions({ vaDependentsNetWorthAndPension: true }))
          .to.be.undefined;
      });

      it('should return false when veteranInformation is missing', () => {
        expect(
          show674IncomeQuestions({
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true },
          }),
        ).to.be.false;
      });

      it('should return false when addDependentOptions is missing', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
          }),
        ).to.be.undefined;
      });
    });
  });
});

describe('showPensionRelatedQuestions', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return true', () => {
      expect(
        showPensionRelatedQuestions({ vaDependentsNetWorthAndPension: false }),
      ).to.be.true;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when backup path is shown (no prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return true if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return false if isInReceiptOfPension is 0', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 0 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });

        it('should return true if isInReceiptOfPension is 1', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 1 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return false if isInReceiptOfPension is 0', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 0 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });

        it('should return true if isInReceiptOfPension is 1', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 1 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return false if isInReceiptOfPension is 0', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 0 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });

        it('should return true if isInReceiptOfPension is 1', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 1 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });
  });
});

describe('shouldShowStudentIncomeQuestions', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    it('should return true when veteran is in receipt of pension', () => {
      const formData = {
        vaDependentsNetWorthAndPension: true,
        veteranInformation: { isInReceiptOfPension: 1 },
        studentInformation: [{ claimsOrReceivesPension: false }],
        'view:addOrRemoveDependents': { add: true, remove: false },
        'view:addDependentOptions': { addSpouse: false, report674: true },
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.true;
    });

    it('should return false when veteran is not in receipt of pension', () => {
      const formData = {
        vaDependentsNetWorthAndPension: true,
        veteranInformation: { isInReceiptOfPension: 0 },
        studentInformation: [{ claimsOrReceivesPension: true }],
        'view:addOrRemoveDependents': { add: true, remove: false },
        'view:addDependentOptions': { addSpouse: false, report674: true },
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.false;
    });

    it('should return true when backup path is used and veteran indicates pension receipt', () => {
      const formData = {
        vaDependentsNetWorthAndPension: true,
        veteranInformation: { isInReceiptOfPension: -1 },
        'view:checkVeteranPension': true,
        studentInformation: [{ claimsOrReceivesPension: false }],
        'view:addOrRemoveDependents': { add: true, remove: false },
        'view:addDependentOptions': { addSpouse: false, report674: true },
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.true;
    });

    it('should return false when backup path is used and veteran does not indicate pension receipt', () => {
      const formData = {
        vaDependentsNetWorthAndPension: true,
        veteranInformation: { isInReceiptOfPension: -1 },
        'view:checkVeteranPension': false,
        studentInformation: [{ claimsOrReceivesPension: true }],
        'view:addOrRemoveDependents': { add: true, remove: false },
        'view:addDependentOptions': { addSpouse: false, report674: true },
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.false;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return true when student claims or receives pension', () => {
      const formData = {
        vaDependentsNetWorthAndPension: false,
        studentInformation: [{ claimsOrReceivesPension: true }],
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.true;
    });

    it('should return false when student does not claim or receive pension', () => {
      const formData = {
        vaDependentsNetWorthAndPension: false,
        studentInformation: [{ claimsOrReceivesPension: false }],
      };
      const result = shouldShowStudentIncomeQuestions({ formData, index: 0 });
      expect(result).to.be.false;
    });

    it('should work with multiple students at different indices', () => {
      const formData = {
        vaDependentsNetWorthAndPension: false,
        studentInformation: [
          { claimsOrReceivesPension: true },
          { claimsOrReceivesPension: false },
          { claimsOrReceivesPension: true },
        ],
      };

      expect(shouldShowStudentIncomeQuestions({ formData, index: 0 })).to.be
        .true;
      expect(shouldShowStudentIncomeQuestions({ formData, index: 1 })).to.be
        .false;
      expect(shouldShowStudentIncomeQuestions({ formData, index: 2 })).to.be
        .true;
    });
  });
});
