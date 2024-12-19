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
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { SelectAccreditedRepresentative } from '../../../components/SelectAccreditedRepresentative';
import * as api from '../../../api/fetchRepStatus';
import * as searchAPI from '../../../api/fetchRepresentatives';
import repResults from '../../fixtures/data/representative-results.json';
import * as reviewPageHook from '../../../hooks/useReviewPage';

describe('<SelectAccreditedRepresentative>', () => {
  const getProps = ({
    currentRep = undefined,
    query = undefined,
    results = repResults,
    submitted = false,
  } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },

        loggedIn: true,
        formData: {
          'view:representativeQuery': query,
          'view:representativeSearchResults': results,
          'view:selectedRepresentative': currentRep,
        },
        setFormData: sinon.spy(),
        goToPath: sinon.spy(),
        goBack: sinon.spy(),
        goForward: sinon.spy(),
      },
      mockStore: {
        getState: () => ({
          form: {
            data: {
              'view:representativeQuery': query,
              'view:representativeSearchResults': results,
              'view:selectedRepresentative': currentRep,
            },
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

  context('when searching', () => {
    context('when the search input is invalid', () => {
      it('displays the no search error', async () => {
        const { mockStore, props } = getProps();

        const container = renderContainer(props, mockStore);

        const searchButton = container.querySelector('va-button');

        fireEvent.click(searchButton);

        const searchBox = $('va-text-input', container);

        await waitFor(() => {
          expect(searchBox).to.have.attr(
            'error',
            'Enter the name of the accredited representative or VSO you’d like to appoint',
          );
        });
      });
    });

    context('when the search input is valid', () => {
      it.skip('sets the results in state', async () => {
        const { props, mockStore } = getProps({
          query: 'Bob',
          results: undefined,
        });

        const fetchRepStub = sinon
          .stub(searchAPI, 'fetchRepresentatives')
          .resolves(repResults);

        const container = renderContainer(props, mockStore);

        const searchButton = container.querySelector('va-button');

        fireEvent.click(searchButton);

        await waitFor(() => {
          expect(fetchRepStub.calledOnce).to.be.true;
          expect(props.setFormData.called).to.be.true;
          expect(props.setFormData.args[0][0]).to.include({
            'view:representativeSearchResults': repResults,
          });
        });

        fetchRepStub.restore();
      });
    });
  });

  context('when navigating', () => {
    context('when not in review mode', () => {
      context('when clicking the back button', () => {
        it('calls goBack', async () => {
          const { mockStore, props } = getProps();

          const useReviewPageStub = sinon
            .stub(reviewPageHook, 'useReviewPage')
            .returns(false);

          const container = renderContainer(props, mockStore);

          const backButton = container.querySelector('.usa-button-secondary');

          fireEvent.click(backButton);

          await waitFor(() => {
            expect(props.goBack.called).to.be.true;
          });

          useReviewPageStub.restore();
        });
      });

      context('when clicking the select a rep button', () => {
        it('calls getRepStatus and updates state accordingly', async () => {
          const { props, mockStore } = getProps();

          const fetchRepStatusStub = sinon
            .stub(api, 'fetchRepStatus')
            .resolves({
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
      });
    });

    context('when in review mode', () => {
      context('when clicking the back button', () => {
        it('calls goToPath', async () => {
          const { mockStore, props } = getProps();

          const useReviewPageStub = sinon
            .stub(reviewPageHook, 'useReviewPage')
            .returns(true);

          const container = renderContainer(props, mockStore);

          const backButton = container.querySelector('.usa-button-secondary');

          fireEvent.click(backButton);

          await waitFor(() => {
            expect(props.goToPath.called).to.be.true;
          });

          useReviewPageStub.restore();
        });
      });

      context('when clicking the select a rep button', () => {
        context('when selecting a new representative', () => {
          it('sets the new selection in state', async () => {
            const { props, mockStore } = getProps({
              currentRep: repResults[1].data,
            });

            const fetchRepStatusStub = sinon
              .stub(api, 'fetchRepStatus')
              .resolves({
                data: { status: 'active' },
              });

            const useReviewPageStub = sinon
              .stub(reviewPageHook, 'useReviewPage')
              .returns(true);

            const container = renderContainer(props, mockStore);

            const selectRepButton = getByTestId(container, 'rep-select-19731');

            fireEvent.click(selectRepButton);

            await waitFor(() => {
              expect(props.setFormData.args[0][0]).to.include({
                'view:selectedRepresentative': repResults[0].data,
              });
            });

            fetchRepStatusStub.restore();
            useReviewPageStub.restore();
          });

          it('routes to the contact representative page', async () => {
            const { props, mockStore } = getProps({
              currentRep: repResults[1].data,
            });

            const fetchRepStatusStub = sinon
              .stub(api, 'fetchRepStatus')
              .resolves({
                data: { status: 'active' },
              });

            const useReviewPageStub = sinon
              .stub(reviewPageHook, 'useReviewPage')
              .returns(true);

            const container = renderContainer(props, mockStore);

            const selectRepButton = getByTestId(container, 'rep-select-19731');

            fireEvent.click(selectRepButton);

            await waitFor(() => {
              expect(
                props.goToPath.calledWith(
                  '/representative-contact?review=true',
                ),
              ).to.be.true;
            });

            fetchRepStatusStub.restore();
            useReviewPageStub.restore();
          });
        });

        context('when selecting the same representative', () => {
          it('does not attempt to update state', async () => {
            const { props, mockStore } = getProps({
              currentRep: repResults[0].data,
            });

            const fetchRepStatusStub = sinon
              .stub(api, 'fetchRepStatus')
              .resolves({
                data: { status: 'active' },
              });

            const useReviewPageStub = sinon
              .stub(reviewPageHook, 'useReviewPage')
              .returns(true);

            const container = renderContainer(props, mockStore);

            const selectRepButton = getByTestId(container, 'rep-select-19731');

            fireEvent.click(selectRepButton);

            await waitFor(() => {
              expect(props.setFormData.called).to.be.false;
            });

            fetchRepStatusStub.restore();
            useReviewPageStub.restore();
          });

          it('routes to the review page', async () => {
            const { props, mockStore } = getProps({
              currentRep: repResults[0].data,
            });

            const fetchRepStatusStub = sinon
              .stub(api, 'fetchRepStatus')
              .resolves({
                data: { status: 'active' },
              });

            const useReviewPageStub = sinon
              .stub(reviewPageHook, 'useReviewPage')
              .returns(true);

            const container = renderContainer(props, mockStore);

            const selectRepButton = getByTestId(container, 'rep-select-19731');

            fireEvent.click(selectRepButton);

            await waitFor(() => {
              expect(props.goToPath.calledWith('/review-and-submit')).to.be
                .true;
            });

            fetchRepStatusStub.restore();
            useReviewPageStub.restore();
          });
        });
      });

      context('when clicking the continue button', () => {
        it('routes to the review page', async () => {
          const { props, mockStore } = getProps({
            currentRep: repResults[0].data,
          });

          const useReviewPageStub = sinon
            .stub(reviewPageHook, 'useReviewPage')
            .returns(true);

          const container = renderContainer(props, mockStore);

          const forwardButton = container.querySelector('.usa-button-primary');

          fireEvent.click(forwardButton);

          await waitFor(() => {
            expect(props.goToPath.calledWith('/review-and-submit')).to.be.true;
          });

          useReviewPageStub.restore();
        });
      });
    });

    context('error states', () => {
      context('when the search input is invalid', () => {
        it('displays the no search error', async () => {
          const { mockStore, props } = getProps();

          const container = renderContainer(props, mockStore);

          const forwardButton = container.querySelector('.usa-button-primary');

          fireEvent.click(forwardButton);

          const searchBox = $('va-text-input', container);

          await waitFor(() => {
            expect(searchBox).to.have.attr(
              'error',
              'Enter the name of the accredited representative or VSO you’d like to appoint',
            );
          });
        });
      });

      context('when the search input is valid', () => {
        context('when there is no selected representative', () => {
          it('displays the no selection error', async () => {
            const { mockStore } = getProps();

            const props = {
              formData: {
                'view:representativeQuery': 'Valid Query',
                'view:selectedRepresentative': null,
              },
            };

            const container = renderContainer(props, mockStore);

            const forwardButton = container.querySelector(
              '.usa-button-primary',
            );

            fireEvent.click(forwardButton);

            const searchBox = $('va-text-input', container);

            await waitFor(() => {
              expect(searchBox).to.have.attr(
                'error',
                'Enter the name of the accredited representative or VSO you’d like to appoint',
              );
            });
          });
        });
      });
    });
  });
});
