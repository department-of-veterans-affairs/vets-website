import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import ArrayBuilderCards from '../ArrayBuilderCards';
import { initGetText } from '../helpers';

const mockRedux = ({
  review = false,
  submitted = false,
  formData = {},
  onChange = () => {},
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
      dispatch: () => {},
    },
  };
};

describe('ArrayBuilderCards', () => {
  function setupArrayBuilderCards({
    arrayData = [],
    cardDescription = 'cardDescription',
    getItemName = (item, index) => `getItemName ${index + 1}`,
  }) {
    const goToPath = sinon.spy();
    const onRemoveAll = sinon.spy();
    const onRemove = sinon.spy();
    let getText = initGetText({
      textOverrides: { cardDescription },
      nounPlural: 'employers',
      nounSingular: 'employer',
      getItemName,
    });
    getText = sinon.spy(getText);
    const { mockStore } = mockRedux({
      formData: {
        employers: arrayData,
        otherData: 'test',
      },
    });

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <ArrayBuilderCards
          arrayPath="employers"
          getEditItemPathUrl={() => 'edit'}
          nounSingular="employer"
          onRemoveAll={onRemoveAll}
          onRemove={onRemove}
          goToPath={goToPath}
          getText={getText}
          required={() => false}
          isReview={false}
        />
      </Provider>,
    );

    return {
      goToPath,
      getText,
      onRemove,
      onRemoveAll,
      container,
      getByText,
    };
  }

  it('should render proper text for ArrayBuilderCards', () => {
    const { container, getByText, getText } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
    });

    expect(container.querySelector('va-link[text="Edit"]')).to.exist;
    expect(getText.calledWith('cardDescription')).to.be.true;
    expect(getText.calledWith('getItemName')).to.be.true;
    expect(getByText('getItemName 1')).to.exist;
  });

  it('should handle remove flow correctly', () => {
    const { container, onRemove, onRemoveAll } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }, { name: 'Test 2' }],
    });

    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    sinon.assert.called(onRemove);
    sinon.assert.notCalled(onRemoveAll);
  });

  it('should call remove all if there are no items', () => {
    const { container, onRemoveAll } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
    });

    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    sinon.assert.called(onRemoveAll);
  });

  it('should pass full data into cardDescription', () => {
    const cardDescriptionSpy = sinon.spy();
    const getItemNameSpy = sinon.spy();
    const { container, getText } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      cardDescription: cardDescriptionSpy,
      getItemName: getItemNameSpy,
    });

    expect(container.querySelector('va-link[text="Edit"]')).to.exist;
    expect(getText.calledWith('cardDescription')).to.be.true;
    expect(getText.calledWith('getItemName')).to.be.true;
    const functionArgs = [
      { name: 'Test' },
      0,
      { employers: [{ name: 'Test' }], otherData: 'test' },
    ];
    expect(cardDescriptionSpy.args[0]).to.be.deep.equal(functionArgs);
    expect(getItemNameSpy.args[0]).to.be.deep.equal(functionArgs);
  });
});
