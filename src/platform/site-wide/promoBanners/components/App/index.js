// Node modules.
import React, { useState } from 'react';
import PromoBanner from '@department-of-veterans-affairs/component-library/PromoBanner';
import PropTypes from 'prop-types';

const DISMISSED_PROMO_BANNERS_LOCAL_STORAGE_KEY = 'dismissedPromoBanners';

export const App = ({ href, id, text, type }) => {
  // Derive dismissed promo banners.
  const dismissedPromoBannerIDs =
    JSON.parse(
      localStorage.getItem(DISMISSED_PROMO_BANNERS_LOCAL_STORAGE_KEY),
    ) || [];

  // Derive whether the promo banner is dismissed.
  const [isDismissed, setIsDismissed] = useState(
    dismissedPromoBannerIDs.includes(id),
  );

  // On dismiss, add the promo banner to local storage.
  const onClose = () => {
    // Set our state to dismissed.
    setIsDismissed(true);

    // Add the promo banner ID to local storage.
    dismissedPromoBannerIDs.push(id);
    localStorage.setItem(
      DISMISSED_PROMO_BANNERS_LOCAL_STORAGE_KEY,
      JSON.stringify(dismissedPromoBannerIDs),
    );
  };

  // Do not render if the promo banner is dismissed.
  if (isDismissed) {
    return null;
  }

  // Render the promo banner.
  return <PromoBanner onClose={onClose} href={href} text={text} type={type} />;
};

App.propTypes = {
  href: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default App;
