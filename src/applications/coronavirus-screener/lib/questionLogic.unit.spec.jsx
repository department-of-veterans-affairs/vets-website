import { expect } from 'chai';
import { getEnabledQuestions, updateEnabledQuestions } from './questionLogic';

describe('coronavirus-screener', () => {
  describe('questionLogic', () => {
    describe('getEnabledQuestions', () => {
      it('gets enabled questions', () => {
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
        ];
        const enabledQuestions = getEnabledQuestions({ questionState });
        expect(enabledQuestions.length).to.equal(2);
        expect(enabledQuestions[0].id).to.equal('sample1');
        expect(enabledQuestions[1].id).to.equal('sample3');
      });
    });

    describe('updateEnabledQuestions()', () => {
      it('updates question status using dependsOn', () => {
        const questionState = [
          {
            id: 'sample1',
            text: 'this is question sample1 text',
          },
          {
            id: 'sampleDependencyQuestion',
            text: 'this is a sample question that other questions depend on',
            value: 'yes',
          },
          {
            id: 'sampleDependantQuestionEnabled',
            text:
              'this is a sample question that depends on another question that should be enabled',
            dependsOn: {
              id: 'sampleDependencyQuestion',
              value: 'yes',
            },
          },
          {
            id: 'sampleDependantQuestionDisabled',
            text:
              'this is a sample question that depends on another question that should be disabled',
            dependsOn: {
              id: 'sampleDependencyQuestion',
              value: 'no',
            },
          },
        ];

        const newQuestionState = updateEnabledQuestions({ questionState });
        expect(newQuestionState[0].id).to.equal('sample1');
        expect(newQuestionState[1].id).to.equal('sampleDependencyQuestion');
        expect(newQuestionState[2].enabled).to.equal(true);
        expect(newQuestionState[3].enabled).to.equal(false);
      });

      it('updates question status using customId', () => {
        const questionState = [
          {
            id: 'sample1',
            text: 'this is question sample1 text',
          },
          {
            id: 'sampleCustom123',
            text: 'this is a sample custom question for id 123',
            customId: ['123'],
          },
          {
            id: 'sampleCustom555',
            text: 'this is a sample custom question for id 555',
            customId: ['555'],
          },
        ];

        const newQuestionState = updateEnabledQuestions({
          questionState,
          customId: '123',
        });
        expect(newQuestionState[0].id).to.equal('sample1');
        expect(newQuestionState[1].id).to.equal('sampleCustom123');
        expect(newQuestionState[1].enabled).to.equal(true);
        expect(newQuestionState[2].enabled).to.equal(false);
      });
    });
  });
});
