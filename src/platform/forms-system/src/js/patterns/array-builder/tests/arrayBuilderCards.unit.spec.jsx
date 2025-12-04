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

  describe('hideDeleteButtonOnReviewPage', () => {
    function setupArrayBuilderCardsWithReview({
      arrayData = [],
      isReview = false,
      hideDeleteButtonOnReviewPage,
      fullData = {},
    }) {
      const goToPath = sinon.spy();
      const onRemoveAll = sinon.spy();
      const onRemove = sinon.spy();
      let getText = initGetText({
        textOverrides: { cardDescription: 'description' },
        nounPlural: 'employers',
        nounSingular: 'employer',
        getItemName: (item, index) => `getItemName ${index + 1}`,
      });
      getText = sinon.spy(getText);
      const { mockStore } = mockRedux({
        formData: {
          employers: arrayData,
          otherData: 'test',
        },
      });

      const { container } = render(
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
            isIncomplete={() => false}
            fullData={fullData}
            hideDeleteButtonOnReviewPage={hideDeleteButtonOnReviewPage}
          />
        </Provider>,
      );

      return { container };
    }

    it('should show delete button when hideDeleteButtonOnReviewPage is false on review page', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'Test' }],
        isReview: true,
        hideDeleteButtonOnReviewPage: false,
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .exist;
    });

    it('should hide delete button when hideDeleteButtonOnReviewPage is true on review page', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'Test' }],
        isReview: true,
        hideDeleteButtonOnReviewPage: true,
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .not.exist;
    });

    it('should show delete button when hideDeleteButtonOnReviewPage is true but not on review page', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'Test' }],
        isReview: false,
        hideDeleteButtonOnReviewPage: true,
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .exist;
    });

    it('should hide delete button when hideDeleteButtonOnReviewPage function returns true on review page', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'ShouldHide' }],
        isReview: true,
        hideDeleteButtonOnReviewPage: itemData =>
          itemData.name === 'ShouldHide',
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .not.exist;
    });

    it('should show delete button when hideDeleteButtonOnReviewPage function returns false on review page', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'ShouldShow' }],
        isReview: true,
        hideDeleteButtonOnReviewPage: itemData =>
          itemData.name === 'ShouldHide',
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .exist;
    });

    it('should show delete button when hideDeleteButtonOnReviewPage is undefined', () => {
      const { container } = setupArrayBuilderCardsWithReview({
        arrayData: [{ name: 'Test' }],
        isReview: true,
      });

      expect(container.querySelector('va-button-icon[data-action="remove"]')).to
        .exist;
    });
  });
});
