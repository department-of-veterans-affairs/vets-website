import React from 'react';

import Headline from './ProfileSectionHeadline';

const BlankPageTemplate = () => {
  // const [dummyLoader, setDummyLoader] = React.useState(true);
  // React.useEffect(
  //   () => {
  //     setTimeout(() => setDummyLoader(false), 500);
  //   },
  //   [setDummyLoader],
  // );
  return (
    <>
      <Headline>Blank page template</Headline>

      {/* {dummyLoader && <va-loading-indicator message="Loading..." />}
      {!dummyLoader && <p>This is just a blank page for easy prototyping.</p>} */}
      <p>This is just a blank page for easy prototyping.</p>
    </>
  );
};

BlankPageTemplate.propTypes = {};

export default BlankPageTemplate;
