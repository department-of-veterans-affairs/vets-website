import React, { useState } from 'react';

// IntroForm: A simple form with fields for name and age using VA web components
const IntroForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: '', age: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Intro form">
      <va-text-input
        label="Name"
        name="name"
        value={form.name}
        onInput={handleChange}
        required
      />
      <va-text-input
        label="Age"
        name="age"
        value={form.age}
        onInput={handleChange}
        type="number"
        min="0"
        required
      />
      <va-button type="submit" text="Submit" />
    </form>
  );
};

export default IntroForm;
