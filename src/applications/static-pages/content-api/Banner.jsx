import React from 'react';

const Banner = ({ banners }) => {
  return (
    <>
      {banners.map((banner, index) => {
        const bodyContent = () => {
          return { __html: banner.text };
        };
        return (
          <va-alert
            key={index}
            visible
            full-width
            closeable={banner.dismissible === 'dismiss' ? `true` : `false`}
            status={banner.alert_type}
          >
            <h3 slot="headline">{banner.heading}</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={bodyContent()} />
          </va-alert>
        );
      })}
    </>
  );
};

export default Banner;
