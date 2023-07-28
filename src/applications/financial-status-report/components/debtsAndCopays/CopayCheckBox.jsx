import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { currency, endDate } from '../../utils/helpers';

const CopayCheckBox = ({ copay }) => {
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;

  const isChecked = selectedDebtsAndCopays?.some(
    currentCopay => currentCopay.id === copay.id,
  );

  const onChange = selectedCopay => {
    const alreadyIncluded = selectedDebtsAndCopays?.some(
      currentCopay => currentCopay.id === selectedCopay.id,
    );

    if (alreadyIncluded) {
      const checked = selectedDebtsAndCopays?.filter(
        copayEntry => copayEntry.id !== selectedCopay.id,
      );

      return dispatch(
        setData({
          ...formData,
          selectedDebtsAndCopays: checked,
        }),
      );
    }

    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays?.length
      ? [...selectedDebtsAndCopays, selectedCopay]
      : [selectedCopay];

    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: newlySelectedDebtsAndCopays,
      }),
    );
  };

  const facilityName =
    copay.station.facilityName ||
    getMedicalCenterNameByID(copay.station.facilitYNum);
  const dateby = endDate(copay.pSStatementDateOutput, 30);
  const checkboxMainText = `${currency(copay?.pHAmtDue)} for ${facilityName}`;
  const checkboxSubText = dateby ? `Pay or request help by ${dateby}` : '';

  return (
    <div
      className="vads-u-display--flex vads-u-margin-y--2"
      data-testid="copay-selection-checkbox"
    >
      <input
        name="request-help-with-copay"
        id={copay.id}
        type="checkbox"
        checked={isChecked || false}
        className="vads-u-width--auto"
        onChange={() => onChange(copay)}
      />
      <label className="vads-u-margin--0" htmlFor={copay.id}>
        <div className="vads-u-margin-left--4 vads-u-margin-top--neg3 vads-u-padding-top--0p25">
          <p className="vads-u-margin--0 vads-u-font-weight--bold">
            {checkboxMainText}
          </p>
          <p className="vads-u-margin--0 vads-u-font-size--sm vads-u-color--gray">
            {checkboxSubText}
          </p>
        </div>
      </label>
    </div>
  );
};

export default CopayCheckBox;
