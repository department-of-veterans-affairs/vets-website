import { expect } from 'chai';

import { sortQuestionnairesByStatus } from '../index';

import { AppointmentData } from '../../../shared/test-data/appointment/factory';
import { QuestionnaireData } from '../../../shared/test-data/questionnaire/factory';
import { QuestionnaireResponseData } from '../../../shared/test-data/questionnaire-response/factory';

import {
  cancelled,
  booked,
  arrived,
} from '../../../shared/constants/appointment.status';

import {
  inProgress,
  completed,
} from '../../../shared/constants/questionnaire.response.status';

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
        appointment: new AppointmentData().withStatus(booked).inFuture(1),
        questionnaire: [
          {
            questionnaireResponse: [new QuestionnaireResponseData()],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(booked).inFuture(2),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(inProgress),
            ],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(booked).inFuture(3),
        questionnaire: [
          {
            questionnaireResponse: [
              new QuestionnaireResponseData().withStatus(completed),
            ],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(cancelled).inFuture(4),
        questionnaire: [
          {
            questionnaireResponse: [new QuestionnaireResponseData()],
          },
        ],
      },
      {
        appointment: new AppointmentData().withStatus(cancelled).inFuture(5),
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

  it('entered in error - mock data', () => {
    const appointment = new AppointmentData().inFuture().withStatus(booked);
    const questionnaire = new QuestionnaireData();
    const questionnaireResponse = new QuestionnaireResponseData().withStatus(
      'entered-in-error',
    );
    questionnaire.questionnaireResponse = [{ ...questionnaireResponse }];
    const data = [
      {
        appointment,
        questionnaire: [{ ...questionnaire }],
      },
    ];

    const result = sortQuestionnairesByStatus(data);

    expect(result.completed).to.exist;
    expect(result.completed.length).to.equal(0);
    expect(result.toDo).to.exist;
    expect(result.toDo.length).to.equal(1);
  });
  describe('todo - filter - appointment is in the past', () => {
    it('appointment in the past with completed questionnaire - shows in completed list', () => {
      const data = [
        {
          appointment: new AppointmentData().withStatus(booked).inPast(10),
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
    it('appointment in the past with not completed questionnaire - does not show', () => {
      const data = [
        {
          appointment: new AppointmentData().withStatus(booked).inPast(10),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(),
              ],
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
    it('3 appointments in the past - one complete, one not shown, one todo', () => {
      const data = [
        {
          appointment: new AppointmentData().withStatus(booked).inPast(10),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(completed),
              ],
            },
          ],
        },
        {
          appointment: new AppointmentData().withStatus(booked).inPast(10),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(),
              ],
            },
          ],
        },
        {
          appointment: new AppointmentData().withStatus(booked).inFuture(10),
          questionnaire: [
            {
              questionnaireResponse: [
                new QuestionnaireResponseData().withStatus(),
              ],
            },
          ],
        },
      ];
      const result = sortQuestionnairesByStatus(data);
      expect(result.completed).to.exist;
      expect(result.toDo).to.exist;
      expect(result.completed.length).to.equal(1);
      expect(result.toDo.length).to.equal(1);
    });
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
          appointment: new AppointmentData().withStatus(cancelled).isToday(),
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
          appointment: new AppointmentData().withStatus(booked).isToday(),
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

    it('appointment is FUTURE and questionnaire is NOT STARTED -- status of arrived -- should be in toDo list', () => {
      const data = [
        {
          appointment: new AppointmentData().withStatus(arrived).isToday(),
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
          appointment: new AppointmentData().withStatus(booked).isToday(),
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
