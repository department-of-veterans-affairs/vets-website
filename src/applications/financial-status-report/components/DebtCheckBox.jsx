import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { format, isValid } from 'date-fns';
import { head } from 'lodash';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { currency, endDate } from '../utils/helpers';

const DebtCheckBox = ({ debt }) => {
  const debtIdentifier = `${debt.currentAr}-${debt.originalAr}`;
  const dispatch = useDispatch();
  // most recent debt history entry
  const dates = debt?.debtHistory?.map(m => new Date(m.date)) ?? [];
  const sortedHistory = dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  const mostRecentDate = isValid(head(sortedHistory))
    ? format(head(sortedHistory), 'MM/dd/yyyy')
    : '';

  const formData = useSelector(state => state.form.data);
  const { selectedDebts } = formData;

  const isChecked = selectedDebts?.some(
    currentDebt => currentDebt.id === debt.id,
  );

  const onChange = selectedDebt => {
    const alreadyIncluded = selectedDebts?.some(
      currentDebt => currentDebt.id === selectedDebt.id,
    );

    if (alreadyIncluded) {
      const checked = selectedDebts?.filter(
        debtEntry => debtEntry.id !== selectedDebt.id,
      );

      return dispatch(setData({ ...formData, selectedDebts: checked }));
    }
    const newFsrDebts = selectedDebts?.length
      ? [...selectedDebts, selectedDebt]
      : [selectedDebt];

    return dispatch(
      setData({
        ...formData,
        selectedDebts: newFsrDebts,
      }),
    );
  };

  const checkboxMainText = `${currency(debt?.currentAr)} for ${deductionCodes[
    debt.deductionCode
  ] || debt.benefitType}`;
  const dateby = endDate(mostRecentDate, 30);
  const checkboxSubText = dateby ? `Pay or request help by ${dateby}` : '';

  return (
    <div className="vads-u-display--flex vads-u-margin-y--2">
      <input
        name="request-help-with-debt"
        id={debtIdentifier}
        type="checkbox"
        checked={isChecked || false}
        className="vads-u-width--auto"
        onChange={() => onChange(debt)}
      />
      <label className="vads-u-margin--0" htmlFor={debtIdentifier}>
        <div className="vads-u-margin-left--4 vads-u-margin-top--neg3">
          <p className="vads-u-margin--0">{checkboxMainText}</p>
          <p className="vads-u-margin--0 vads-u-font-size--sm vads-u-color--gray">
            {checkboxSubText}
          </p>
        </div>
      </label>
    </div>
  );
};

DebtCheckBox.propTypes = {
  debt: PropTypes.shape({
    benefitType: PropTypes.string,
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    diaryCode: PropTypes.string,
    id: PropTypes.number,
    originalAr: PropTypes.number,
  }),
};

export default DebtCheckBox;
