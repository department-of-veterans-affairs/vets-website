import React from 'react';

export const individualsInvolved = <h5>Individuals Involved</h5>;

export const personDescriptionText = (
  <p>
    Or
    <br />
    <br />
    Description of the person
  </p>
);

export const individualsDescription = (
  <div>
    {individualsInvolved}
    <p>Please provide the name of a person injured or killed.</p>
    <p>
      If you don’t know the full name of the person, provide a nickname. If you
      don’t know the person’s name at all, please briefly provide details that
      would help us identify the person.
    </p>
  </div>
);
