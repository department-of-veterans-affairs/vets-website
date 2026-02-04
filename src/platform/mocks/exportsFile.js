/**
 * Platform Mocks Exports
 *
 * Public API for @department-of-veterans-affairs/platform-mocks
 */

// Browser mocks (MSW service worker)
export {
  // Core MSW exports
  rest,
  mockApi,
  apiUrl,
  // Handler factories (for custom base URLs)
  createUserHandler,
  createUnauthenticatedUserHandler,
  createFeatureTogglesHandler,
  createMaintenanceWindowsHandler,
  createVamcEhrHandler,
  createVamcEhrProxyHandler,
  createCommonHandlers,
  createCommonHandlersUnauthenticated,
  // Pre-configured handlers (use apiUrl from environment)
  userHandler,
  unauthenticatedUserHandler,
  featureTogglesHandler,
  maintenanceWindowsHandler,
  vamcEhrHandler,
  vamcEhrProxyHandler,
  commonHandlers,
  commonHandlersUnauthenticated,
  // Mock data
  mockUser,
  mockUserUnauthenticated,
  mockFeatureToggles,
  mockMaintenanceWindows,
  mockVamcEhr,
  // Response factories
  createVamcEhrResponse,
  createUserResponse,
  createFeatureTogglesResponse,
  createMaintenanceWindowsResponse,
} from './browser';
