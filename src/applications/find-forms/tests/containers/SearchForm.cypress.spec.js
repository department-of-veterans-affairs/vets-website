// import stub from '../../constants/stub.json';

// const SELECTORS = {
//   APP: '',
//   FINDFORM_INPUT: '',
//   FINDFORM_SEARCH: '',
//   FINDFORM_ERROR_BODY: '',
// };

describe('Find a VA form smoke test', () => {
  beforeEach(function() {
    cy.server();
  });

  // Testing for Error message
  it('does not display an error on initial page load with no URL query', () => {});

  it('displays an error if input is empty and search is clicked', () => {});

  it('displays an error if input is size one and search is clicked', () => {});

  it('does not display an error if input is greater than one character and search is clicked', () => {});

  it('does not display an error on initial page load with an empty URL query', () => {});

  it('displays an error on initial page load with a URL query of length one', () => {});

  it('does not display an error on initial page load with a URL query of length greater than one', () => {});

  it('removes the error once a valid query has been entered into the input', () => {});
});
