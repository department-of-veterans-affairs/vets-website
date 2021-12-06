import React from 'react';

const Banner = ({ banners }) => {
  return (
    <>
      {banners.map(
        ({ heading, dismissible, alert_type: alertType, text }, index) => {
          const bodyContent = () => {
            return { __html: text };
          };
          return (
            <va-alert
              key={index}
              visible
              full-width
              closeable={dismissible === 'dismiss' ? `true` : `false`}
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
