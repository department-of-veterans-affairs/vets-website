import React from 'react';
import { mentalHealthSupportResources } from './form0781';

export const mentalHealthSupportPageTitle = 'Mental health support';

export const mentalHealthSupportDescription = () => {
  return (
    <>
      <p>
        On the next screen, we’ll ask you about your mental health conditions.
      </p>
      <p>
        First, we want you to know that you can get support for your mental
        health any time, day or night.
      </p>
      <h4>Resources that may be helpful</h4>
      <br />
      {mentalHealthSupportResources}
    </>
  );
};
