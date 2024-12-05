import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import {
  render,
  waitFor,
  fireEvent,
  getByTestId,
  cleanup,
} from '@testing-library/react';
import sinon from 'sinon';
import { SelectAccreditedRepresentative } from '../../../components/SelectAccreditedRepresentative';
import * as api from '../../../api/fetchRepStatus';
import repResults from '../../fixtures/data/representative-results.json';
import * as reviewPageHook from '../../../hooks/useReviewPage';

describe('<SelectAccreditedRepresentative>', () => {
  const getProps = ({ submitted = false } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },

        loggedIn: true,
        formData: { 'view:representativeSearchResults': repResults },
        setFormData: sinon.spy(),
        goToPath: sinon.spy(),
        goBack: sinon.spy(),
        goForward: sinon.spy(),
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:representativeSearchResults': repResults },
          },
        }),
        subscribe: () => {},
      },
    };
  };

  afterEach(() => {
    cleanup();
  });

  const renderContainer = (props, mockStore) => {
    const { container } = render(
      <Provider store={mockStore}>
        <SelectAccreditedRepresentative {...props} />
      </Provider>,
    );

    return container;
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();
    const container = renderContainer(props, mockStore);

    expect(container).to.exist;
  });

  it('calls getRepStatus and update state accordingly on search', async () => {
    const { props, mockStore } = getProps();

    const fetchRepStatusStub = sinon.stub(api, 'fetchRepStatus').resolves({
      data: { status: 'active' },
    });

    const container = renderContainer(props, mockStore);

    const selectRepButton = getByTestId(container, 'rep-select-19731');

    expect(selectRepButton).to.exist;

    fireEvent.click(selectRepButton);

    await waitFor(() => {
      expect(fetchRepStatusStub.calledOnce).to.be.true;
      expect(props.setFormData.called).to.be.true;
      expect(props.goToPath.called).to.be.false;
      expect(props.setFormData.args[0][0]).to.include({
        'view:selectedRepresentative': repResults[0].data,
      });
    });

    fetchRepStatusStub.restore();
  });

  it('calls getRepStatus and update state accordingly is review mode', async () => {
    const { props, mockStore } = getProps();

    const fetchRepStatusStub = sinon.stub(api, 'fetchRepStatus').resolves({
      data: { status: 'active' },
    });

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(true);

    const container = renderContainer(props, mockStore);

    const selectRepButton = getByTestId(container, 'rep-select-19731');

    expect(selectRepButton).to.exist;

    fireEvent.click(selectRepButton);

    await waitFor(() => {
      expect(fetchRepStatusStub.calledOnce).to.be.true;
      expect(props.setFormData.called).to.be.true;
      expect(props.goToPath.called).to.be.true;
      expect(props.setFormData.args[0][0]).to.include({
        'view:selectedRepresentative': repResults[0].data,
      });
    });

    useReviewPageStub.restore();
  });

  it('displays query error when query is invalid', async () => {
    const { mockStore, props } = getProps();

    const container = renderContainer(props, mockStore);

    const forwardButton = container.querySelectorAll(
      'button[id*="continueButton"]',
    )[1];

    fireEvent.click(forwardButton);

    await waitFor(() => {
      expect(container.textContent).to.contain('Enter the name');
    });
  });

  it('displays selection error when query is valid but rep is null', async () => {
    const { mockStore } = getProps();

    const props = {
      formData: {
        'view:representativeQuery': 'Valid Query',
        'view:selectedRepresentative': null,
      },
    };

    const container = renderContainer(props, mockStore);

    const forwardButton = container.querySelectorAll(
      'button[id*="continueButton"]',
    )[1];
    fireEvent.click(forwardButton);

    await waitFor(() => {
      expect(container.textContent).to.contain('Select the accredited');
    });
  });

  it('goes back when not in review mode', async () => {
    const { mockStore, props } = getProps();

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(false);

    const container = renderContainer(props, mockStore);

    const backButton = container.querySelectorAll(
      'button[id*="continueButton"]',
    )[0];
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(props.goBack.called).to.be.true;
    });

    useReviewPageStub.restore();
  });

  it('goes to path when in review mode', async () => {
    const { mockStore, props } = getProps();

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(true);

    const container = renderContainer(props, mockStore);

    const backButton = container.querySelectorAll(
      'button[id*="continueButton"]',
    )[0];
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(props.goToPath.called).to.be.true;
    });

    useReviewPageStub.restore();
  });

  it('displays error on search when no query exists', async () => {
    const { mockStore, props } = getProps();

    const container = renderContainer(props, mockStore);

    const vaButton = container.querySelector('va-button[text="Search"]');

    fireEvent.click(vaButton);

    await waitFor(() => {
      expect(container.textContent).to.contain('Enter the name');
    });
  });

  it('calls fetchRepresentatives on search', async () => {
    const { mockStore } = getProps();

    const props = {
      formData: {
        'view:representativeQuery': 'Valid Query',
      },
      setFormData: sinon.spy(),
    };

    const container = renderContainer(props, mockStore);

    const vaButton = container.querySelector('va-button[text="Search"]');

    fireEvent.click(vaButton);

    await waitFor(() => {
      expect(props.setFormData.calledOnce).to.be.true;
    });
  });
});
