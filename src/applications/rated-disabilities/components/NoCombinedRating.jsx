import React from 'react';

export default function NoCombinedRating() {
  return (
    <va-alert status="info" uswds>
      <h3 slot="headline">
        We don’t have a combined disability rating on file for you
      </h3>
      <div>
        <p>
          We can’t find a combined disability rating for you. If you have a
          disability that was caused by or got worse because of your service,
          you can file a claim for disability benefits.
        </p>
        <va-link
          href="/disability/how-to-file-claim"
          text="Learn how to file a claim for disability compensation"
        />
      </div>
    </va-alert>
  );
}
