import { expect } from 'chai';
import sinon from 'sinon';

import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';

import { renderHook } from '@testing-library/react-hooks';
import useRecordRxSession from '../../hooks/useRecordRxSession';

describe('useRecordRxSession', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('recordRxSession', () => {
    it('should call recordEvent when a user enters the prescription skill', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      const recordEventData = {
        event: 'api_call',
        'api-name': 'Skill Entry',
        'api-status': 'successful',
        topic: 'prescriptions',
      };
      renderHook(() => useRecordRxSession('prescriptions'));

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
    });
    it('should not call recordEvent when a user is not inside prescription skill', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      renderHook(() => useRecordRxSession('false'));

      expect(recordEventStub.notCalled).to.be.true;
    });
  });
});
