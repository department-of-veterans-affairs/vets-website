import Verify from '../pages/Verify';
import EnterOTP from '../pages/EnterOTP';
import DateTimeSelection from '../pages/DateTimeSelection';
import TopicSelection from '../pages/TopicSelection';
import Review from '../pages/Review';
import Confirmation from '../pages/Confirmation';
import CancelAppointment from '../pages/CancelAppointment';
import CancelAppointmentConfirmation from '../pages/CancelConfirmation';
import AlreadyScheduled from '../pages/AlreadyScheduled';
import { AUTH_LEVELS, FLOW_TYPES, URLS } from './constants';

/**
 * @typedef {Object} RoutePermissions
 * @property {'none'|'lowAuthOnly'|'token'} requiresAuthorization - The authorization level required
 *   for this route. See AUTH_LEVELS enum for details.
 * @property {string[]} [requireFormData] - Optional array of form data field names that must be present
 *   in Redux state before accessing this route. The component will be wrapped with `withFormData` HOC.
 *   Common fields: 'uuid', 'lastName', 'dob', 'obfuscatedEmail', 'selectedDate', 'selectedTopics'.
 */

/**
 * @typedef {Object} RouteConfig
 * @property {string} path - The URL path for the route. Supports dynamic segments (e.g., ':appointmentId').
 * @property {React.ComponentType} component - The React component to render for this route.
 * @property {RoutePermissions} permissions - Authorization and form data requirements for the route.
 * @property {'schedule'|'cancel'|'any'} flowType - Which user flow can access this route.
 *   'schedule' = only scheduling flow, 'cancel' = only cancellation flow, 'any' = both flows allowed.
 * @property {string[]} [setsData] - Optional array of form data field names that this route's component
 *   is responsible for setting. Used for documentation purposes to track data flow between routes.
 */

/**
 * Application route configuration array.
 *
 * Routes are processed by `createRoutes` which wraps components with appropriate HOCs based on permissions:
 * - Routes with `requiresAuthorization: 'token'` are wrapped with `withAuthorization`
 * - Routes with `requiresAuthorization: 'lowAuthOnly'` are wrapped with `withAuthorization` and redirect if user has token
 * - Routes with `requireFormData` are wrapped with `withFormData`
 *
 * @type {RouteConfig[]}
 */
export const routes = [
  // Public routes (no auth required)
  {
    path: URLS.VERIFY,
    component: Verify,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.NONE,
    },
    flowType: FLOW_TYPES.ANY, // Entry point for both flows
    setsData: ['uuid', 'lastName', 'dob', 'obfuscatedEmail'],
  },
  // Low auth routes - require form data
  {
    path: URLS.ENTER_OTP,
    component: EnterOTP,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.NONE,
      requireFormData: ['uuid', 'lastName', 'dob', 'obfuscatedEmail'],
    },
    flowType: FLOW_TYPES.ANY, // Both flows go through OTC verification
  },
  // Protected routes (require token)
  // Schedule Flow Routes
  {
    path: URLS.DATE_TIME,
    component: DateTimeSelection,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.SCHEDULE,
    setsData: ['selectedSlot'],
  },
  {
    path: URLS.TOPIC_SELECTION,
    component: TopicSelection,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.SCHEDULE,
    setsData: ['selectedTopics'],
  },
  {
    path: URLS.REVIEW,
    component: Review,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
      requireFormData: [
        'uuid',
        'lastName',
        'dob',
        'obfuscatedEmail',
        'selectedSlot',
        'selectedTopics',
        'obfuscatedEmail',
      ],
    },
    flowType: FLOW_TYPES.SCHEDULE,
  },
  {
    path: `${URLS.CONFIRMATION}/:appointmentId`,
    component: Confirmation,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.SCHEDULE,
  },
  // Cancel Appointment Routes
  {
    path: `${URLS.CANCEL_APPOINTMENT}/:appointmentId`,
    component: CancelAppointment,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.CANCEL,
  },
  {
    path: `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/:appointmentId`,
    component: CancelAppointmentConfirmation,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.CANCEL,
  },
  {
    path: `${URLS.ALREADY_SCHEDULED}/:appointmentId`,
    component: AlreadyScheduled,
    permissions: {
      requiresAuthorization: AUTH_LEVELS.TOKEN,
    },
    flowType: FLOW_TYPES.SCHEDULE,
  },
];

/**
 * Find the first route that requires token authentication.
 * Used for redirecting authenticated users from lowAuthOnly routes.
 * @returns {string} The path of the first token-protected route
 */
const getFirstTokenRoute = () => {
  const tokenRoute = routes.find(
    r => r.permissions.requiresAuthorization === AUTH_LEVELS.TOKEN,
  );
  return tokenRoute?.path || URLS.DATE_TIME;
};

/**
 * Find the route that sets a specific field
 * @param {string} fieldName - The field name to find a route for
 * @returns {string} - The path of the route that sets this field, or '/' as fallback
 */
const findRouteForField = fieldName => {
  const route = routes.find(r => r.setsData?.includes(fieldName));
  return route?.path || '/';
};
/**
 * Find the first missing required field
 * @param {string[]} requiredFields - Array of required field names
 * @param {object} formState - The current form state from Redux
 * @returns {string|null} - The first missing field name, or null if all present
 */

/**
 * Check if a field has valid data
 * @param {string} fieldName - The name of the field to check
 * @param {object} formState - The current form state from Redux
 * @returns {boolean} - Whether the field has valid data
 */
const hasValidFieldData = (fieldName, formState) => {
  const value = formState[fieldName];

  // Special handling for selectedTopics - must have at least one selection
  if (fieldName === 'selectedTopics') {
    return Array.isArray(value) && value.length > 0;
  }

  // Special handling for selectedSlot - must have a valid slot
  if (fieldName === 'selectedSlot') {
    return value && value.dtStartUtc && value.dtEndUtc;
  }

  // For all other fields, check for truthy value
  return Boolean(value);
};

const findMissingField = (requiredFields, formState) => {
  for (const field of requiredFields) {
    if (!hasValidFieldData(field, formState)) {
      return field;
    }
  }
  return null;
};

export { findMissingField, findRouteForField, getFirstTokenRoute };
