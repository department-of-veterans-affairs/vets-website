import React, { useState } from 'react';
import { withRouter } from 'react-router';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import withFeatureFlip from '../containers/withFeatureFlip.jsx';

const Insurance = props => {
  const { router } = props;
  const [needToUpdate, setNeedToUpdate] = useState();

  const handleContinueClick = () => {
    if (needToUpdate === 'Yes') {
      const url = '/some-token/failed';
      router.push(url);
    } else if (needToUpdate === 'No') {
      const url = '/some-token/details';
      router.push(url);
    }
  };

  return (
    <div className={'vads-u-margin--1p5'}>
      <h1>
        Do you need to update your contact, next of kin, or insurance
        information?
      </h1>
      <div
        style={{
          paddingLeft: '1em',
        }}
      >
        <RadioButtons
          onValueChange={e => {
            setNeedToUpdate(e.value);
          }}
          options={['Yes', 'No']}
          value={{ value: needToUpdate }}
        />
      </div>
      <button
        type="button"
        className="usa-button"
        onClick={handleContinueClick}
      >
        Continue
      </button>
    </div>
  );
};

export default withRouter(withFeatureFlip(Insurance));
