import { expect } from 'chai';
import sinon from 'sinon';

import { zetaTrack } from '../event-mapper';

describe('zetaTrack', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  it('should call bt("track") with event type and properties', () => {
    zetaTrack({ event: 'cta-button-click', 'button-label': 'Submit' });
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[0]).to.equal('track');
    expect(btStub.firstCall.args[1]).to.equal('cta-button-click');
    expect(btStub.firstCall.args[2]).to.deep.equal({
      buttonLabel: 'Submit',
    });
  });

  it('should convert kebab-case properties to camelCase', () => {
    zetaTrack({
      event: 'test-event',
      'some-property-name': 'value',
      'another-prop': 42,
    });
    expect(btStub.firstCall.args[2]).to.deep.equal({
      somePropertyName: 'value',
      anotherProp: 42,
    });
  });

  it('should exclude internal GA/GTM properties', () => {
    zetaTrack({
      event: 'test',
      eventCallback: () => {},
      eventTimeout: 2000,
      'gtm.uniqueEventId': 123,
      'real-prop': 'keep',
    });
    const props = btStub.firstCall.args[2];
    expect(props).to.deep.equal({ realProp: 'keep' });
  });

  it('should exclude Zeta reserved property names', () => {
    zetaTrack({
      event: 'test',
      status: 'active',
      href: 'http://example.com',
      'real-data': 'keep',
    });
    const props = btStub.firstCall.args[2];
    expect(props).to.not.have.property('status');
    expect(props).to.not.have.property('href');
    expect(props).to.deep.equal({ realData: 'keep' });
  });

  it('should skip dataLayer "clear" pushes', () => {
    zetaTrack({
      'button-label': undefined,
      'event-source': undefined,
    });
    expect(btStub.called).to.be.false;
  });

  it('should skip events without an event property', () => {
    zetaTrack({ 'some-prop': 'value' });
    expect(btStub.called).to.be.false;
  });

  it('should strip null and undefined property values', () => {
    zetaTrack({
      event: 'test',
      'real-prop': 'keep',
      'null-prop': null,
      'undef-prop': undefined,
    });
    const props = btStub.firstCall.args[2];
    expect(props).to.deep.equal({ realProp: 'keep' });
  });

  it('should wire eventCallback to Zeta onComplete setting', () => {
    const callback = sinon.stub();
    zetaTrack({
      event: 'nav-event',
      eventCallback: callback,
    });
    expect(btStub.firstCall.args.length).to.equal(4);
    expect(btStub.firstCall.args[3]).to.have.property('onComplete', callback);
  });

  it('should not throw when bt is not available', () => {
    global.window.bt = undefined;
    expect(() => zetaTrack({ event: 'test' })).to.not.throw();
  });

  it('should fire eventCallback even when bt is not loaded', () => {
    global.window.bt = undefined;
    const callback = sinon.stub();
    zetaTrack({ event: 'test', eventCallback: callback });
    expect(callback.calledOnce).to.be.true;
  });
});
