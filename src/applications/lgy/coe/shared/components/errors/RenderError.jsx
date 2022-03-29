import React from 'react';
import { Error500 } from './Error500';
import { Error400 } from './Error400';
import SubwayMap from '../../../form/components/SubwayMap';

export const RenderError = ({ errors, introPage }) => {
  const regExFor500 = /^[5][0-9][0-9]$/;
  let subwayMap = null;
  if (introPage) {
    subwayMap = <SubwayMap />;
  }

  // If it is a 500 error
  if (errors.coe && regExFor500.test(errors?.coe[0]?.code)) {
    return (
      <>
        <Error500 />
        {subwayMap}
      </>
    );
  }

  // If it is any other kind of error
  return (
    <>
      <Error400 introPage={introPage} />
      {subwayMap}
    </>
  );
};
