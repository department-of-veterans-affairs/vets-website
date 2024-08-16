import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const RemoteStreamAudio = ({ onTimeUpdate }) => {
  const { remoteStream } = useSelector(({ call }) => call);
  const audioElementRef = useRef(null);

  useEffect(
    () => {
      const audioElement = audioElementRef.current;
      if (!audioElement) {
        return;
      }

      audioElement.srcObject = remoteStream;
      audioElement.addEventListener('timeupdate', e =>
        onTimeUpdate(e.target.currentTime),
      );
    },
    [remoteStream, onTimeUpdate],
  );

  return (
    <audio ref={audioElementRef} autoPlay>
      <track kind="captions" />
    </audio>
  );
};

RemoteStreamAudio.propTypes = {
  onTimeUpdate: PropTypes.func.isRequired,
};

export default RemoteStreamAudio;
