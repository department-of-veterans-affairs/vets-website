import recordEvent from 'platform/monitoring/record-event';
import get from 'lodash/get';

// Record Find App Button click event
export const recordFindAppClick = (e, appName, appCategory) => {
  const buttonText = get(e, ['target', 'innerHTML']);
  recordEvent({
    event: 'cta-button-click',
    'button-type': 'secondary',
    'button-click-label': buttonText,
    'button-background-color': '#0071BB',
    'app-name': appName,
    'app-category': appCategory,
  });
};

// Record Learn about toggle
export const recordInfoToggle = (toggle, appName, appCategory) => {
  recordEvent({
    event: `int-additionalInfo-${toggle}`,
    'additionalInfo-click-label': `Learn about ${appName}`,
    'app-name': appName,
    'app-category': appCategory,
  });
};
