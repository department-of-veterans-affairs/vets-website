import ENVIRONMENTS from 'site/constants/environments';
import environment from 'platform/utilities/environment';
import DEV from './config/dev.config';
import STAGING from './config/staging.config';
import PROD from './config/prod.config';

export const externalApplicationsConfig = {
  [ENVIRONMENTS.VAGOVPROD]: PROD,
  [ENVIRONMENTS.VAGOVSTAGING]: STAGING,
  [ENVIRONMENTS.VAGOVDEV]: DEV,
  [ENVIRONMENTS.LOCALHOST]: DEV,
}[environment.BUILDTYPE];
