import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

export const ViewPersonalInformationReview = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-shadow
  const state = useSelector(state => state);
  const fullName = state.user.profile.userFullName;
  const firstName = fullName?.first;
  const lastName = fullName?.last;

  const formData = state.form.data;
  const { currentlyLoggedIn } = state.user.login;

  useEffect(
    () => {
      if (currentlyLoggedIn !== formData?.isLoggedIn) {
        dispatch(
          setData({
            ...formData,
            isLoggedIn: currentlyLoggedIn,
          }),
        );
      }
    },
    [dispatch, currentlyLoggedIn],
  );

  return (
    <div>
      <va-card background>
        <h3 className="vads-u-font-size--h4" style={{ marginTop: '1em' }}>
          Personal information
        </h3>
        <p>
          <strong>Name: </strong>
          {firstName} {lastName}
        </p>
      </va-card>
    </div>
  );
};
