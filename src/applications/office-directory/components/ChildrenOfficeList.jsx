import React from 'react';
import PropTypes from 'prop-types';

export default function ChildrenOfficeList({ offices }) {
  return (
    <va-additional-info trigger="Works with these offices">
      <ul>
        {offices?.map(office => (
          <li key={office.entityId}>{office.title}</li>
        ))}
      </ul>
    </va-additional-info>
  );
}

ChildrenOfficeList.propTypes = {
  offices: PropTypes.array.isRequired,
};
