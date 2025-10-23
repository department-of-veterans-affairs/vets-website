import React from 'react';

export const recentJobApplicationsDescription = () => (
  <div>
    <p>
      Have you tried to find a steady job (substantially gainful employment)
      since you became too disabled to work?
    </p>
    <p>
      (Don’t include applications to VA’s Compensated Work Therapy Program.)
    </p>
  </div>
);

export const substantiallyGainfulEmployment = () => (
  <va-additional-info trigger="What’s substantially gainful employment?">
    <p>Substantially gainful employment means:</p>
    <ul>
      <li>
        You’re employed in a competitive marketplace or job that isn’t in a
        protected environment, such as a family business or sheltered workshop.
      </li>
      <li>
        Your annual earnings are higher than the poverty threshold for one
        person.
      </li>
    </ul>
  </va-additional-info>
);
