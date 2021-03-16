import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../../../utils';

import { AppointmentData } from '../../../../shared/test-data/appointment/factory';
import { QuestionnaireResponseData } from '../../../../shared/test-data/questionnaire-response/factory';
import {
  cancelled,
  booked,
} from '../../../../shared/constants/appointment.status';

import {
  inProgress,
  completed,
} from '../../../../shared/constants/questionnaire.response.status';

import { json } from '../../../../shared/api/mock-data/fhir/full.example.data';

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
    // tests the 6 use cases to be sorted into todo(3), completed(2) and not in the list (1)
    const data = [
      {
        appointment: new AppointmentData().withStatus(booked),
        questionnaire: [
          {
            questionnaireResponse: [new QuestionnaireResponseData()],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(booked),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(inProgress),
            ],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(booked),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(completed),
            ],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(cancelled),
        questionnaire: [
          {
            questionnaireResponse: [new QuestionnaireResponseData()],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(cancelled),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(inProgress),
            ],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(cancelled),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(completed),
            ],
          },
        ],
      },
    ];

    const result = sortQuestionnairesByStatus(data);
    expect(result.completed).to.exist;
    expect(result.completed.length).to.equal(2);
    expect(result.toDo).to.exist;
    expect(result.toDo.length).to.equal(3);
  });

  it('mock data', () => {
    // tests the 6 use cases to be sorted into todo(4), completed(2) and not in the list (1)
    const { data } = json;
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
          appointment: new AppointmentData().withStatus(cancelled),
          questionnaire: [
            {
              questionnaireResponse: [new QuestionnaireResponseData()],
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
          appointment: new AppointmentData().withStatus(cancelled),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(inProgress),
              ],
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
          appointment: new AppointmentData().withStatus(cancelled),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(completed),
              ],
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
          appointment: new AppointmentData().withStatus(booked),
          questionnaire: [
            {
              questionnaireResponse: [new QuestionnaireResponseData()],
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
          appointment: new AppointmentData().withStatus(booked),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(inProgress),
              ],
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
          appointment: new AppointmentData().withStatus(booked),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(completed),
              ],
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
