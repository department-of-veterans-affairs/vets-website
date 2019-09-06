export function getAppointmentSummary() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        confirmedCount: 1,
        pendingCount: 2,
        pastCount: 0,
      });
    }, 1000);
  });
}
