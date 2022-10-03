import React from 'react';
import { useHistory } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { SPACE_BAR } from '../../../utils/constants';
import {
  selectFeatureAppointmentList,
  selectFeatureStatusImprovement,
} from '../../../redux/selectors';
import Grid from './Grid';
import ListItem from './ListItem';
import Card from './Card';

function getLink({ featureStatusImprovement, appointment }) {
  const { isCommunityCare, isPastAppointment } = appointment.vaos;
  return isCommunityCare
    ? `${featureStatusImprovement && isPastAppointment ? '/past/' : ''}cc/${
        appointment.id
      }`
    : `${featureStatusImprovement && isPastAppointment ? '/past/' : ''}va/${
        appointment.id
      }`;
}

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
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );
  const link = getLink({ featureStatusImprovement, appointment });
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

  return (
    <ListItem appointment={appointment}>
      {featureAppointmentList && (
        <Grid
          appointment={appointment}
          facility={facility}
          link={link}
          handleClick={() => handleClick({ history, link, idClickable })}
          handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
        />
      )}
      {!featureAppointmentList && (
        <Card
          appointment={appointment}
          facility={facility}
          link={link}
          handleClick={() => handleClick({ history, link, idClickable })}
          handleKeyDown={() => handleKeyDown({ history, link, idClickable })}
        />
      )}
    </ListItem>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
