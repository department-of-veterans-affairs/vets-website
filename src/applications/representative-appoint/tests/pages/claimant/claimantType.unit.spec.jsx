import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ClaimantType from '../../../components/ClaimantType';
import prefill from '../../fixtures/data/prefill.json';
import formConfig from '../../../config/form';

describe('<ClaimantType /> handlers', async () => {
  const getProps = ({ loggedIn = false } = {}) => {
    return {
      props: {
        router: { push: sinon.spy() },
        location: { pathname: '/claimant-type' },
        route: {
          pageList: [
            { path: '/introduction', formConfig },
            { path: '/claimant-type', formConfig },
            { path: '/select-representative', formConfig },
          ],
        },
      },
      mockStore: {
        getState: () => ({
          form: {
            data: prefill,
          },
          user: { login: { currentlyLoggedIn: loggedIn } },
        }),
        subscribe: () => {},
        dispatch: sinon.spy(),
      },
    };
  };

  afterEach(() => {
    cleanup();
  });

  const renderContainer = (props, mockStore) => {
    return render(
      <Provider store={mockStore}>
        <ClaimantType {...props} />
      </Provider>,
    );
  };

  it('should render', async () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);

    const radioButtonYes = container.querySelector(
      'va-radio-option[value="Yes"]',
    );

    const radioButtonNo = container.querySelector(
      'va-radio-option[value="No"]',
    );
    expect(radioButtonYes).to.exist;
    expect(radioButtonNo).to.exist;
  });

  context('when selecting Yes', () => {
    it('updates state correctly', async () => {
      const { props, mockStore } = getProps({ loggedIn: true });
      const { dispatch } = mockStore;

      const { container } = renderContainer(props, mockStore);

      const radioSelector = container.querySelector('va-radio');
      radioSelector.__events.vaValueChange({ detail: { value: 'Yes' } });

      await waitFor(() => {
        expect(dispatch.firstCall.args[0].data).to.deep.include({
          'view:applicantIsVeteran': 'Yes',
        });
      });
    });
  });

  context('when selecting No', () => {
    it('updates state correctly', async () => {
      const { props, mockStore } = getProps({ loggedIn: true });
      const { dispatch } = mockStore;

      const { container } = renderContainer(props, mockStore);

      const radioSelector = container.querySelector('va-radio');
      radioSelector.__events.vaValueChange({ detail: { value: 'No' } });

      await waitFor(() => {
        expect(dispatch.firstCall.args[0].data).to.deep.include({
          'view:applicantIsVeteran': 'No',
        });
      });
    });
  });

  context('when navigating forward', () => {
    context('when a selection has been made', () => {
      context('when logged in', () => {
        it('attempts to prefill', async () => {
          const { props, mockStore } = getProps({ loggedIn: true });
          const { dispatch } = mockStore;

          const { container } = renderContainer(props, mockStore);

          const radioSelector = container.querySelector('va-radio');
          radioSelector.__events.vaValueChange({ detail: { value: 'Yes' } });

          const continueButton = container.querySelector('.usa-button-primary');

          fireEvent.click(continueButton);

          await waitFor(() => {
            expect(dispatch.calledTwice).to.be.true;
          });
        });

        it('routes to the representative select page', async () => {
          const { props, mockStore } = getProps({ loggedIn: true });

          const { container } = renderContainer(props, mockStore);

          const radioSelector = container.querySelector('va-radio');
          radioSelector.__events.vaValueChange({ detail: { value: 'Yes' } });

          const continueButton = container.querySelector('.usa-button-primary');

          fireEvent.click(continueButton);

          await waitFor(() => {
            expect(props.router.push.calledWith('/select-representative')).to.be
              .true;
          });
        });
      });

      context('when not logged in', () => {
        it('does not attempt to prefill', async () => {
          const { props, mockStore } = getProps({ loggedIn: false });
          const { dispatch } = mockStore;

          const { container } = renderContainer(props, mockStore);

          const radioSelector = container.querySelector('va-radio');
          radioSelector.__events.vaValueChange({ detail: { value: 'Yes' } });

          const continueButton = container.querySelector('.usa-button-primary');

          fireEvent.click(continueButton);

          await waitFor(() => {
            expect(dispatch.calledOnce).to.be.true;
          });
        });

        it('routes to the representative select page', async () => {
          const { props, mockStore } = getProps({ loggedIn: true });

          const { container } = renderContainer(props, mockStore);

          const radioSelector = container.querySelector('va-radio');
          radioSelector.__events.vaValueChange({ detail: { value: 'Yes' } });

          const continueButton = container.querySelector('.usa-button-primary');

          fireEvent.click(continueButton);

          await waitFor(() => {
            expect(props.router.push.calledWith('/select-representative')).to.be
              .true;
          });
        });
      });
    });

    context('when no selection has been made', () => {
      it('displays an error', async () => {
        const { props, mockStore } = getProps({ loggedIn: true });

        const { container } = renderContainer(props, mockStore);

        const radioSelector = container.querySelector('va-radio');

        const continueButton = container.querySelector('.usa-button-primary');

        fireEvent.click(continueButton);

        await waitFor(() => {
          expect(radioSelector).to.have.attr(
            'error',
            'You must provide a response',
          );
        });
      });
    });
  });

  context('when navigating backward', () => {
    it('routes to the introduction page', async () => {
      const { props, mockStore } = getProps({ loggedIn: true });

      const { container } = renderContainer(props, mockStore);

      const backButton = container.querySelector('.usa-button-secondary');

      fireEvent.click(backButton);

      await waitFor(() => {
        expect(props.router.push.calledWith('/introduction')).to.be.true;
      });
    });
  });
});
