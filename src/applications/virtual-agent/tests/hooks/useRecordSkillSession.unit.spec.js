import { expect } from 'chai';
import sinon from 'sinon';

import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';

import { renderHook } from '@testing-library/react-hooks';
import useRecordSkillSession from '../../hooks/useRecordSkillSession';

describe('useRecordSkillSession', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('recordSkillSession', () => {
    it('should call recordEvent when a user enters the disability ratings skill', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      const recordEventData = {
        event: 'api_call',
        'api-name': 'Skill Entry',
        'api-status': 'successful',
        topic: 'va_ratings_bot',
      };
      renderHook(() => useRecordSkillSession('va_ratings_bot'));

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
    });
    it('should not call recordEvent when a user is not inside prescription skill', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      renderHook(() => useRecordSkillSession(''));

      expect(recordEventStub.notCalled).to.be.true;
    });
  });
});
