import { expect } from 'chai';
import {
  getEnabledQuestions,
  checkFormResult,
  checkFormComplete,
  checkFormStatus,
} from './questionLogic';

const questionState = [
  {
    id: 'sample1',
    text: 'this is question sample1 text',
  },
  {
    id: 'sample2',
    text: 'this is question sample2 text',
    enabled: false,
  },
  {
    id: 'sample3',
    text: 'this is question sample3 text',
    enabled: true,
  },
  {
    id: 'sampleCustom123',
    text: 'this is a sample custom question for id 123',
    customId: [123],
  },
  {
    id: 'sampleCustom555',
    text: 'this is a sample custom question for id 555',
    customId: [555],
  },
];

describe('coronavirus-screener', () => {
  describe('questionLogic', () => {
    it('gets enabled questions', () => {
      const enabledQuestions = getEnabledQuestions({ questionState });
      expect(enabledQuestions.length).to.equal(2);
      expect(enabledQuestions[0].id).to.equal('sample1');
      expect(enabledQuestions[1].id).to.equal('sample3');
    });
    it('gets enabled custom questions', () => {
      const enabledQuestions = getEnabledQuestions({
        questionState,
        customId: 123,
      });
      expect(enabledQuestions.length).to.equal(3);
      expect(enabledQuestions[0].id).to.equal('sample1');
      expect(enabledQuestions[1].id).to.equal('sample3');
      expect(enabledQuestions[2].id).to.equal('sampleCustom123');
    });
  });
});
