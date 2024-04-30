import { expect } from 'chai';
import { getDisabilityLabels } from 'applications/disability-benefits/all-claims/content/disabilityLabels';
import {
  exportForTesting,
  fullStringSimilaritySearch,
} from '../../../src/js/utilities/cc-string-matching';

const testDisabilityLabels = Object.values(getDisabilityLabels());

const {
  THRESHOLD,
  stripCommonWords,
  lcsScoreByWordSum,
  countOverlapWords,
  substringSearchCountOverlap,
  lcsSingleVsMulti,
} = exportForTesting;

describe('stripCommonWords', () => {
  it('should remove common words from the middle of a string', () => {
    const testString = 'pain in my left knee';
    const expectedString = 'pain knee';
    expect(stripCommonWords(testString)).to.eql(expectedString);
  });

  it('should remove common words from the ends of a string', () => {
    const testString = 'my left knee hurts, bilateral';
    const expectedString = 'knee hurts,';
    expect(stripCommonWords(testString)).to.eql(expectedString);
  });
});

describe('lcsScoreByWordSum', () => {
  it('should return integer score for similarity', () => {
    const inputString = 'right acl tear in knee';
    const disabilityWord = 'ACL tear (anterior cruciate ligament tear), right';
    const expectedScore = 8;
    const actualScore = lcsScoreByWordSum(inputString, disabilityWord);
    expect(actualScore).to.eql(expectedScore);
    expect(actualScore).to.be.a('number');
  });
});

describe('countOverlapWords', () => {
  it('should return an integer counting unique overlapped words', () => {
    const userInput = 'cancer in kidney';
    const dropdownTerm = 'kidney cancer (renal cell cancer)';
    const expectedOverlap = 2;
    const actualOverlap = countOverlapWords(userInput, dropdownTerm);
    expect(actualOverlap).to.eql(expectedOverlap);
    expect(actualOverlap).to.be.a('number');
  });
});

describe('lcsSingleVsMulti', () => {
  it('should use single word LCS if user input is one word and return array', () => {
    const userInput = 'acl';
    const expectedReturn = [
      {
        score: 3,
        original: 'ACL tear (anterior cruciate ligament tear), right',
      },
      {
        score: 3,
        original: 'ACL tear (anterior cruciate ligament tear), left',
      },
      {
        score: 3,
        original: 'ACL tear (anterior cruciate ligament tear), bilateral',
      },
      { score: 2, original: 'acne' },
    ];
    const actualReturn = lcsSingleVsMulti(
      userInput,
      testDisabilityLabels.slice(0, 4),
    );
    expect(actualReturn).to.eql(expectedReturn);
    expect(actualReturn).to.be.an('array');
  });

  it('should use lcs summed by word if user input is multiple words and return array', () => {
    const userInput = 'acl tear';
    const expectedReturn = [
      {
        score: 11,
        original: 'ACL tear (anterior cruciate ligament tear), right',
      },
      {
        score: 11,
        original: 'ACL tear (anterior cruciate ligament tear), left',
      },
      {
        score: 11,
        original: 'ACL tear (anterior cruciate ligament tear), bilateral',
      },
    ];
    const actualReturn = lcsSingleVsMulti(
      userInput,
      testDisabilityLabels.slice(0, 4),
    );
    expect(actualReturn).to.eql(expectedReturn);
    expect(actualReturn).to.be.an('array');
  });

  it('should not return results with scores less than the threshold', () => {
    const userInput = 'tinnitus hearing';
    const actualReturn = lcsSingleVsMulti(userInput, testDisabilityLabels);
    for (let i = 0; i < actualReturn.length; i += 1) {
      expect(actualReturn[i].score / userInput.length >= THRESHOLD).to.be.true;
    }
  });

  it('should return at most 20 results', () => {
    const testCases = [
      ['r', testDisabilityLabels],
      ['acl tear', testDisabilityLabels],
      ['tinnitus hearing', testDisabilityLabels],
    ];
    for (let i = 0; i < testCases.length; i += 1) {
      const actualReturn = lcsSingleVsMulti(testCases[i][0], testCases[i][1]);
      expect(actualReturn.length <= 20).to.be.true;
    }
  });
});

describe('substringSearchCountOverlap', () => {
  it('returns an array of no more than 20 items', () => {
    const userInput = 'acl tear';
    const actualReturn = substringSearchCountOverlap(
      userInput,
      testDisabilityLabels,
    );
    expect(actualReturn.length <= 20).to.be.true;
    expect(actualReturn).to.be.an('array');
  });
  it('filters scores by being greater than or equal to the userInput length', () => {
    const userInput = ['acl tear', 'tinnitus'];
    const actualReturn = [];
    userInput.forEach(term =>
      actualReturn.push(
        substringSearchCountOverlap(term, testDisabilityLabels),
      ),
    );
    for (let i = 0; i < actualReturn.length; i += 1) {
      for (let j = 0; j < userInput.length; j += 1) {
        expect(actualReturn[i].score >= userInput[j]).to.be.true;
      }
    }
  });
});

describe('fullStringSimilaritySearch', () => {
  it('should return an array of distinct terms with no more than 20 items', () => {
    const userInput = 'acl';
    const actualReturn = fullStringSimilaritySearch(
      userInput,
      testDisabilityLabels,
    );
    const actualReturnSet = new Set(actualReturn);
    expect(actualReturnSet.size).to.eql(actualReturn.length);
    expect(actualReturn.length <= 20).to.be.true;
  });
  it('should return results that start with user input, substring count, then LCS single vs multi', () => {
    const userInput = ['tinnitus', 'kidney cancer'];
    const expectedReturn = [
      [
        'tinnitus (ringing or hissing in the ears)',
        'hearing loss, other than tinnitus',
        'tendonitis (tendinitis) in ankle, right',
      ],
      [
        'kidney cancer (renal cancer)',
        'colorectal cancer or colon cancer',
        'laryngeal cancer',
      ],
    ];
    for (let i = 0; i < userInput.length; i += 1) {
      const actualReturn = fullStringSimilaritySearch(
        userInput[i],
        testDisabilityLabels,
      ).slice(0, 3);
      expect(actualReturn).to.eql(expectedReturn[i]);
    }
  });
});
