import React from 'react';
import manifest from '../manifest.json';

const BackToIntroLink = () => (
  <va-link
    href={`${manifest.rootUrl}/introduction`}
    text="Back to introduction page"
  />
);

export default BackToIntroLink;
