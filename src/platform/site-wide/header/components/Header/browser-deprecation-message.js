import React from 'react';

const BrowserDeprecationMessage = () => {
  return (
    <>
      <div className="incompatible-browser-warning">
        <div className="row full">
          <div className="small-12">
            Your browser is out of date. To use this website, please{' '}
            <a
              href="https://browsehappy.com/"
              rel="noreferrer noopener"
              target="_blank"
            >
              update your browser
            </a>{' '}
            or use a different device.
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowserDeprecationMessage;
