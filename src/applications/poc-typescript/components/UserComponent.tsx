import React from 'react';
import UserInterface from '../interfaces/UserInterface';

const UserComponent: React.FC<UserInterface> = props => {
  return (
    <div>
      <h2>Your Profile</h2>
      Hello, <b>{props.name}</b>
      <br />
      You are <b>{props.age} years old</b>
      <br />
      You live at: <b>{props.address}</b>
      <br />
      You were born: <b>{props.dob.toDateString()}</b>
    </div>
  );
};

export default UserComponent;
