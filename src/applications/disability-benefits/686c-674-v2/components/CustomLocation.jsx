import React, { useState, useEffect } from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import { useSelector, useDispatch } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  // updateLocationState,
  resetLocationState,
} from '../actions/custom-location';
import { STATE_NAMES, STATE_VALUES } from '../config/helpers';

export default function CustomLocation() {
  const outsideUsa = useSelector(
    state => state?.form?.data?.currentMarriageInformation?.outsideUsa,
  );

  const dispatch = useDispatch();

  const oldFormData = useSelector(state => state?.form?.data);

  const [selectedState, setSelectedState] = useState(null);

  const handleSelectChange = event => {
    const { value } = event.target;
    // console.log(value);
    setSelectedState(value);
    dispatch(
      setData({
        ...oldFormData,
        currentMarriageInformation: {
          ...oldFormData?.currentMarriageInformation,
          location: {
            ...oldFormData?.currentMarriageInformation?.location,
            state: value,
          },
        },
      }),
    );
  };

  useEffect(
    () => {
      if (outsideUsa) {
        setSelectedState(null);
        dispatch(resetLocationState());
      }
    },
    [outsideUsa, dispatch],
  );

  const getOptions = () => {
    return !outsideUsa
      ? STATE_NAMES.map((name, index) => (
          <option key={STATE_VALUES[index]} value={STATE_VALUES[index]}>
            {name}
          </option>
        ))
      : null;
  };
  return (
    <VaSelect
      label="State"
      {...(!outsideUsa ? { required: true } : { inert: true })}
      name="options"
      value={selectedState}
      onVaSelect={handleSelectChange}
    >
      {getOptions()}
    </VaSelect>
  );

  // const mapStateToProps = state => {
  //   return {
  //     state: state?.form?.data?.currentMarriageInformation?.location?.state,
  //     outsideUsa: state?.form?.data?.currentMarriageInformation?.outsideUsa,
  //   };
  // };

  // const mapDispatchToProps = {
  //   updateLocationState,
  //   resetLocationState,
}
