import React from 'react';
import { useSelector } from 'react-redux';

const Introduction = () => {
  const formData = useSelector(state => state.form?.data);
  const programs = formData.programs?.length > 0;

 return !programs ? <div>
      Introduction page stuff
    </div> : null 
};

export default Introduction;
