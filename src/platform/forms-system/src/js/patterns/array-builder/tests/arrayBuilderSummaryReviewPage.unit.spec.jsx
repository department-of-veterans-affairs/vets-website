import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon-v20';
import ArrayBuilderSummaryReviewPage from '../ArrayBuilderSummaryReviewPage';

describe('ArrayBuilderSummaryReviewPage', () => {
  const defaultProps = {
    customPageProps: { data: { employers: [] } },
    arrayBuilderOptions: {
      nounSingular: 'employer',
      nounPlural: 'employers',
      getText: sinon.stub(),
    },
    arrayData: [],
    hideAdd: false,
    updatedItemData: null,
    addAnotherItemButtonClick: sinon.stub(),
    Alerts: sinon.stub().returns(<div data-testid="alerts" />),
    Cards: sinon.stub().returns(<div data-testid="cards" />),
    Title: sinon.stub().returns(<div data-testid="title" />),
  };

  const createGetTextStub = (map = {}) => {
    const stub = sinon.stub();
    Object.entries(map).forEach(([key, val]) => {
      stub.withArgs(key).returns(val);
    });
    return stub;
  };

  const renderComponent = (overrides = {}) => {
    const props = {
      ...defaultProps,
      ...overrides,
      arrayBuilderOptions: {
        ...defaultProps.arrayBuilderOptions,
        ...(overrides.arrayBuilderOptions || {}),
      },
    };
    const utils = render(<ArrayBuilderSummaryReviewPage {...props} />);
    return { ...utils, props };
  };

  afterEach(() => {
    sinon.restore();
  });

  context('when array is populated', () => {
    it('should render Title component', () => {
      const { props, getByTestId, queryByRole } = renderComponent({
        arrayData: [{ name: 'Test employer' }],
      });
      expect(getByTestId('title')).to.exist;
      expect(queryByRole('definition')).to.not.exist;
      sinon.assert.calledWith(props.Title, { textType: 'summaryTitle' });
    });

    it('should render summary description when `getText` returns content', () => {
      const summaryDescription = 'This is a description';
      const getText = createGetTextStub({
        summaryDescription,
        summaryTitle: 'Review your employers',
      });

      const { getByText } = renderComponent({
        arrayData: [{ name: 'Test' }],
        arrayBuilderOptions: { getText },
      });

      const desc = getByText(summaryDescription);
      expect(desc).to.exist;
      expect(desc.className).to.include('vads-u-font-family--sans');
    });

    it('should not render summary description when `getText` returns falsy', () => {
      const getText = createGetTextStub({
        summaryDescription: '',
        summaryTitle: 'Review your employers',
      });

      const { queryByText } = renderComponent({
        arrayData: [{ name: 'Test' }],
        arrayBuilderOptions: { getText },
      });

      expect(queryByText('This is a description')).to.not.exist;
    });
  });

  context('when array is empty', () => {
    it('should render Header and review structure', () => {
      const summaryTitle = 'Review your employers';
      const reviewQuestion = 'Do you have any employers?';
      const getText = createGetTextStub({
        summaryTitle,
        yesNoBlankReviewQuestion: reviewQuestion,
      });

      const { container, getByRole, queryByTestId } = renderComponent({
        arrayData: [],
        arrayBuilderOptions: { getText },
      });

      expect(queryByTestId('title')).to.not.exist;
      expect(getByRole('heading', { level: 4, name: summaryTitle })).to.exist;
      expect(container.querySelector('dl.review')).to.exist;
      expect(container.querySelector('dt')).to.include.text(reviewQuestion);
      expect(container.querySelector('dd span')).to.include.text('No');
    });

    it('should use correct heading level from `useHeadingLevels` hook', () => {
      const summaryTitle = 'Review your employers';
      const getText = createGetTextStub({ summaryTitle });

      const { getByRole, queryByRole } = renderComponent({
        arrayData: [],
        arrayBuilderOptions: {
          getText,
          reviewPanelHeadingLevel: '3',
        },
      });

      expect(getByRole('heading', { level: 3, name: summaryTitle })).to.exist;
      expect(queryByRole('heading', { level: 4 })).to.not.exist;
    });

    it('should call `getText` with correct parameters', () => {
      const getText = createGetTextStub({
        summaryTitle: 'Review your employers',
        yesNoBlankReviewQuestion: 'Do you have any employers?',
      });

      const customPageProps = { data: { test: 'data' } };
      const updatedItemData = { name: 'Updated' };

      renderComponent({
        arrayData: [],
        customPageProps,
        updatedItemData,
        arrayBuilderOptions: { getText },
      });

      expect(
        getText.calledWith(
          'summaryTitle',
          updatedItemData,
          customPageProps.data,
        ),
      ).to.be.true;

      expect(
        getText.calledWith(
          'yesNoBlankReviewQuestion',
          null,
          customPageProps.data,
        ),
      ).to.be.true;
    });
  });

  context('buttons and subcomponents', () => {
    it('should render add button when `hideAdd` prop is `false`', () => {
      const buttonText = 'Add another employer';
      const getText = createGetTextStub({ reviewAddButtonText: buttonText });

      const { container } = renderComponent({
        hideAdd: false,
        arrayBuilderOptions: { getText },
      });

      const addButton = container.querySelector('va-button[data-action="add"]');
      expect(addButton).to.exist;
      expect(addButton.getAttribute('text')).to.equal(buttonText);
      expect(addButton.getAttribute('name')).to.equal('employersAddButton');
    });

    it('should not render add button when `hideAdd` prop is `true`', () => {
      const { container } = renderComponent({ hideAdd: true });
      const addButton = container.querySelector('va-button[data-action="add"]');
      expect(addButton).to.not.exist;
    });

    it('should call `addAnotherItemButtonClick` when add button is clicked', () => {
      const getText = createGetTextStub({
        reviewAddButtonText: 'Add another employer',
      });
      const addAnotherItemButtonClick = sinon.stub();

      const { container } = renderComponent({
        addAnotherItemButtonClick,
        arrayBuilderOptions: { getText },
      });

      const addButton = container.querySelector('va-button[data-action="add"]');
      fireEvent.click(addButton);
      sinon.assert.calledOnce(addAnotherItemButtonClick);
    });

    it('should render Alerts and Cards components', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('alerts')).to.exist;
      expect(getByTestId('cards')).to.exist;
    });

    it('should pass correct data attributes to Header element', () => {
      const getText = createGetTextStub({
        summaryTitle: 'Review your employers',
      });

      const { container } = renderComponent({
        arrayData: [],
        arrayBuilderOptions: {
          nounSingular: 'employer',
          getText,
        },
      });

      const headerEl = container.querySelector('h4');
      expect(headerEl.getAttribute('data-title-for-noun-singular')).to.equal(
        'employer',
      );
      expect(headerEl.classList.contains('form-review-panel-page-header')).to.be
        .true;
      expect(headerEl.classList.contains('vads-u-font-size--h5')).to.be.true;
    });
  });
});
