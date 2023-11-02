import beforeSend from './beforeSend';

const config = {
  applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
  clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
  site: 'ddog-gov.com',
  service: 'mhv-on-va.gov',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 10,
  trackInteractions: true,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  beforeSend,
};

export default config;
