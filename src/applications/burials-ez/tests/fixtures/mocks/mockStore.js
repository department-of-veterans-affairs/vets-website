const getData = ({
  loggedIn = true,
  savedForms = [],
  formData = {},
  contestableIssues = { status: '' },
  routerPush = () => {},
} = {}) => ({
  props: {
    loggedIn,
    location: {},
    router: { push: routerPush },
  },
  data: {
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms,
        prefillsAvailable: [],
        verified: true,
      },
    },
    form: {
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: formData,
    },
    contestableIssues,
  },
});

export default getData;
