import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import VideoLayoutAtlas from './VideoLayoutAtlas';
import { selectIsAtlasVideo } from '../../appointment-list/redux/selectors';
import VideoLayoutVA from './VideoLayoutVA';

export default function VideoLayout({ appointment }) {
  const isAtlasVideo = useSelector(() => selectIsAtlasVideo(appointment));

  if (isAtlasVideo) return <VideoLayoutAtlas data={appointment} />;

  return <VideoLayoutVA data={appointment} />;
}
VideoLayout.propTypes = {
  appointment: PropTypes.object,
};
