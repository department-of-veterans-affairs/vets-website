import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history-v4';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import RadiologyImagesList from '../../containers/RadiologyImagesList';
import user from '../fixtures/user.json';

describe('Radiology Images List container', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: {
          name: 'ANKLE LEFT 3 VIEWS',
          date: 'April 13, 2022, 5:25 a.m. MDT',
          studyId: 12345,
          imageCount: 5,
        },
      },
      images: {
        imageStatus: [{ studyIdUrn: 12345, status: 'COMPLETE' }],
        imageList: Array.from({ length: 5 }, (_, i) => ({
          index: i + 1,
          seriesAndImage: `0${i + 1}/01`,
        })),
      },
    },
  };

  const pagePath = '/labs-and-tests/12345/images';

  const setup = (state = initialState, history = null) =>
    renderWithStoreAndRouter(<RadiologyImagesList isTesting />, {
      initialState: state,
      reducers: reducer,
      history,
      path: pagePath,
    });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays the test name as an h1', () => {
    const screen = setup();
    const testName = screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'h1' &&
        content.includes(initialState.mr.labsAndTests.labsAndTestsDetails.name)
      );
    });
    expect(testName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getByText('April', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the images', () => {
    const screen = setup();
    const images = screen.getAllByTestId('image-div');
    expect(images.length).to.equal(5);
  });

  it('initially displays the loading spinner', () => {
    const screen = setup({});
    const loadingSpinner = screen.getAllByTestId('loading-indicator');
    expect(loadingSpinner).to.exist;
  });

  const testRedirect = async (state, historySpy) => {
    const history = createMemoryHistory({
      initialEntries: [pagePath],
    });
    sinon.spy(history, historySpy);

    setup(state, history);

    await waitFor(() => {
      expect(history[historySpy].called).to.be.true;
      // This assertion is not working because the useParam is not pulling the path value during the test.
      // Uncomment if we figure this out.
      // expect(history[historySpy].getCall(0).args[0]).to.equal('/labs-and-tests/12345');
    });
  };

  it('redirects to the details page when there are zero images in the study', async () => {
    const noImagesState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        labsAndTests: {
          labsAndTestsDetails: {
            ...initialState.mr.labsAndTests.labsAndTestsDetails,
            imageCount: 0,
          },
        },
      },
    };

    await testRedirect(noImagesState, 'push');
  });

  it('redirects to the details page when the study job is incomplete', async () => {
    const incompleteState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        images: {
          ...initialState.mr.images,
          imageStatus: [{ studyIdUrn: 12345, status: 'IN_PROGRESS' }],
        },
      },
    };

    await testRedirect(incompleteState, 'push');
  });

  it('redirects to the details page when there is no available study for this radiology test', async () => {
    const missingStudyState = {
      ...initialState,
      mr: {
        ...initialState.mr,
        images: {
          ...initialState.mr.images,
          imageStatus: [{ studyIdUrn: 54321, status: 'COMPLETE' }],
        },
      },
    };

    await testRedirect(missingStudyState, 'push');
  });
});
