import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { RepresentativeSubmissionMethod } from '../../../components/RepresentativeSubmissionMethod';
import { representativeSubmissionMethod } from '../../../pages';
import * as reviewPageHook from '../../../hooks/useReviewPage';

describe('<RepresentativeSubmissionMethod>', () => {
  const getProps = () => {
    return {
      props: {
        formData: {},
        goBack: sinon.spy(),
        goForward: sinon.spy(),
        goToPath: sinon.spy(),
      },
      mockStore: {
        getState: () => ({}),
        subscribe: () => {},
      },
    };
  };

  const renderContainer = (props, mockStore) => {
    return render(
      <Provider store={mockStore}>
        <RepresentativeSubmissionMethod {...props} />
      </Provider>,
    );
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <RepresentativeSubmissionMethod {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('displays an error', async () => {
    const { props, mockStore } = getProps();

    const { container } = renderContainer(props, mockStore);

    const radioSelector = container.querySelector('va-radio');

    const continueButton = container.querySelector('.usa-button-primary');

    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(radioSelector).to.have.attr(
        'error',
        'Choose how to submit your request by selecting an option',
      );
    });
  });

  context('non-review mode', () => {
    it('should call goBack with formData when handleGoBack is triggered and isReviewPage is false', () => {
      const { props, mockStore } = getProps();

      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'call')
        .returns(false);

      const { getByText } = renderContainer(props, mockStore);

      fireEvent.click(getByText('Back'));

      expect(props.goBack.calledOnce).to.be.true;
      expect(props.goBack.calledWith(props.formData)).to.be.true;

      useReviewPageStub.restore();
    });

    it('should call goForward with formData when handleGoForward is triggered and isReviewPage is false', () => {
      const { props, mockStore } = getProps();

      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'useReviewPage')
        .returns(false);

      props.formData.representativeSubmissionMethod = 'mail';

      const { getByText } = render(
        <Provider store={mockStore}>
          <RepresentativeSubmissionMethod {...props} />
        </Provider>,
      );

      fireEvent.click(getByText('Continue'));

      expect(props.goForward.calledOnce).to.be.true;
      expect(props.goForward.calledWith(props.formData)).to.be.true;
      expect(props.goToPath.called).to.be.false;

      useReviewPageStub.restore();
    });
  });

  context('review mode', () => {
    beforeEach(function() {
      Object.defineProperty(window, 'location', {
        value: { search: '?review=true' },
        writable: true,
      });
    });

    it('should call goToPath with the correct path when handleGoBack is triggered and isReviewPage is true', () => {
      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'useReviewPage')
        .returns(true);

      const { props, mockStore } = getProps();

      const { getByText } = renderContainer(props, mockStore);

      fireEvent.click(getByText('Back'));

      expect(props.goBack.called).to.be.false;
      expect(props.goToPath.calledOnce).to.be.true;
      expect(props.goToPath.calledWith('representative-contact?review=true')).to
        .be.true;

      useReviewPageStub.restore();
    });

    it('should call goToPath with /representative-organization?review=true when handleGoForward is triggered, isReviewPage is true, and isReplacingRep is true', () => {
      const { props, mockStore } = getProps();

      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'useReviewPage')
        .returns(true);

      props.formData.representativeSubmissionMethod = 'mail';

      const { getByText } = render(
        <Provider store={mockStore}>
          <RepresentativeSubmissionMethod {...props} />
        </Provider>,
      );

      fireEvent.click(getByText('Continue'));

      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.calledOnce).to.be.true;
      expect(
        props.goToPath.calledWith('/representative-organization?review=true'),
      ).to.be.true;

      useReviewPageStub.restore();
    });
  });

  context('pageDepends', () => {
    context('when v2 is not enabled', () => {
      it('returns false', () => {
        const formData = {
          'view:v2IsEnabled': false,
          'view:selectedRepresentative': {
            type: 'organization',
            attributes: { canAcceptDigitalPoaRequests: true },
          },
          userIsDigitalSubmitEligible: true,
          identityValidation: { hasIcn: true, hasParticipantId: true },
        };

        const result = representativeSubmissionMethod.pageDepends(formData);

        expect(result).to.be.false;
      });
    });

    context(
      'when the selected representative does not accept digital submission',
      () => {
        it('returns false', () => {
          const formData = {
            'view:v2IsEnabled': true,
            'view:selectedRepresentative': {
              type: 'organization',
              attributes: { canAcceptDigitalPoaRequests: false },
            },
            userIsDigitalSubmitEligible: true,
            identityValidation: { hasIcn: true, hasParticipantId: true },
          };

          const result = representativeSubmissionMethod.pageDepends(formData);

          expect(result).to.be.false;
        });
      },
    );

    context('when the user is not eligible for digital submission', () => {
      it('returns false', () => {
        const formData = {
          'view:v2IsEnabled': true,
          'view:selectedRepresentative': {
            type: 'organization',
            attributes: { canAcceptDigitalPoaRequests: true },
          },
          userIsDigitalSubmitEligible: false,
          identityValidation: { hasIcn: false, hasParticipantId: false },
        };

        const result = representativeSubmissionMethod.pageDepends(formData);

        expect(result).to.be.false;
      });
    });

    context('when all digital submission criteria met', () => {
      it('returns true', () => {
        const formData = {
          'view:v2IsEnabled': true,
          'view:selectedRepresentative': {
            type: 'organization',
            attributes: { canAcceptDigitalPoaRequests: true },
          },
          userIsDigitalSubmitEligible: true,
          identityValidation: { hasIcn: true, hasParticipantId: true },
        };

        const result = representativeSubmissionMethod.pageDepends(formData);

        expect(result).to.be.true;
      });
    });
  });
});
