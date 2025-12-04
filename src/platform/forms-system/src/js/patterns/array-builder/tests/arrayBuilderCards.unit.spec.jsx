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
    isIncomplete = () => false,
    fullData = {},
    duplicateChecks = {},
    duplicateCheckResult = {},
    hideCardDeleteButton,
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
          isIncomplete={isIncomplete}
          fullData={fullData}
          hideCardDeleteButton={hideCardDeleteButton}
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

  describe('hideCardDeleteButton', () => {
    it('should show delete button by default when hideCardDeleteButton is not set', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.exist;
    });

    it('should hide delete button when hideCardDeleteButton is true', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        hideCardDeleteButton: true,
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.not.exist;
    });

    it('should show delete button when hideCardDeleteButton is false', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        hideCardDeleteButton: false,
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.exist;
    });

    it('should hide delete button for specific cards when hideCardDeleteButton is a function returning true', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test1' }, { name: 'Test2' }],
        hideCardDeleteButton: ({ index }) => index === 0, // Hide for first item only
      });

      const deleteButtons = container.querySelectorAll(
        'va-button-icon[data-action="remove"]',
      );
      // Only one delete button should be visible (for the second item)
      expect(deleteButtons.length).to.eq(1);
    });

    it('should show all delete buttons when hideCardDeleteButton function returns false for all', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test1' }, { name: 'Test2' }],
        hideCardDeleteButton: () => false,
      });

      const deleteButtons = container.querySelectorAll(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButtons.length).to.eq(2);
    });

    it('should hide all delete buttons when hideCardDeleteButton function returns true for all', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test1' }, { name: 'Test2' }],
        hideCardDeleteButton: () => true,
      });

      const deleteButtons = container.querySelectorAll(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButtons.length).to.eq(0);
    });

    it('should pass correct arguments to hideCardDeleteButton function', () => {
      const hideCardDeleteButtonSpy = sinon.spy(() => false);
      const arrayData = [{ name: 'Test1' }, { name: 'Test2' }];
      const fullData = { employers: arrayData, otherData: 'test' };

      setupArrayBuilderCards({
        arrayData,
        fullData,
        hideCardDeleteButton: hideCardDeleteButtonSpy,
      });

      expect(hideCardDeleteButtonSpy.calledTwice).to.be.true;

      // Check first call arguments
      const firstCallArgs = hideCardDeleteButtonSpy.args[0][0];
      expect(firstCallArgs.itemData).to.deep.eq({ name: 'Test1' });
      expect(firstCallArgs.index).to.eq(0);
      expect(firstCallArgs.fullData).to.deep.eq(fullData);

      // Check second call arguments
      const secondCallArgs = hideCardDeleteButtonSpy.args[1][0];
      expect(secondCallArgs.itemData).to.deep.eq({ name: 'Test2' });
      expect(secondCallArgs.index).to.eq(1);
      expect(secondCallArgs.fullData).to.deep.eq(fullData);
    });
  });
});
