export const userLoader = async () => {
  // Return mock user data
  return {
    account: {
      accountUuid: '899972dsssakkkkfatttcba6c35fff52',
    },
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      verified: true,
      signIn: {
        serviceName: 'idme',
      },
    },
    prefillsAvailable: [],
    inProgressForms: [],
  };
};
