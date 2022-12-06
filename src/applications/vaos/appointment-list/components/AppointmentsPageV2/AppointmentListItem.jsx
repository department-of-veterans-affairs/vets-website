import React from 'react';
import { useHistory } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { SPACE_BAR } from '../../../utils/constants';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';
import Card from './Card';
import { getLink } from '../../../services/appointment';

function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

export default function AppointmentListItem({ appointment, facility }) {
  const history = useHistory();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const link = getLink({ featureStatusImprovement, appointment });
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

  return (
    <>
      <li
        id={idClickable}
        data-request-id={appointment.id}
        className="vaos-appts__card--clickable vads-u-margin-bottom--3"
        data-cy="appointment-list-item"
      >
        <Card
          appointment={appointment}
          facility={facility}
          link={link}
          handleClick={() => handleClick({ history, link, idClickable })}
          handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
        />
      </li>
    </>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
