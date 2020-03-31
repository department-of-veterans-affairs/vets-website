// import environment from 'platform/utilities/environment';
// import ENVIRONMENTS from '../../../site/constants/environments';

// const ssoKeepAliveEndpoint = () => {
//   const environmentPrefixes = {
//     [ENVIRONMENTS.LOCALHOST]: 'pint.',
//     [ENVIRONMENTS.VAGOVDEV]: 'int.',
//     [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
//     [ENVIRONMENTS.VAGOVPROD]: '',
//   };

//   const envPrefix = environmentPrefixes[environment.BUILDTYPE];
//   return `https://${envPrefix}eauth.va.gov/keepalive`;
// };

export default function keepAlive() {}
