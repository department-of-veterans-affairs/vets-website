import React from 'react';

export default function NoRatings() {
  return (
    <va-alert>
      <h3 slot="headline">
        We don’t have any rated disabilities on file for you
      </h3>
      <div>
        <p>
          We can’t find any rated disabilities for you. If you have a disability
          that was caused by or got worse because of your service, you can file
          a claim for disability benefits.
        </p>
        <va-link
          href="/disability/how-to-file-claim/"
          text="Learn how to file a claim for disability compensation"
        />
      </div>
    </va-alert>
  );
}
