import { useEffect, useState } from 'react';

const createMilitaryTitle = () => {
  const url = window.location.href;
  return url.includes('/employers/0/information')
    ? 'Current employer and position information'
    : 'Name of employer and position information';
};

const EmployersInformationTitle = () => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(createMilitaryTitle());
  }, []);

  return title;
};

export default EmployersInformationTitle;
