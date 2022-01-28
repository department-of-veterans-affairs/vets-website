import React from 'react';

import SubwayMap from './SubwayMap';

const AuthenticatedContent = props => (
  <>
    <SubwayMap {...props} />
  </>
);

export default AuthenticatedContent;
