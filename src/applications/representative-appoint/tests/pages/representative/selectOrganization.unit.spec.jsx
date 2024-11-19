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
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:selectedRepresentative': repResults[0].data },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
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

  it('should call goBack with formData when handleGoBack is triggered and isReviewPage is false', () => {
    const goBackSpy = sinon.spy();
    const goToPathSpy = sinon.spy();

    const { props, mockStore } = getProps({ setFormData: () => {} });
    props.goBack = goBackSpy;
    props.goToPath = goToPathSpy;

    const useReviewPageStub = sinon.stub(reviewPageHook, 'call').returns(false);

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );

    fireEvent.click(getByText('Back'));

    expect(goBackSpy.calledOnce).to.be.true;
    expect(goBackSpy.calledWith(props.formData)).to.be.true;

    useReviewPageStub.restore();
  });

  it('should call goToPath with the correct path when handleGoBack is triggered and isReviewPage is true', () => {
    const goBackSpy = sinon.spy();
    const goToPathSpy = sinon.spy();

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(true);

    const { props, mockStore } = getProps({ setFormData: () => {} });
    props.goBack = goBackSpy;
    props.goToPath = goToPathSpy;

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );

    fireEvent.click(getByText('Back'));

    expect(goBackSpy.called).to.be.false;
    expect(goToPathSpy.calledOnce).to.be.true;
    expect(goToPathSpy.calledWith('representative-contact?review=true')).to.be
      .true;

    useReviewPageStub.restore();
  });

  it('should call goForward with formData when handleGoForward is triggered and isReviewPage is false', () => {
    const goForwardSpy = sinon.spy();
    const goToPathSpy = sinon.spy();

    const { props, mockStore } = getProps();
    props.goForward = goForwardSpy;
    props.goToPath = goToPathSpy;

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(false);

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );

    fireEvent.click(getByText('Continue'));

    expect(goForwardSpy.calledOnce).to.be.true;
    expect(goForwardSpy.calledWith(props.formData)).to.be.true;
    expect(goToPathSpy.called).to.be.false;

    useReviewPageStub.restore();
  });

  it('should call goToPath with /representative-replace?review=true when handleGoForward is triggered, isReviewPage is true, and isReplacingRep is true', () => {
    const goForwardSpy = sinon.spy();
    const goToPathSpy = sinon.spy();

    const { props, mockStore } = getProps();
    props.goForward = goForwardSpy;
    props.goToPath = goToPathSpy;

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(true);

    props.formData['view:representativeStatus'] = { id: '123' };
    props.formData['view:selectedRepresentative'] = repResults[0].data;

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );

    fireEvent.click(getByText('Continue'));

    expect(goForwardSpy.called).to.be.false;
    expect(goToPathSpy.calledOnce).to.be.true;
    expect(goToPathSpy.calledWith('/representative-replace?review=true')).to.be
      .true;

    useReviewPageStub.restore();
  });

  it('should call goToPath with /review-and-submit when handleGoForward is triggered, isReviewPage is true, and isReplacingRep is false', () => {
    const goForwardSpy = sinon.spy();
    const goToPathSpy = sinon.spy();

    const { props, mockStore } = getProps();
    props.goForward = goForwardSpy;
    props.goToPath = goToPathSpy;

    const useReviewPageStub = sinon
      .stub(reviewPageHook, 'useReviewPage')
      .returns(true);
    props.formData['view:representativeStatus'] = null;
    props.formData['view:selectedRepresentative'] = repResults[0].data;

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectOrganization {...props} />
      </Provider>,
    );

    fireEvent.click(getByText('Continue'));

    expect(goForwardSpy.called).to.be.false;
    expect(goToPathSpy.calledOnce).to.be.true;
    expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;

    useReviewPageStub.restore();
  });
});
