import React from 'react';
import { useSelector } from 'react-redux';

const DegreeLevelDescription = () => {
  const formData = useSelector(state => state.form.data);
  const isUsaSchool = formData?.institutionDetails?.isUsaSchool;
  if (isUsaSchool) {
    return (
      <div>
        <p>
          Provide a degree level such as undergraduate, graduate, doctoral, or
          all. If you’d like to specify a school, you can do so in the "College
          or professional school" field below.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p>
        Provide a degree level such as undergraduate, graduate, doctoral, or
        all.
      </p>
    </div>
  );
};

export default DegreeLevelDescription;
