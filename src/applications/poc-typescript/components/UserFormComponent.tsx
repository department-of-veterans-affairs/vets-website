import React, { useState, ChangeEvent } from 'react';
import User from '../interfaces/UserInterface';

export default function UserFormComponent() {
  const [state, setState] = useState<User>({
    name: 'John Doe',
    age: 26,
    address: '87 Summer St, Boston, MA 02110',
    dob: new Date(1997, 4, 3),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form>
      <h3>Profile Form</h3>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        name="name"
        value={state.name}
        onChange={handleChange}
      />
      <label htmlFor="age">Age</label>
      <input
        id="age"
        type="number"
        name="age"
        value={state.age}
        onChange={handleChange}
      />
      <label htmlFor="address">Address</label>
      <input
        id="address"
        type="text"
        name="address"
        value={state.address}
        onChange={handleChange}
      />
      <label htmlFor="dob">Date of Birth</label>
      <input
        id="dob"
        type="date"
        name="dob"
        value={state.dob ? state.dob.toISOString().split('T')[0] : ''}
        onChange={handleChange}
      />
    </form>
  );
}
