import React from 'react';
import { AdditionalResourcesLinks } from './AdditionalResourcesLinks';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';

const vetTecLogo = vetTec => {
  if (!vetTec) return null;
  return (
    <div className="vads-u-margin-left--4">
      <div className="logo-container">
        {renderVetTecLogo(classNames('vettec-logo-additional-resources'))}
      </div>
    </div>
  );
};

const AdditionalResources = ({ vetTec = false }) => {
  const parentClasses = classNames(
    'usa-width-one-third',
    'medium-4',
    'small-12',
    'column',
    {
      'additional-resources-responsive': !vetTec,
      'additional-resources-vettec': vetTec,
    },
  );

  const headerClasses = classNames('vads-u-font-size--h4', 'highlight', {
    'vads-u-margin--0': vetTec,
  });

  return (
    <div className={parentClasses}>
      {vetTecLogo(vetTec)}
      <h2 className={headerClasses}>Additional resources</h2>
      <AdditionalResourcesLinks vetTec={vetTec} />
    </div>
  );
};

export default AdditionalResources;
