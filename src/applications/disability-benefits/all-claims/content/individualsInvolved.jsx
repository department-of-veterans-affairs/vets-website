import React from 'react';

export const individualsInvolved = (
  <div aria-valuetext="Individuals involved">
    <h5>Individuals involved</h5>
  </div>
);

export const personDescriptionText = (
  <div>
    <p>Or</p>
    <p>Description of the person</p>
  </div>
);

export const individualsDescription = (
  <div>
    {individualsInvolved}
    <p>Please provide the name of a person injured or killed.</p>
    <p>
      If you don’t know the person’s name, please briefly provide details that
      would help us identify the person.
    </p>
  </div>
);
