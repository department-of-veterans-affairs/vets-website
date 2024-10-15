export const tabsConfig = {
  pattern1: [
    {
      name: 'Green Task',
      path: '/1/task-green',
      description: '10-10EZR Form - Green',
      bgColor: '--vads-color-success-dark',
      textColor: '--vads-color-white',
    },
    {
      name: 'Yellow Task',
      path: '/1/task-yellow',
      description: '10-10EZR Form - Yellow',
      bgColor: '--vads-color-warning',
      textColor: '--vads-color-black',
    },
    {
      name: 'Purple Task',
      path: '/1/task-purple',
      description: '10182 Form - Purple',
      bgColor: '--vads-color-link-visited',
      textColor: '--vads-color-white',
    },
  ],
  pattern2: [
    {
      name: 'Orange',
      path: '/2/task-orange',

      description: 'Pattern 2 - Orange Task',
      bgColor: '--uswds-system-color-orange-40',
      textColor: '--vads-color-black',
    },
    {
      name: 'Gray',
      path: '/2/task-gray',
      description: 'Pattern 2 - Gray Task',
      bgColor: '--vads-color-gray-warm-dark',
      textColor: '--vads-color-white',
    },
  ],
};

export const getTabs = location => {
  const patternNumber = location?.pathname.match(/(\d+)/)?.[1];
  const patternKey = `pattern${patternNumber || 'Fallback'}`;
  return tabsConfig[patternKey] || [];
};

export const getPatterns = () =>
  Object.keys(tabsConfig).map(key => key.replace('pattern', ''));
