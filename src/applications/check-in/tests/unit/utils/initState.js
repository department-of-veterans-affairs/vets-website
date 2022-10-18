const scheduledDowntimeState = {
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: {
      get() {},
    },
    dismissedDowntimeWarnings: [],
  },
};

export { scheduledDowntimeState };
