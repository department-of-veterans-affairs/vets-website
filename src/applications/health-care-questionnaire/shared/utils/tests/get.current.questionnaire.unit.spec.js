import { expect } from 'chai';

import { getCurrentQuestionnaire } from '../index';

describe('health care questionnaire -- utils -- get current questionnaire', () => {
  it('window is undefined', () => {
    const questionnaire = getCurrentQuestionnaire(undefined);
    expect(questionnaire).to.be.null;
  });
  it('is in storage', () => {
    const window = {
      sessionStorage: {
        getItem: () =>
          JSON.stringify({ questionnaire: [{ id: 'questionnaire-id-1234' }] }),
      },
    };
    const questionnaire = getCurrentQuestionnaire(window, '67890');
    expect(questionnaire.id).to.equal('questionnaire-id-1234');
  });

  it('id is not found', () => {
    const window = {
      location: {
        search: '',
      },
      sessionStorage: {
        getItem: () => JSON.stringify({}),
      },
    };
    const appointment = getCurrentQuestionnaire(window, '12345');
    expect(appointment).to.be.null;
  });
});
