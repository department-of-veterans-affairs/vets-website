// import { renderHook } from '@testing-library/react-hooks';
// import { datadogRum } from '@datadog/browser-rum';
// import environment from 'platform/utilities/environment';
// import { useDatadogRum } from '../../../authentication/hooks/useDatadogRum';

// // Mock datadogRum
// jest.mock('@datadog/browser-rum', () => ({
//   datadogRum: {
//     init: jest.fn(),
//   },
// }));

// // Mock environment
// jest.mock('platform/utilities/environment', () => ({
//   default: {
//     vspEnvironment: jest.fn(() => 'vagovstaging'),
//     isStaging: jest.fn(() => true),
//     isProduction: jest.fn(() => false),
//   },
// }));

// describe('useDatadogRum', () => {
//   beforeEach(() => {
//     // Reset the window.DD_RUM mock before each test
//     delete window.DD_RUM;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should initialize Datadog RUM in staging environment', () => {
//     // Mock staging environment
//     environment.isStaging.mockReturnValue(true);
//     environment.isProduction.mockReturnValue(false);

//     // Render the hook
//     renderHook(() => useDatadogRum());

//     // Assert datadogRum.init was called with the correct configuration
//     expect(datadogRum.init).toHaveBeenCalledWith({
//       applicationId: '73e0e2fb-7b2a-4d4a-8231-35ef2123f607',
//       clientToken: 'pub2dfeb9f2606a756df3ddd4bd5c8a6b3c',
//       site: 'ddog-gov.com',
//       service: 'identity',
//       env: 'vagovstaging',
//       sessionSampleRate: 100,
//       sessionReplaySampleRate: 1,
//       trackInteractions: false,
//       trackUserInteractions: false,
//       trackFrustrations: true,
//       trackResources: true,
//       trackLongTasks: true,
//       defaultPrivacyLevel: 'mask-user-input',
//     });
//   });

//   it('should initialize Datadog RUM in production environment', () => {
//     // Mock production environment
//     environment.isStaging.mockReturnValue(false);
//     environment.isProduction.mockReturnValue(true);
//     environment.vspEnvironment.mockReturnValue('vagovprod');

//     renderHook(() => useDatadogRum());

//     expect(datadogRum.init).toHaveBeenCalledWith({
//       applicationId: '73e0e2fb-7b2a-4d4a-8231-35ef2123f607',
//       clientToken: 'pub2dfeb9f2606a756df3ddd4bd5c8a6b3c',
//       site: 'ddog-gov.com',
//       service: 'identity',
//       env: 'vagovprod',
//       sessionSampleRate: 20,
//       sessionReplaySampleRate: 10,
//       trackInteractions: true,
//       trackUserInteractions: true,
//       trackFrustrations: true,
//       trackResources: true,
//       trackLongTasks: true,
//       defaultPrivacyLevel: 'mask-user-input',
//     });
//   });

//   it('should not initialize Datadog RUM in local or CI environments', () => {
//     // Mock local environment
//     environment.isStaging.mockReturnValue(false);
//     environment.isProduction.mockReturnValue(false);

//     renderHook(() => useDatadogRum());

//     // Assert that init is not called and DD_RUM is not present
//     expect(datadogRum.init).not.toHaveBeenCalled();
//     expect(window.DD_RUM).toBeUndefined();
//   });

//   it('should delete window.DD_RUM if already initialized', () => {
//     // Mock a pre-existing DD_RUM configuration
//     window.DD_RUM = {
//       getInitConfiguration: jest.fn(() => true),
//     };

//     renderHook(() => useDatadogRum());

//     // Assert that init is not called and DD_RUM is deleted
//     expect(datadogRum.init).not.toHaveBeenCalled();
//     expect(window.DD_RUM).toBeUndefined();
//   });

//   it('should handle unexpected environments gracefully', () => {
//     // Mock an unknown environment
//     environment.isStaging.mockReturnValue(false);
//     environment.isProduction.mockReturnValue(false);
//     environment.vspEnvironment.mockReturnValue('unknown');

//     renderHook(() => useDatadogRum());

//     // Assert that datadogRum.init is not called
//     expect(datadogRum.init).not.toHaveBeenCalled();
//   });
// });
