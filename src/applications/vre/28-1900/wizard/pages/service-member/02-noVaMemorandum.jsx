import React from 'react';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import { serviceMemberPathPageNames } from '../pageList';
import { handleChangeAndPageSet } from '../helpers';

const options = [
  { value: serviceMemberPathPageNames.yesIDES, label: 'Yes' },
  { value: serviceMemberPathPageNames.noIDES, label: 'No' },
];

const noVaMemorandum = ({ setPageState, state = {} }) => (
  <RadioButtons
    name={`${serviceMemberPathPageNames.noVaMemorandum}-option`}
    label={
      <p>
        Are you in the Integrated Disability Evaluation System (IDES){' '}
        <strong>or</strong> going through Physical Evaluation Board process?
      </p>
    }
    id={`${serviceMemberPathPageNames.noVaMemorandum}-option`}
    options={options}
    onValueChange={({ value }) =>
      handleChangeAndPageSet(
        setPageState,
        value,
        options,
        'Are you in the Integrated Disability Evaluation System (IDES)or going through Physical Evaluation Board process?',
      )
    }
    value={{ value: state.selected }}
    additionalFieldsetClass="vads-u-margin-top--0"
  />
);

export default {
  name: serviceMemberPathPageNames.noVaMemorandum,
  component: noVaMemorandum,
};
