import React from 'react';

export const OptOutDescription = (
  <>
    <h3 className="confirmation-page-title">
      Opt out of the old appeals system
    </h3>
    <p>
      To request a Higher-Level Review, you’ll need to opt out (withdraw) from
      the old appeals process. This switch triggers us to formally withdraw your
      claim or appeal from the old appeal system and process it under the new
      system. Once you opt in to the new appeals process, the decision is
      permanent and you can’t return to the old appeals process.
    </p>
  </>
);

export const OptInCheckBoxLabel = (
  <>
    <strong>I choose to opt out of the old appeals process</strong>
    <span className="schemaform-required-span">(*Required)</span>
  </>
);

export const OptInCheckboxDescription = (
  <div style={{ marginLeft: '1.8em' }} role="presentation">
    I’m removing my claim and any related hearing requests from the old appeals
    process, and I’m requesting these be reviewed under the new appeals review
    process.
    <p>
      I understand that this decision is permanent and I can’t return to the old
      appeals process.
    </p>
  </div>
);
