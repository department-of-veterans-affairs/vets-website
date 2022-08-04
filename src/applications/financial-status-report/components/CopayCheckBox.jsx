import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { currency, endDate } from '../utils/helpers';

const CopayCheckBox = ({ copay }) => {
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const { selectedCopays } = formData;

  const isChecked = selectedCopays?.some(
    currentCopay => currentCopay.id === copay.id,
  );

  const onChange = selectedCopay => {
    const alreadyIncluded = selectedCopays?.some(
      currentCopay => currentCopay.id === selectedCopay.id,
    );

    if (alreadyIncluded) {
      const checked = selectedCopays?.filter(
        copayEntry => copayEntry.id !== selectedCopay.id,
      );

      return dispatch(setData({ ...formData, selectedCopays: checked }));
    }
    const newFsrCopays = selectedCopays?.length
      ? [...selectedCopays, selectedCopay]
      : [selectedCopay];

    return dispatch(
      setData({
        ...formData,
        selectedCopays: newFsrCopays,
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
    <div className="vads-u-display--flex vads-u-margin-y--2">
      <input
        name="request-help-with-copay"
        id={copay.id}
        type="checkbox"
        checked={isChecked || false}
        className="vads-u-width--auto"
        onChange={() => onChange(copay)}
      />
      <label className="vads-u-margin--0" htmlFor={copay.id}>
        <p className="vads-u-margin--0 vads-u-display--inline">
          {checkboxMainText}
        </p>
        <p className="vads-u-margin-left--4 vads-u-margin-y--0 vads-u-font-size--sm vads-u-color--gray">
          {checkboxSubText}
        </p>
      </label>
    </div>
  );
};

CopayCheckBox.propTypes = {
  copay: PropTypes.shape({
    id: PropTypes.string,
    pHAmtDue: PropTypes.number,
    pSStatementDateOutput: PropTypes.string,
    station: PropTypes.shape({
      facilityName: PropTypes.string,
      facilitYNum: PropTypes.string,
    }),
  }),
};

export default CopayCheckBox;
