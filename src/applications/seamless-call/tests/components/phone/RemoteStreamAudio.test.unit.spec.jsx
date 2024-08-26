import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import RemoteStreamAudio from '../../../components/phone/RemoteStreamAudio';
import { renderWithReduxProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import { getAudioElement } from './test-helpers/RemoteStreamAudioTestHelpers';

describe('RemoteStreamAudio', () => {
  const doRender = ({ state = {}, props = {} } = {}) => {
    const testProps = {
      onTimeUpdate: sinon.stub(),
      ...props,
    };
    return renderWithReduxProvider(<RemoteStreamAudio {...testProps} />, {
      state,
    });
  };

  it('renders an audio element attached to the remote stream', () => {
    const remoteStream = {};
    const { view } = doRender({ state: { remoteStream } });

    const audioElement = getAudioElement(view);
    expect(audioElement.srcObject).to.eql(remoteStream);
    expect(audioElement).to.have.attr('autoPlay');
  });

  describe('when the time updates', () => {
    const currentTime = 5;

    beforeEach(() => {
      sinon
        .stub(HTMLAudioElement.prototype, 'addEventListener')
        .withArgs('timeupdate')
        .callsFake((_event, cb) => {
          cb({ target: { currentTime } });
        });
    });

    afterEach(() => {
      HTMLAudioElement.prototype.addEventListener.restore();
    });

    it('invokes the onTimeUpdate callback prop with the current time', () => {
      const onTimeUpdate = sinon.stub();

      doRender({ props: { onTimeUpdate } });

      sinon.assert.calledOnceWithExactly(onTimeUpdate, currentTime);
    });
  });
});
