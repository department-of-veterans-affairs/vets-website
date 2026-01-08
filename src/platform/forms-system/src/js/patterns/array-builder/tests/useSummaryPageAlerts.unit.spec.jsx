import { renderHook, act } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import { useSummaryPageAlerts } from '../useSummaryPageAlerts';

describe('useSummaryPageAlerts', () => {
  let sandbox;
  const mockGetText = (key, item, data, index) => `${key}-${index}`;

  const defaultArrayBuilderOptions = {
    getText: mockGetText,
    nounSingular: 'item',
    nounPlural: 'items',
    hasItemsKey: 'hasItems',
    hideMaxItemsAlert: false,
  };

  const defaultCustomPageProps = {
    data: {},
    reviewErrors: null,
    recalculateErrors: null,
    name: 'testPage',
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Mock scrollAndFocus and focusElement
    sandbox
      .stub(require('platform/utilities/scroll'), 'scrollAndFocus')
      .returns();
    sandbox
      .stub(require('platform/utilities/ui/focus'), 'focusElement')
      .returns();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
      }),
    );

    expect(result.current.renderAlerts).to.be.a('function');
    expect(result.current.alertActions.showRemovedAlert).to.be.a('function');
    expect(result.current.alertsShown).to.be.false;
  });

  it('should show updated alert when updateItemIndex and updatedItemData provided', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
        updateItemIndex: 0,
        updatedItemData: { name: 'test' },
      }),
    );

    expect(result.current.alertsShown).to.be.true;
  });

  it('should show updated alert when updateItemIndex changes from null to a number', () => {
    const { result, rerender } = renderHook(
      ({ updateItemIndex, updatedItemData }) =>
        useSummaryPageAlerts({
          arrayBuilderOptions: defaultArrayBuilderOptions,
          customPageProps: defaultCustomPageProps,
          updateItemIndex,
          updatedItemData,
        }),
      {
        initialProps: { updateItemIndex: null, updatedItemData: null },
      },
    );

    expect(result.current.alertsShown).to.be.false;

    rerender({ updateItemIndex: 0, updatedItemData: { name: 'test' } });

    expect(result.current.alertsShown).to.be.true;
  });

  it('should show max items alert when isMaxItemsReached is true', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
        isMaxItemsReached: true,
      }),
    );

    expect(result.current.alertsShown).to.be.true;
  });

  it('should show review error alert when hasReviewError is true', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
        hasReviewError: true,
      }),
    );

    expect(result.current.alertsShown).to.be.true;
  });

  it('should handle showRemovedAlert handler', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
      }),
    );

    expect(result.current.alertsShown).to.be.false;

    act(() => {
      result.current.alertActions.showRemovedAlert('Item removed', 0);
    });

    expect(result.current.alertsShown).to.be.true;
  });

  it('should hide updated alert when removed alert is shown', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
        updateItemIndex: 0,
        updatedItemData: { name: 'test' },
      }),
    );

    expect(result.current.alertsShown).to.be.true;

    act(() => {
      result.current.alertActions.showRemovedAlert('Item removed', 1);
    });

    // Should still show alerts (removed alert is now showing)
    expect(result.current.alertsShown).to.be.true;
  });

  it('should call recalculateErrors when alerts change', () => {
    const recalculateErrors = sinon.spy();
    const pageName = 'testPage';

    const { rerender } = renderHook(
      ({ updateItemIndex, updatedItemData }) =>
        useSummaryPageAlerts({
          arrayBuilderOptions: defaultArrayBuilderOptions,
          customPageProps: {
            ...defaultCustomPageProps,
            recalculateErrors,
            name: pageName,
          },
          updateItemIndex,
          updatedItemData,
        }),
      {
        initialProps: {
          updateItemIndex: null,
          updatedItemData: null,
        },
      },
    );

    // Rerender with updated alert
    rerender({ updateItemIndex: 0, updatedItemData: { name: 'test' } });

    expect(recalculateErrors.calledWith(pageName)).to.be.true;
  });

  it('should return correct alertsShown value', () => {
    const { result, rerender } = renderHook(
      ({ isMaxItemsReached, hasReviewError }) =>
        useSummaryPageAlerts({
          arrayBuilderOptions: defaultArrayBuilderOptions,
          customPageProps: defaultCustomPageProps,
          isMaxItemsReached,
          hasReviewError,
        }),
      {
        initialProps: {
          isMaxItemsReached: false,
          hasReviewError: false,
        },
      },
    );

    expect(result.current.alertsShown).to.be.false;

    rerender({ isMaxItemsReached: true, hasReviewError: false });

    expect(result.current.alertsShown).to.be.true;
  });

  it('should provide renderAlerts function and handlers', () => {
    const { result } = renderHook(() =>
      useSummaryPageAlerts({
        arrayBuilderOptions: defaultArrayBuilderOptions,
        customPageProps: defaultCustomPageProps,
      }),
    );

    expect(result.current.renderAlerts).to.be.a('function');
    expect(result.current.alertActions).to.be.an('object');
    expect(result.current.alertActions.showRemovedAlert).to.be.a('function');
  });
});
