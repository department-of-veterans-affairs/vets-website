import { expect } from 'chai';
import {
  getEnabledQuestions,
  checkFormResult,
  checkFormComplete,
  checkFormStatus,
} from './questionLogic';

const mockQuestions = [
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
];

describe('coronavirus-screener', () => {
  describe('questionLogic', () => {
    it('gets enabled questions', () => {
      const enabledQuestions = getEnabledQuestions(mockQuestions);
      expect(enabledQuestions.length).to.equal(2);
      expect(enabledQuestions[0].id).to.equal('sample1');
      expect(enabledQuestions[1].id).to.equal('sample3');
    });
  });
});
