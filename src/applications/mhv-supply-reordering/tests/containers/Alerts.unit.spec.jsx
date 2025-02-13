import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import Alerts from '../../containers/Alerts';

import { MDOT_ERROR_CODES } from '../../constants';
import reducers from '../../reducers';

const stateFn = ({
  supplies = [{ availableForReorder: true }],
  error = false,
} = {}) => ({
  mdotInProgressForm: {
    formData: {
      supplies,
    },
    error,
    loading: false,
  },
});

const setup = ({ initialState = stateFn() } = {}) =>
  renderInReduxProvider(<Alerts />, { initialState, reducers });

describe('<Alerts /> container', () => {
  it('renders nothing', () => {
    const { container } = setup();
    expect(container).to.be.empty;
  });

  it('renders <AlertDeceased />', () => {
    const initialState = stateFn({
      error: { code: MDOT_ERROR_CODES.DECEASED },
    });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('reorder-alert--deceased');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
  });

  it('renders <AlertNoRecordForUser />', () => {
    const initialState = stateFn({ error: { code: MDOT_ERROR_CODES.INVALID } });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('reorder-alert--no-record-for-user');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
  });

  it('renders <AlertReorderAccessExpired />', () => {
    const initialState = stateFn({
      error: { code: MDOT_ERROR_CODES.SUPPLIES_NOT_FOUND },
    });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('reorder-alert--reorder-access-expired');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
  });

  it('renders <AlertSomethingWentWrong />', () => {
    const initialState = stateFn({ error: { status: 500 } });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('reorder-alert--something-went-wrong');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
  });

  it('renders <AlertNoSuppliesForReorder />', () => {
    const initialState = stateFn({
      supplies: [{ nextAvailabilityDate: '2199-01-01' }],
    });
    const { getAllByTestId, getByTestId } = setup({ initialState });
    getByTestId('reorder-alert--no-supplies-for-reorder');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
  });
  it('renders <AlertNoSuppliesForReorder /> with undefined reOrderDate', () => {
    const initialState = stateFn({
      supplies: [{}],
    });
    const { getAllByTestId, getByTestId, queryByText } = setup({
      initialState,
    });
    getByTestId('reorder-alert--no-supplies-for-reorder');
    expect(getAllByTestId(/^reorder-alert--/).length).to.eq(1);
    expect(
      queryByText(
        `Our records show that your items aren’t available for reorder`,
      ),
    ).to.be.null;
  });
});
