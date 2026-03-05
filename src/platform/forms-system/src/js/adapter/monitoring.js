/**
 * Adapter — platform/monitoring re-exports.
 */

export { default as recordEvent } from 'platform/monitoring/record-event';
export { dataDogLogger } from 'platform/monitoring/Datadog/utilities';
export {
  default as DowntimeNotification,
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
export { default as DowntimeMessage } from 'platform/monitoring/DowntimeNotification/components/Down';
