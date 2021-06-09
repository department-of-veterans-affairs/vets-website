import React from 'react';
import withFeatureFlip from '../containers/withFeatureFlip.jsx';

const Landing = ({ router }) => {
  router.push('/some-token/insurance');
  return <></>;
};

export default withFeatureFlip(Landing);
