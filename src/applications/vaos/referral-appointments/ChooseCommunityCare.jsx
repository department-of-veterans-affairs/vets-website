import React from 'react';
import PageLayout from '../appointment-list/components/PageLayout';

export default function ChooseCommunityCare() {
  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1>Choose a community care provider</h1>
      <p data-testid="subtitle" className="vads-u-font-family--serif">
        Sort provider
      </p>
      <div>[ ] Schedule online </div>
      <div>Dr. Bob</div>
      <div>That One Cool Clinic</div>
      <div>[00 minute drive (00 miles)]</div>
      <div>
        <div>Monday, June 4</div>
        <div>1pm, 2pm, 4pm, etc.</div>
      </div>
      <div>(link) Show all appointments</div>
      <div>
        <div>[Provider name]</div>
        <div>[Facility location]</div>
        <div>[00 minute drive (00 miles)]</div>
      </div>
      <div>
        <div>Monday, June 4</div>
        <div>1pm, 2pm, 4pm, etc.</div>
      </div>
    </PageLayout>
  );
}
