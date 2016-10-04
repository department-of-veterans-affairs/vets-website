export const CLOSE_ALERT = 'CLOSE_ALERT';
export const OPEN_ALERT = 'OPEN_ALERT';

export function closeAlert() {
  return {
    type: CLOSE_ALERT
  };
}

export function openAlert(status, content) {
  return {
    type: OPEN_ALERT,
    status,
    content
  };
}
