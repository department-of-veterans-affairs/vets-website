import React from 'react';
import {
  showForm0781Tile,
  optOut,
  optIn,
} from '../utils/form0781'

// ******************************************
// Additional Forms Chapter Wrapper content
export const title = 'Additional forms to support your claim'
export const description = 'Based on information you provided earlier, you can complete these additional forms to support your claim.'

// ******************************************
// Form 0781 Tile Content
function form0781StatusBadge(formData) {
  if (true) {
    return (
      <div>
        'wipn status badge'
      </div>
    );
  }
}

function form0781EnterFormLink(formData) {
  if (true) {
    return (
      <a href='' onClick={ activate0781Flow }>
        Continue
      </a>
    );
  }
}

function optChoiceLink(formData) {
    const optedIn = true
    if (optedIn) {
    <a href='' onClick={ optOut }>
      X - OPT OUT
    </a>
  } else {
    <a href='' onClick={ optIn }>
      OPT IN
    </a>
  }
}

export const form0781FormTile = () => {
  if (showForm0781Tile) {
    return (
      <div>
        <div>
          { form0781StatusBadge }
        </div>
        <h4>
          Statement about mental health conditions
        </h4>
        <p>
          VA Form 21-0781
        </p>
        <div>
          { form0781EnterFormLink }
          { optChoiceLink }
        </div>
      </div>
    );
  }
}
