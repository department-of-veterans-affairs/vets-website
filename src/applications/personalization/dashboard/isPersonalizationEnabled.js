import dashboardManifest from './manifest';

export default function isPersonalizationEnabled() {
  if (__BUILDTYPE__ !== 'production') return true;
  return dashboardManifest.production;
}
