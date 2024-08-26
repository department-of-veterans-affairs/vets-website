import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { expect } from 'chai';

export const getAudioElement = view => {
  const el = $('audio', view.container);
  // eslint-disable-next-line no-unused-expressions
  expect(el, 'no <audio> element was found in').to.exist;
  return el;
};

export const queryAudioElement = view => $('audio', view.container);
