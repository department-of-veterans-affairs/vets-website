import React from 'react';

export const individualsInvolved = (
  <h3 className="vads-u-font-size--h5">Individuals involved</h3>
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
    <p>Please provide the name of the person injured or killed.</p>
    <p>
      If you don’t know the person’s name, please briefly provide details that
      would help us identify the person.
    </p>
  </div>
);
