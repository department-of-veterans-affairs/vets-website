import React from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';

const ProofOfVeteranStatus = () => {
  return (
    <div id="proof-of-veteran-status">
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--1p5">
        Proof of Veteran status
      </h2>
      <p>
        You can use your Veteran status card to get discounts offered to
        Veterans at many restaurants, hotels, stores, and other businesses.
      </p>
      <p>
        <strong>Note: </strong>
        This card doesn’t entitle you to any VA benefits.
      </p>
      <div className="vads-u-margin--1 vads-u-margin-y--2">
        <img
          width="400rem"
          src="/img/content/posts/proof-of-veteran-status-card-example.png"
          alt="sample proof of veteran status card featuring name, date of birth, disability rating and period of service"
        />
      </div>
      <div className="vads-u-font-size--md">
        <i className="fa fa-app-store" />{' '}
        <va-link
          role="link"
          download
          filetype="PDF"
          href={null}
          text="Download and print your Veteran status card"
          onClick={() => {}}
        />
      </div>
      <div className="vads-u-margin-y--4">
        <MobileAppCallout
          headingText="Get proof of Veteran Status on your mobile device"
          bodyText={
            <>
              You can use our mobile app to get proof of Veteran status. To get
              started, download the <strong> VA: Health and Benefits </strong>{' '}
              mobile app.
            </>
          }
        />
      </div>
    </div>
  );
};

export default ProofOfVeteranStatus;
