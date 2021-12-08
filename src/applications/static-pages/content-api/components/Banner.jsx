import React, { useState } from 'react';
import { DISMISSED_ANNOUNCEMENTS } from '../constants';

const Banner = ({ banners }) => {
  const [isHidden, setIsHidden] = useState(
    (sessionStorage.getItem(DISMISSED_ANNOUNCEMENTS) || '') !== '',
  );
  return (
    <>
      {banners.map(
        ({ heading, dismissible, alert_type: alertType, text }, index) => {
          const bodyContent = () => {
            return { __html: text };
          };
          return isHidden ? null : (
            <va-alert
              key={index}
              visible
              full-width
              closeable={dismissible === 'dismiss' ? `true` : `false`}
              onClose={() => {
                setIsHidden(true);
                sessionStorage.setItem(DISMISSED_ANNOUNCEMENTS, 'hidden');
              }}
              status={alertType}
            >
              <h3 slot="headline">{heading}</h3>
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={bodyContent()} />
            </va-alert>
          );
        },
      )}
    </>
  );
};

export default Banner;
