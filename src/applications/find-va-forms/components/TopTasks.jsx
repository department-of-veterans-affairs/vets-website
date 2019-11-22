import React from 'react';
import CardRow from './CardRow';
import Card from './Card';

export default function TopTasks() {
  return (
    <>
      <h2>Top tasks for frequently downloaded VA forms</h2>
      <p>
        Whether you’re looking for a form to file a disability claim or apply
        for the GI Bill, many top tasks are now also available as secure online
        applications. To get started online, go to a top task below. We’ll walk
        you step-by-step through the process. You can even save your work online
        and come back to it later.
      </p>
      <CardRow>
        <Card
          heading="File a VA disability claim"
          description="Equal to VA Form 21-526EZ"
          href="/disability/file-disability-claim-form-21-526ez"
        />
        <Card
          heading="Apply for the GI Bill and other education benefits"
          description="Equal to VA Forms 22-1990 and 22-1995"
          href="/education/apply-for-education-benefits/application/1990"
        />
        <Card
          heading="Apply for VA health care benefits"
          description="Equal to VA Form 10-10EZ"
          href="/health-care/apply/application"
        />
      </CardRow>
    </>
  );
}
