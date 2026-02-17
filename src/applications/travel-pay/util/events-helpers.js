import recordEvent from 'platform/monitoring/record-event';

const recordPageview = (variant, page) => {
  recordEvent({
    event: `${variant}-pageview`,
    action: 'view',
    /* eslint-disable camelcase */
    heading_1: page,
    /* eslint-enable camelcase */
  });
};

export const recordButtonClick = (variant, page, event) => {
  recordEvent({
    event: `${variant}-button`,
    action: 'click',
    /* eslint-disable camelcase */
    heading_1: page,
    link_text: event,
    /* eslint-enable camelcase */
  });
};

export const recordLinkClick = (variant, page, text, url) => {
  recordEvent({
    event: `${variant}-link`,
    action: 'click',
    /* eslint-disable camelcase */
    heading_1: page, // page this event happens on
    link_text: text, // link text
    link_url: url || undefined, // url, can be undefined
    /* eslint-enable camelcase */
  });
};

export const recordCheckboxEvent = (variant, label) => {
  recordEvent({
    event: `${variant}-checkbox`,
    action: 'check',
    'checkbox-label': label,
  });
};

export const recordRadioOptionClick = (label, optionLabel, required = true) => {
  recordEvent({
    event: 'int-radio-option-click',
    'radio-button-label': label,
    'radio-button-optionLabel': optionLabel,
    'radio-button-required': required,
  });
};

// Legacy wrappers for backwards compatibility
export const recordSmocPageview = page => recordPageview('smoc', page);
export const recordSmocButtonClick = (page, event) =>
  recordButtonClick('smoc', page, event);
export const recordSmocLinkClick = (page, text, url) =>
  recordLinkClick('smoc', page, text, url);
