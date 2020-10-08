import recordEvent from 'platform/monitoring/record-event';

export const getFormAuthorizationState = (formConfig, state) =>
  formConfig.getAuthorizationState(state);

export const recordDashboardClick = (
  product,
  actionType = 'view-link',
) => () => {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': actionType,
    'dashboard-product': product,
  });
};
