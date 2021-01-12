import { expect } from 'chai';
import sinon from 'sinon';

import { clearCurrentSession } from '../../../utils';

describe('health care questionnaire -- utils -- clear current id in session storage', () => {
  it('should called removeItem', () => {
    const removeItem = sinon.spy();
    const window = {
      sessionStorage: {
        removeItem,
      },
    };
    clearCurrentSession(window);
    expect(removeItem.called).to.be.true;
    expect(removeItem.calledWith('currentHealthQuestionnaire')).to.be.true;
  });
});
