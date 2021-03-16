import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../../../utils';

import testData from './data/sort.questionnaire.data.json';

describe('health care questionnaire -- utils -- questionnaire list -- sorting by status --', () => {
  it('undefined data', () => {
    const data = undefined;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.toDo).to.exist;
  });
  it('no data', () => {
    const data = [];
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.toDo).to.exist;
  });
  it('good data', () => {
    const { data } = testData;
    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.completed.length).to.equal(2);
    expect(result.toDo).to.exist;
    expect(result.toDo.length).to.equal(4);
  });
  describe('appointment status use cases --', () => {
    it('appointment is CANCELLED and questionnaire is NOT STARTED -- should not be in the list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'CANCELLED BY CLINIC',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {},
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(0);
      expect(result.toDo.length).to.equal(0);
    });
    it('appointment is CANCELLED and questionnaire is IN PROGRESS -- should the todo list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'CANCELLED BY CLINIC',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {
                status: 'in-progress',
              },
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(0);
      expect(result.toDo.length).to.equal(1);
    });

    it('appointment is CANCELLED and questionnaire is COMPLETED -- should the completed list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'CANCELLED BY CLINIC',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {
                status: 'completed',
              },
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(1);
      expect(result.toDo.length).to.equal(0);
    });

    it('appointment is FUTURE and questionnaire is NOT STARTED -- should be in toDo list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'FUTURE',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {},
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(0);
      expect(result.toDo.length).to.equal(1);
    });

    it('appointment is FUTURE and questionnaire is IN PROGRESS -- should be in toDo list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'FUTURE',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {
                status: 'in-progress',
              },
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(0);
      expect(result.toDo.length).to.equal(1);
    });
    it('appointment is FUTURE and questionnaire is COMPLETED -- should be in completed list', () => {
      const data = [
        {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  currentStatus: 'FUTURE',
                },
              ],
            },
          },
          questionnaire: [
            {
              questionnaireResponse: {
                status: 'completed',
              },
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(1);
      expect(result.toDo.length).to.equal(0);
    });
  });
});
