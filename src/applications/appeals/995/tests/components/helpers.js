import { fireEvent } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

/**
 * Use the following code once va-button-pair replaces current buttons, unless
 * the back link is moved to the top of the page when minimal headers/footers
 * are implemented
 */
/*
const clickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

const clickContinue = container => {
  const pair = $('va-button-pair', container);
  pair.__events.primaryClick(clickEvent);
};

const clickBack = container => {
  const pair = $('va-button-pair', container);
  pair.__events.secondaryClick(clickEvent);
};
*/

export const clickContinue = container => {
  fireEvent.click($('.usa-button-primary', container));
};

export const clickBack = container => {
  fireEvent.click($('.usa-button-secondary', container));
};

export const clickAddAnother = container => {
  fireEvent.click($('.vads-c-action-link--green', container));
};
