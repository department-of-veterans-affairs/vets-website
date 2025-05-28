import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPreviousUrl } from '../actions/breadcrumbs';

const useTrackPreviousUrl = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(
    () => {
      // Update previousUrl in Redux before location changes
      return () => {
        dispatch(setPreviousUrl(location.pathname));
      };
    },
    [location, dispatch],
  );
};

export default useTrackPreviousUrl;
