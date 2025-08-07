export const selectGlobalDowntime = state =>
  state.scheduledDowntime?.globalDowntime;

export const selectScheduledDowntimeIsReady = state =>
  state.scheduledDowntime?.isReady;

export const selectScheduledDowntime = state =>
  state.scheduledDowntime?.serviceMap || [];
