import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import ArrayBuilderCards from '../ArrayBuilderCards';
import { initGetText, META_DATA_KEY } from '../helpers';

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
    hideDeleteButton = false,
    isIncomplete = () => false,
    fullData = {},
    duplicateChecks = {},
    duplicateCheckResult = {},
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
          hideDeleteButton={hideDeleteButton}
          nounSingular="employer"
          onRemoveAll={onRemoveAll}
          onRemove={onRemove}
          goToPath={goToPath}
          getText={getText}
          required={() => false}
          isReview={false}
          isIncomplete={isIncomplete}
          fullData={fullData}
          duplicateChecks={duplicateChecks}
          duplicateCheckResult={duplicateCheckResult}
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

  it('should render incomplete label & alert', () => {
    const { container, getText } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      isIncomplete: () => true,
    });

    expect(getText.calledWith('cardItemMissingInformation')).to.be.true;
    expect(container.querySelector('va-alert[status="error"]')).to.exist;
    expect(container.querySelector('.usa-label').textContent).to.eq(
      'INCOMPLETE',
    );
  });

  it('should render duplicate label & warning alert for possible duplicate entries', () => {
    const { container, getText } = setupArrayBuilderCards({
      arrayPath: 'path',
      arrayData: [{ name: 'Test' }],
      duplicateCheckResult: {
        duplicates: ['test'],
        arrayData: ['test'],
      },
    });

    expect(getText.calledWith('duplicateSummaryCardWarningOrErrorAlert')).to.be
      .true;
    expect(container.querySelector('va-alert[status="warning"]')).to.exist;
    expect(container.querySelector('.usa-label').textContent).to.eq(
      'POSSIBLE DUPLICATE',
    );
  });

  it('should render duplicate info alert with no label for possible duplicate entries', () => {
    const arrayData = [{ name: 'Test' }, { name: 'Test2' }, { name: 'Test' }];
    const { container, getText } = setupArrayBuilderCards({
      arrayPath: 'employers',
      arrayData,
      duplicateCheckResult: {
        duplicates: ['test'],
        arrayData: ['test'],
      },
      fullData: {
        employers: arrayData,
        [META_DATA_KEY]: {
          // Duplicate modal was dismissed
          'employers;test;allowDuplicate': true,
        },
      },
    });

    expect(getText.calledWith('duplicateSummaryCardInfoAlert')).to.be.true;
    expect(container.querySelector('va-alert[status="info"]')).to.exist;
    expect(container.querySelector('.usa-label')).to.not.exist;
  });

  it('should render incomplete label & alert over duplicate label & alert', () => {
    const { container, getText } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      isIncomplete: () => true,
      arrayPath: 'path',
      duplicateCheckResult: {
        duplicates: ['test'],
        arrayData: ['test'],
      },
    });

    expect(getText.calledWith('cardItemMissingInformation')).to.be.true;
    expect(container.querySelectorAll('va-alert').length).to.eq(1);
    expect(container.querySelector('.usa-label').textContent).to.eq(
      'INCOMPLETE',
    );
  });

  it('should hide delete button when hideDeleteButton is true', () => {
    const { container } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      hideDeleteButton: true,
    });

    expect(container.querySelector('va-link[text="Edit"]')).to.exist;
    expect(container.querySelector('va-button-icon[data-action="remove"]')).to
      .not.exist;
  });

  it('should show delete button when hideDeleteButton is false', () => {
    const { container } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      hideDeleteButton: false,
    });

    expect(container.querySelector('va-link[text="Edit"]')).to.exist;
    expect(container.querySelector('va-button-icon[data-action="remove"]')).to
      .exist;
  });

  it('should hide delete button for specific items when hideDeleteButton is a function returning true', () => {
    const { container } = setupArrayBuilderCards({
      arrayData: [{ name: 'Protected' }, { name: 'Normal' }],
      hideDeleteButton: itemData => itemData.name === 'Protected',
    });

    const deleteButtons = container.querySelectorAll(
      'va-button-icon[data-action="remove"]',
    );
    // Only one delete button should be present (for the 'Normal' item)
    expect(deleteButtons.length).to.eq(1);
  });

  it('should show all delete buttons when hideDeleteButton function returns false for all items', () => {
    const { container } = setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }, { name: 'Test 2' }],
      hideDeleteButton: () => false,
    });

    const deleteButtons = container.querySelectorAll(
      'va-button-icon[data-action="remove"]',
    );
    expect(deleteButtons.length).to.eq(2);
  });

  it('should pass correct arguments to hideDeleteButton function', () => {
    const hideDeleteButtonSpy = sinon.spy(() => false);
    setupArrayBuilderCards({
      arrayData: [{ name: 'Test' }],
      hideDeleteButton: hideDeleteButtonSpy,
    });

    expect(hideDeleteButtonSpy.calledOnce).to.be.true;
    const [itemData, index, formData] = hideDeleteButtonSpy.firstCall.args;
    expect(itemData).to.deep.equal({ name: 'Test' });
    expect(index).to.equal(0);
    expect(formData).to.deep.equal({
      employers: [{ name: 'Test' }],
      otherData: 'test',
    });
  });
});
