import React from 'react';
import { Error500 } from './Error500';
import { Error400 } from './Error400';
import SubwayMap from '../../../form/components/SubwayMap';

export const RenderError = ({ error, introPage }) => {
  const regExFor500 = /^[5][0-9][0-9]$/;
  let subwayMap = null;
  if (introPage) {
    subwayMap = <SubwayMap />;
  }

  if (error && regExFor500.test(error)) {
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
      <Error400 />
      {subwayMap}
    </>
  );
};
