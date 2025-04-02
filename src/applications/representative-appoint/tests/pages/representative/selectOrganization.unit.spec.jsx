import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { SelectOrganization } from '../../../components/SelectOrganization';
import repResults from '../../fixtures/data/representative-results.json';
import * as reviewPageHook from '../../../hooks/useReviewPage';

describe('<SelectOrganization>', () => {
  const getProps = ({ submitted = false, setFormData = () => {} } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },
        formData: { 'view:selectedRepresentative': repResults[0].data },
        setFormData,
        goBack: sinon.spy(),
        goForward: sinon.spy(),
        goToPath: sinon.spy(),
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:selectedRepresentative': repResults[0].data },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData,
        }),
      },
    };
  };

  const renderContainer = (props, mockStore) => {
    return render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  context('non-review mode', () => {
    it('should call goBack with formData when handleGoBack is triggered and isReviewPage is false', () => {
      const { props, mockStore } = getProps({ setFormData: () => {} });

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

      props.formData.selectedAccreditedOrganizationId = '123';

      const { getByText } = render(
        <Provider store={mockStore}>
          <SelectOrganization {...props} />
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

      const { props, mockStore } = getProps({ setFormData: () => {} });

      const { getByText } = renderContainer(props, mockStore);

      fireEvent.click(getByText('Back'));

      expect(props.goBack.called).to.be.false;
      expect(props.goToPath.calledOnce).to.be.true;
      expect(props.goToPath.calledWith('representative-contact?review=true')).to
        .be.true;

      useReviewPageStub.restore();
    });

    it('should call goToPath with /representative-replace?review=true when handleGoForward is triggered, isReviewPage is true, and isReplacingRep is true', () => {
      const { props, mockStore } = getProps();

      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'useReviewPage')
        .returns(true);

      props.formData['view:representativeStatus'] = { id: '123' };
      props.formData['view:selectedRepresentative'] = repResults[0].data;
      props.formData.selectedAccreditedOrganizationId = '123';

      const { getByText } = render(
        <Provider store={mockStore}>
          <SelectOrganization {...props} />
        </Provider>,
      );

      fireEvent.click(getByText('Continue'));

      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.calledOnce).to.be.true;
      expect(props.goToPath.calledWith('/representative-replace?review=true'))
        .to.be.true;

      useReviewPageStub.restore();
    });

    it('should call goToPath with /review-and-submit when handleGoForward is triggered, isReviewPage is true, and isReplacingRep is false', () => {
      const { props, mockStore } = getProps();

      const useReviewPageStub = sinon
        .stub(reviewPageHook, 'useReviewPage')
        .returns(true);
      props.formData['view:representativeStatus'] = null;
      props.formData['view:selectedRepresentative'] = repResults[0].data;

      props.formData.selectedAccreditedOrganizationId = '123';

      const { getByText } = render(
        <Provider store={mockStore}>
          <SelectOrganization {...props} />
        </Provider>,
      );

      fireEvent.click(getByText('Continue'));

      expect(props.goForward.called).to.be.false;
      expect(props.goToPath.calledOnce).to.be.true;
      expect(props.goToPath.calledWith('/review-and-submit')).to.be.true;

      useReviewPageStub.restore();
    });
  });
});
