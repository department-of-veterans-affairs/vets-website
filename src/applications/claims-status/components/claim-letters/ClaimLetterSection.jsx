import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export default function ClaimLetterSection() {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const iscstIncludeDdlBoaLettersEnabled = useToggleValue(
    TOGGLE_NAMES.cstIncludeDdlBoaLetters,
  );
  const claimLetterSubText = iscstIncludeDdlBoaLettersEnabled
    ? 'You can download your decision letters online. You can also get other letters related to your claims and appeals.'
    : 'You can download your decision letters online. You can also get other letters related to your claims.';

  return (
    <div className="claim-letter-section vads-u-margin-top--4 vads-u-margin-bottom--4">
      <h2 id="your-claim-letters">Your claim letters</h2>
      <Link className="active-va-link" to="/your-claim-letters">
        Download your VA claim letters
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </Link>
      <p className="vads-u-margin-y--0p5">{claimLetterSubText}</p>
    </div>
  );
}
