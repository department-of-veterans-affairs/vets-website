import React from 'react';
import { useSelector } from 'react-redux';

const YellowRibbonProgramTitle = ({ text }) => {
  const institutionDetails = useSelector(
    state => state.form?.data?.institutionDetails,
  );
  const { isUsaSchool } = institutionDetails || {};

  const title = `${text} Yellow Ribbon Program contributions ${
    isUsaSchool ? '(U.S. schools)' : '(foreign schools)'
  }`;

  return (
    <legend className="schemaform-block-title yellow-ribbon-title vads-u-font-size--h3 vads-u-margin-top--0">
      {title}
    </legend>
  );
};

export default YellowRibbonProgramTitle;
