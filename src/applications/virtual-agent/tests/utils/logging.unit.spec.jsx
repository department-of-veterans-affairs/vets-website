import { expect } from 'chai';
import sinon from 'sinon';
import logger from '../../utils/logger';
import { logErrorToDatadog } from '../../utils/logging';

describe('logErrorToDatadog', () => {
  let datadogSpy;

  beforeEach(() => {
    datadogSpy = sinon.spy(logger, 'error');
  });

  afterEach(() => {
    logger.error.restore();
  });

  it('should log error to Datadog when logging is enabled', () => {
    const message = 'Test error message';
    const context = { key: 'value' };

    logErrorToDatadog(true, message, context);

    expect(datadogSpy.calledOnce).to.be.true;
    expect(datadogSpy.calledWith(message, context)).to.be.true;
  });

  it('should not log error to Datadog when logging is disabled', () => {
    const message = 'Test error message';
    const context = { key: 'value' };

    logErrorToDatadog(false, message, context);

    expect(datadogSpy.notCalled).to.be.true;
  });
});
