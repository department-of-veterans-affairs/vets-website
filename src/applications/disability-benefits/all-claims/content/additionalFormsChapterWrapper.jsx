import React from 'react';
import {
  activate0781Flow,
  optOutChoice
} from '../utils'

// Additional Forms Chapter Wrapper content
export const title = 'Additional forms to support your claim'
export const description = 'Based on information you provided earlier, you can complete these additional forms to support your claim.'

// Form 0781 Tile Content
export const form0781StatusBadge = () => {
  if (true) {
    return (
      <div>
        'wipn status badge'
      </div>
    );
  }
}

export const form0781Description = (
  <div>
    <h4>
      Statement about mental health conditions
    </h4>
    <p>
      VA Form 21-0781
    </p>
  </div>
);

// [wipn8923] TODO: move paths into constants
// '/disability/additional-forms/mental-health-statement/'
export const form0781EnterFormLink = () => {
  if (true) {
    return (
      <a href='' onClick={ activate0781Flow }>
        Continue
      </a>
    );
  }
}

export const form0781OptOutLink = () => {
  if (true) {
    return (
      <a href='' onClick={ optOutChoice }>
        X - OPT OUT
      </a>
    );
  }
}

