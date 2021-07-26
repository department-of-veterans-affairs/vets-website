import React from 'react';
import { TABS } from '../constants';
import classNames from 'classnames';

export default function MobileFilterControls({
  filterClick,
  tab,
  tuitionAndHousingClick,
}) {
  return (
    <div
      className={classNames('vads-u-margin-left--1 vads-u-margin-right--1', {
        'vads-u-margin-top--2': tab !== TABS.location,
      })}
    >
      <button className="usa-button-secondary" onClick={tuitionAndHousingClick}>
        Update tuition and housing estimates
      </button>
      <button className="usa-button-secondary" onClick={filterClick}>
        Filter your results
      </button>
    </div>
  );
}
