import React from 'react';

const Banner = ({ banners }) => {
  return (
    <>
      {banners.map((banner, index) => {
        const bodyContent = () => {
          return { __html: banner.body };
        };
        return (
          <va-alert
            key={index}
            visible
            full-width
            closeable={
              banner.dismissibleOption === 'dismiss' ? `true` : `false`
            }
            status={banner.alertType}
          >
            <h3 slot="headline">{banner.title}</h3>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={bodyContent()} />
          </va-alert>
        );
      })}
    </>
  );
};

export default Banner;
