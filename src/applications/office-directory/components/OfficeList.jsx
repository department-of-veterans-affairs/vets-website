import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ChildrenOfficeList from './ChildrenOfficeList';

function OfficeList({ offices }) {
  if (offices && offices.length > 0) {
    return offices.map(office => (
      <>
        <h3 key={office.entityId}>{office.title}</h3>

        {office.reverseFieldParentOfficeNode.entities.length > 0 ? (
          <ChildrenOfficeList
            offices={office.reverseFieldParentOfficeNode.entities}
          />
        ) : null}
      </>
    ));
  }

  return (
    <p>
      We didn't find any results. Try using different words or checking the
      spelling of the words you're using.
    </p>
  );
}

OfficeList.propTypes = {
  offices: PropTypes.array.isRequired,
};

export default memo(OfficeList);
