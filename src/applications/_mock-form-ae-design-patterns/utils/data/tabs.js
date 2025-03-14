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
      bgColor: '--vads-color-orange',
      textColor: '--vads-color-black',
    },
    {
      name: 'Gray',
      path: '/2/task-gray',
      description: 'Pattern 2 - Gray Task',
      bgColor: '--vads-color-gray-warm-dark',
      textColor: '--vads-color-white',
    },
    {
      name: 'Blue',
      path: '/2/task-blue',
      description: 'Pattern 2 - Blue Task',
      bgColor: '--vads-color-primary-dark',
      textColor: '--vads-color-white',
    },
    {
      name: 'Post Study',
      path: '/2/post-study',
      description: 'Pattern 2 - Post Study Review',
      bgColor: '--vads-color-warning',
      textColor: '--vads-color-black',
    },
    {
      name: 'Personal Info Demo',
      path: '/2/personal-information-demo',
      description: 'Pattern 2 - Personal Information Demo',
      bgColor: '--vads-color-secondary-darkest',
      textColor: '--vads-color-white',
    },
  ],
  pattern3: [
    {
      name: 'Service List Demo',
      path: '/3/service-list-demo',
      description: 'Pattern 3 - Service List Demo',
      bgColor: '--vads-color-success-dark',
      textColor: '--vads-color-white',
    },
    {
      name: 'Critical Information Demo',
      path: '/3/critical-information-demo',
      description: 'Pattern 3 - Critical Information Demo',
      bgColor: '--vads-color-secondary-darkest',
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
