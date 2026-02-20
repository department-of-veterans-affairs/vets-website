import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { fireEvent, render } from '@testing-library/react';
import ArrayBuilderCancelButton, {
  formatPath,
} from '../ArrayBuilderCancelButton';
import * as helpers from '../helpers';

const mockRedux = ({
  review = false,
  submitted = false,
  formData = {},
  onChange = () => {},
  setFormData = () => {},
} = {}) => {
  return {
    props: {
      onChange,
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData,
      setFormData,
    },
    mockStore: {
      getState: () => ({
        form: { data: formData },
        formContext: {
          onReviewPage: false,
          reviewMode: false,
          submitted: false,
          touched: {},
        },
      }),
      subscribe: () => {},
      dispatch: action => {
        if (action.type === SET_DATA) {
          return setFormData(action.data);
        }
        return null;
      },
    },
  };
};

describe('ArrayBuilderCancelButton', () => {
  let getArrayUrlSearchParamsStub;
  let getIndexStub;

  function stubUrlParams(str) {
    getArrayUrlSearchParamsStub = sinon
      .stub(helpers, 'getArrayUrlSearchParams')
      .returns(new URLSearchParams(str));
  }

  function stubUrlIndex(index) {
    getIndexStub = sinon
      .stub(helpers, 'getArrayIndexFromPathName')
      .returns(index);
  }

  afterEach(() => {
    if (getArrayUrlSearchParamsStub) {
      getArrayUrlSearchParamsStub.restore();
      getArrayUrlSearchParamsStub = null;
    }
    if (getIndexStub) {
      getIndexStub.restore();
      getIndexStub = null;
    }
  });

  function setupArrayBuilderCancelButton({
    index = 0,
    urlParams = '',
    arrayData = [],
    nestedArrayCallback = null,
  }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    let getText = key => key;
    getText = sinon.spy(getText);
    stubUrlIndex(index);
    stubUrlParams(urlParams);
    const { mockStore } = mockRedux({
      formData: {
        employers: arrayData,
      },
      setFormData,
    });

    const { container } = render(
      <Provider store={mockStore}>
        <ArrayBuilderCancelButton
          arrayPath="employers"
          goToPath={goToPath}
          summaryRoute="/summary"
          introRoute="/intro"
          getText={getText}
          className="test"
          reviewRoute="/review"
          nestedArrayCallback={nestedArrayCallback}
          required={() => true}
        />
      </Provider>,
    );

    return { setFormData, goToPath, getText, container };
  }

  it('should render edit fields for ArrayBuilderCancelButton', () => {
    const { getText } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(getText.calledWith('cancelEditTitle')).to.be.true;
    expect(getText.calledWith('cancelEditDescription')).to.be.true;
    expect(getText.calledWith('cancelEditYes')).to.be.true;
    expect(getText.calledWith('cancelEditNo')).to.be.true;
  });

  it('should render add fields for ArrayBuilderCancelButton', () => {
    const { getText } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(getText.calledWith('cancelAddTitle')).to.be.true;
    expect(getText.calledWith('cancelAddDescription')).to.be.true;
    expect(getText.calledWith('cancelAddYes')).to.be.true;
    expect(getText.calledWith('cancelAddNo')).to.be.true;
  });

  it('should render review add fields for ArrayBuilderCancelButton', () => {
    const { getText } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?add=true&review=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(getText.calledWith('cancelAddTitle')).to.be.true;
    expect(getText.calledWith('cancelAddReviewDescription')).to.be.true;
    expect(getText.calledWith('cancelAddYes')).to.be.true;
    expect(getText.calledWith('cancelAddNo')).to.be.true;
  });

  it('should render review edit fields for ArrayBuilderCancelButton', () => {
    const { getText } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?edit=true&review=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(getText.calledWith('cancelEditTitle')).to.be.true;
    expect(getText.calledWith('cancelEditReviewDescription')).to.be.true;
    expect(getText.calledWith('cancelEditYes')).to.be.true;
    expect(getText.calledWith('cancelEditNo')).to.be.true;
  });

  it('should not remove data when cancelling in edit flow', () => {
    const { container, setFormData, goToPath } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    fireEvent.click(container.querySelector('va-button'));
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.called).to.be.false;
    expect(goToPath.calledWith('/summary')).to.be.true;
  });

  it('should remove data when cancelling in add flow and go back to intro if now 0 items', () => {
    const { container, setFormData, goToPath } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Test' }],
    });

    fireEvent.click(container.querySelector('va-button'));
    fireEvent.click(
      container.querySelector('va-button[text="cancelAddButtonText"]'),
    );
    fireEvent.click(container.querySelector('va-button'));
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.calledWith({ employers: [] })).to.be.true;
    expect(goToPath.calledWith('/intro')).to.be.true;
  });

  it('should remove data when cancelling in add flow and go back to summary if now 1 or more items', () => {
    const { container, setFormData, goToPath } = setupArrayBuilderCancelButton({
      index: 1,
      urlParams: '?add=true',
      arrayData: [{ name: 'Test' }, { name: 'Test 2' }],
    });

    fireEvent.click(container.querySelector('va-button'));
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.calledWith({ employers: [{ name: 'Test' }] })).to.be
      .true;
    expect(goToPath.calledWith('/summary')).to.be.true;
  });

  it('should not perform any action, but instead call nestedArrayCallback', () => {
    const nestedArrayCallback = sinon.spy();
    const { container, setFormData, goToPath } = setupArrayBuilderCancelButton({
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
      nestedArrayCallback,
    });

    fireEvent.click(container.querySelector('va-button'));
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(nestedArrayCallback.called).to.be.true;
    expect(setFormData.called).to.be.false;
    expect(goToPath.called).to.be.false;
  });
});

describe('formatPath', () => {
  it('should return a path without changing it', () => {
    const result = formatPath('/test/path');
    expect(result).to.equal('/test/path');
  });
  it('should return a path with a leading slash', () => {
    const result = formatPath('test/path');
    expect(result).to.equal('/test/path');
  });
});
