export function mockFetchPastVisits(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        durationInMonths: 24,
        hasVisitedInPastMonths: url.includes('984'),
      });
    }, 500);
  });
}

export function mockFetchRequestLimit(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        requestLimit: 1,
        numberOfRequests: url.includes('984') ? 1 : 0,
      });
    }, 500);
  });
}
