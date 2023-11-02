// https://docs.datadoghq.com/real_user_monitoring/browser/advanced_configuration/?tab=npm#enrich-and-control-rum-data

const beforeSend = (event, _) => {
  const { target, type } = event;
  if (type === 'click' && target instanceof HTMLAnchorElement) {
    /* eslint-disable-next-line no-param-reassign */
    event.context = {
      ...event.context,
      'link-group': target.dataset.linkGroup,
      'link-hostname': target.hostname,
      'link-title': target.dataset.linkTitle,
    };
  }
};

export default beforeSend;
