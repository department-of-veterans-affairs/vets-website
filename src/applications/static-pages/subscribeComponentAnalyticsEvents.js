import recordEvent from 'platform/monitoring/record-event';

const analyticsEvents = [
  {
    componentName: 'Modal',
    prefix: 'modal',
    actions: [{ action: 'show', name: 'int-modal-click' }],
  },
  {
    componentName: 'AdditionalInfo',
    prefix: 'additional-info',
    actions: [
      { action: 'expand', name: 'int-additional-info-expand' },
      { action: 'collapse', name: 'int-additional-info-collapse' },
    ],
  },
];

export default function subscribeComponentAnalyticsEvents() {
  document.body.addEventListener('component-library-analytics', e => {
    // Is it a component we are tracking?
    const component = analyticsEvents.find(
      c => c.componentName === e.detail.componentName,
    );

    // Is it an action we are tracking?
    if (component?.actions) {
      const action = component.actions.find(
        ev => ev.action === e.detail.action,
      );

      if (action) {
        const dataLayer = { event: action.name };

        // If the event included additional details / context...
        if (e.detail.details) {
          for (const key of Object.keys(e.detail.details)) {
            const newKey = component.prefix
              ? `${component.prefix}-${key}`
              : key;

            dataLayer[newKey] = e.detail.details[key];
          }
        }

        recordEvent(dataLayer);
      }
    }
  });
}
