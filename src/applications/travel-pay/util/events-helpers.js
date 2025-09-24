import recordEvent from 'platform/monitoring/record-event';

export const recordSmocPageview = page => {
  recordEvent({
    event: 'smoc-pageview',
    action: 'view',
    /* eslint-disable camelcase */
    heading_1: page,
    /* eslint-enable camelcase */
  });
};

export const recordSmocButtonClick = (page, event) => {
  recordEvent({
    event: 'smoc-button',
    action: 'click',
    /* eslint-disable camelcase */
    heading_1: page,
    link_text: event,
    /* eslint-enable camelcase */
  });
};

export const recordSmocLinkClick = (page, text, url) => {
  recordEvent({
    event: 'smoc-link',
    action: 'click',
    /* eslint-disable camelcase */
    heading_1: page, // page this event happens on
    link_text: text, // link text
    link_url: url || undefined, // url, can be undefined
    /* eslint-enable camelcase */
  });
};
