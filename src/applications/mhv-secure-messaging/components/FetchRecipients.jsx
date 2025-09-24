import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllTriageTeamRecipients } from '../actions/recipients';

const FetchRecipients = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getAllTriageTeamRecipients());
    },
    [dispatch],
  );

  return null;
};

export default FetchRecipients;
