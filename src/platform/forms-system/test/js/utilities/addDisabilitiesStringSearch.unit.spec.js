import { expect } from 'chai';
import { getDisabilityLabels } from 'applications/disability-benefits/all-claims/content/disabilityLabels';
import sinon from 'sinon';
import {
  exportForTesting,
  fullStringSimilaritySearch,
} from '../../../src/js/utilities/addDisabilitiesStringSearch';

const testDisabilityLabels = Object.values(getDisabilityLabels());

const {
  lcsWrapper,
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
    const expectedScore = 11;
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
    const nodeLcs = sinon
      .stub(lcsWrapper, 'nodeLcsFunction')
      .returns({ length: 9, sequence: ' common s', offset: 7 });
    const userInput = 'acl';
    lcsSingleVsMulti(userInput, testDisabilityLabels.slice(0, 4));
    expect(nodeLcs.called).to.be.true;
    nodeLcs.restore();
  });

  it('should use lcs summed by word if user input is multiple words and return array', () => {
    const userInput = 'acl tear';
    const lcsSumByWordStub = sinon.stub(lcsWrapper, 'lcsByWord').returns(2);
    lcsSingleVsMulti(userInput, testDisabilityLabels.slice(0, 4));
    expect(lcsSumByWordStub.called).to.be.true;
    lcsSumByWordStub.restore();
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
      for (let j = 0; j < actualReturn[i].length; j += 1) {
        expect(
          actualReturn[i][j].score / userInput[i].split(' ').length >=
            THRESHOLD,
        ).to.be.true;
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
        'tinnitus (ringing or hissing in ears)',
        'hearing loss, other than tinnitus',
      ],
      [
        'kidney cancer (renal cancer), right',
        'kidney cancer (renal cancer), left',
        'kidney cancer (renal cancer), bilateral',
        'colorectal cancer or colon cancer',
        'laryngeal cancer (cancer of larynx)',
      ],
    ];
    for (let i = 0; i < userInput.length; i += 1) {
      const actualReturn = fullStringSimilaritySearch(
        userInput[i],
        testDisabilityLabels,
      ).slice(0, 5);
      expect(actualReturn).to.eql(expectedReturn[i]);
    }
  });
});
