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
    canEditItem,
    canDeleteItem,
    isReview = false,
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
          isReview={isReview}
          isIncomplete={isIncomplete}
          fullData={fullData}
          canEditItem={canEditItem}
          canDeleteItem={canDeleteItem}
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

  describe('canEditItem', () => {
    it('should show edit link by default when canEditItem is not set', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      expect(editLink).to.exist;
    });

    it('should hide edit link when canEditItem returns false', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canEditItem: () => false,
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      expect(editLink).to.not.exist;
    });

    it('should show edit link when canEditItem returns true', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canEditItem: () => true,
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      expect(editLink).to.exist;
    });

    it('should hide edit link for specific items based on function result', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test1' }, { name: 'Test2' }],
        canEditItem: ({ index }) => index !== 0, // Hide for first item only
      });

      const editLinks = container.querySelectorAll(
        'va-link[data-action="edit"]',
      );
      // Only one edit link should be visible (for the second item)
      expect(editLinks.length).to.eq(1);
    });

    it('should pass correct arguments to canEditItem function', () => {
      const canEditItemSpy = sinon.spy(() => true);
      const arrayData = [{ name: 'Test1' }, { name: 'Test2' }];
      const fullData = { employers: arrayData, otherData: 'test' };

      setupArrayBuilderCards({
        arrayData,
        fullData,
        isReview: true,
        canEditItem: canEditItemSpy,
      });

      expect(canEditItemSpy.calledTwice).to.be.true;

      // Check first call arguments
      const firstCallArgs = canEditItemSpy.args[0][0];
      expect(firstCallArgs.itemData).to.deep.eq({ name: 'Test1' });
      expect(firstCallArgs.index).to.eq(0);
      expect(firstCallArgs.fullData).to.deep.eq(fullData);
      expect(firstCallArgs.isReview).to.eq(true);

      // Check second call arguments
      const secondCallArgs = canEditItemSpy.args[1][0];
      expect(secondCallArgs.itemData).to.deep.eq({ name: 'Test2' });
      expect(secondCallArgs.index).to.eq(1);
      expect(secondCallArgs.fullData).to.deep.eq(fullData);
      expect(secondCallArgs.isReview).to.eq(true);
    });
  });

  describe('canDeleteItem', () => {
    it('should show delete button by default when canDeleteItem is not set', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.exist;
    });

    it('should hide delete button when canDeleteItem returns false', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canDeleteItem: () => false,
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.not.exist;
    });

    it('should show delete button when canDeleteItem returns true', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canDeleteItem: () => true,
      });

      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(deleteButton).to.exist;
    });

    it('should hide delete button for specific items based on function result', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test1' }, { name: 'Test2' }],
        canDeleteItem: ({ index }) => index !== 0, // Hide for first item only
      });

      const deleteButtons = container.querySelectorAll(
        'va-button-icon[data-action="remove"]',
      );
      // Only one delete button should be visible (for the second item)
      expect(deleteButtons.length).to.eq(1);
    });

    it('should pass correct arguments to canDeleteItem function', () => {
      const canDeleteItemSpy = sinon.spy(() => true);
      const arrayData = [{ name: 'Test1' }, { name: 'Test2' }];
      const fullData = { employers: arrayData, otherData: 'test' };

      setupArrayBuilderCards({
        arrayData,
        fullData,
        isReview: true,
        canDeleteItem: canDeleteItemSpy,
      });

      expect(canDeleteItemSpy.calledTwice).to.be.true;

      // Check first call arguments
      const firstCallArgs = canDeleteItemSpy.args[0][0];
      expect(firstCallArgs.itemData).to.deep.eq({ name: 'Test1' });
      expect(firstCallArgs.index).to.eq(0);
      expect(firstCallArgs.fullData).to.deep.eq(fullData);
      expect(firstCallArgs.isReview).to.eq(true);

      // Check second call arguments
      const secondCallArgs = canDeleteItemSpy.args[1][0];
      expect(secondCallArgs.itemData).to.deep.eq({ name: 'Test2' });
      expect(secondCallArgs.index).to.eq(1);
      expect(secondCallArgs.fullData).to.deep.eq(fullData);
      expect(secondCallArgs.isReview).to.eq(true);
    });
  });

  describe('canEditItem and canDeleteItem together', () => {
    it('should hide both edit and delete when both functions return false', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canEditItem: () => false,
        canDeleteItem: () => false,
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(editLink).to.not.exist;
      expect(deleteButton).to.not.exist;
    });

    it('should show both edit and delete when both functions return true', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canEditItem: () => true,
        canDeleteItem: () => true,
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(editLink).to.exist;
      expect(deleteButton).to.exist;
    });

    it('should allow independent control of edit and delete', () => {
      const { container } = setupArrayBuilderCards({
        arrayData: [{ name: 'Test' }],
        canEditItem: () => true,
        canDeleteItem: () => false,
      });

      const editLink = container.querySelector('va-link[data-action="edit"]');
      const deleteButton = container.querySelector(
        'va-button-icon[data-action="remove"]',
      );
      expect(editLink).to.exist;
      expect(deleteButton).to.not.exist;
    });
  });
});
