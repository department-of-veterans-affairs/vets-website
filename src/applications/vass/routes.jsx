import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import Verify from './components/pages/Verify';
import EnterOTC from './components/pages/EnterOTC';
import DateTimeSelection from './components/pages/DateTimeSelection';
import TopicSelection from './components/pages/TopicSelection';
import Review from './components/pages/Review';
import Confirmation from './components/pages/Confirmation';

const routes = () => {
  return (
    <Routes>
      <Route index element={<Verify />} />
      <Route path="/enter-otc" element={<EnterOTC />} />
      <Route path="/date-time" element={<DateTimeSelection />} />
      <Route path="/topic-selection" element={<TopicSelection />} />
      <Route path="/review" element={<Review />} />
      <Route path="/confirmation" element={<Confirmation />} />
    </Routes>
  );
};

export default routes();
