import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { fireEvent, render } from '@testing-library/react';
import ArrayBuilderCards from '../ArrayBuilderCards';

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

describe('ArrayBuilderCards', () => {
  function setupArrayBuilderCards({ arrayData = [] }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    const onRemoveAll = sinon.spy();
    const onRemove = sinon.spy();
    let getText = key => key;
    getText = sinon.spy(getText);
    const { mockStore } = mockRedux({
      formData: {
        employers: arrayData,
      },
      setFormData,
    });

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <ArrayBuilderCards
          arrayPath="employers"
          editItemPathUrl="edit"
          nounSingular="employer"
          onRemoveAll={onRemoveAll}
          onRemove={onRemove}
          goToPath={goToPath}
          getText={getText}
          required={() => false}
          isReview={false}
          forceRerender={() => null}
        />
      </Provider>,
    );

    return {
      setFormData,
      goToPath,
      getText,
      onRemoveAll,
      container,
      getByText,
    };
  }

  it('should render proper text for ArrayBuilderCards', () => {
    const { getByText, getText } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
    });

    expect(getByText('Edit')).to.exist;
    expect(getText.calledWith('cardDescription')).to.be.true;
    expect(getText.calledWith('getItemName')).to.be.true;
  });

  it('should handle remove flow correctly', () => {
    const { container, setFormData, onRemoveAll } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }, { name: 'Test 2' }],
    });

    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.called).to.be.true;
    expect(onRemoveAll.called).to.be.false;
  });

  it('should call remove all if there are no items', () => {
    const { container, setFormData, onRemoveAll } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
    });

    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.called).to.be.true;
    expect(setFormData.args[0][0].employers).to.eql([]);
    expect(onRemoveAll.called).to.be.true;
  });
});
