import React from 'react';
import { CSP_IDS, LINK_TYPES } from 'platform/user/authentication/constants';
import ActionLink from 'platform/user/authentication/components/AccountLink';
import { CSP_REASONS } from './constants';

export function generateWizardAnswers({
  signinoptions = '',
  idoptions = '',
} = {}) {
  const wizard = {};
  switch (signinoptions) {
    case 'logingov':
    case 'idme':
      wizard.showAnswer = true;
      wizard.answer = () => (
        <ActionLink csp={signinoptions} type={LINK_TYPES.SIGNIN} />
      );
      break;
    case 'none':
      wizard.showAnswer = false;
      wizard.showNextQuestion = true;
      break;
    default:
      break;
  }

  if (wizard.showNextQuestion && idoptions.length > 1) {
    wizard.showAnswer = true;
    wizard.csp = idoptions === 'state' ? CSP_IDS.LOGIN_GOV : CSP_IDS.ID_ME;
    wizard.answer = () => (
      <>
        <p>
          <strong>{idoptions === 'state' ? 'Login.gov' : 'ID.me'}</strong> is
          the best identity partner option for you because:
        </p>
        <ul>
          {CSP_REASONS[idoptions].map((reasoning, index) => (
            <li key={index}>{reasoning}</li>
          ))}
        </ul>
        <ActionLink csp={wizard.csp} type={LINK_TYPES.CREATE} />
      </>
    );
  }

  return {
    showNextQuestion: wizard.showNextQuestion ?? false,
    shouldShowAnswer: wizard.showAnswer ?? false,
    Answer: wizard.answer || null,
  };
}
