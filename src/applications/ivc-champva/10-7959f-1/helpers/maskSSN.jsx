import { formatSSN } from 'platform/utilities/ui';
import { useState, useEffect } from 'react';

function maskSSN(ssnString = '') {
  const strippedSSN = ssnString.replace(/[- ]/g, '');
  const maskedSSN = strippedSSN.replace(/^\d{1,5}/, digit =>
    digit.replace(/\d/g, '●'),
  );
  return formatSSN(maskedSSN);
}

const HandlePrefilledSSN = props => {
  const [val, setVal] = useState(props.value);
  const [setDisplayVal] = useState(props.value);

  useEffect(
    () => {
      setVal(maskSSN(val));
      setDisplayVal(maskSSN(val));
    },
    [setDisplayVal, val],
  );
};

export default HandlePrefilledSSN;
