import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import Verify from './pages/Verify';
import EnterOTC from './pages/EnterOTC';
import DateTimeSelection from './pages/DateTimeSelection';
import TopicSelection from './pages/TopicSelection';
import Review from './pages/Review';
import Confirmation from './pages/Confirmation';
import CancelAppointment from './pages/CancelAppointment';
import CancelAppointmentConfirmation from './pages/CancelConfirmation';

const routes = () => {
  return (
    <Routes>
      <Route index element={<Verify />} />
      <Route path="/enter-otc" element={<EnterOTC />} />
      <Route path="/date-time" element={<DateTimeSelection />} />
      <Route path="/topic-selection" element={<TopicSelection />} />
      <Route path="/review" element={<Review />} />
      <Route path="/confirmation/:appointmentId" element={<Confirmation />} />
      <Route
        path="/cancel-appointment/:appointmentId"
        element={<CancelAppointment />}
      />
      <Route
        path="/cancel-appointment/confirmation"
        element={<CancelAppointmentConfirmation />}
      />
    </Routes>
  );
};

export default routes();
