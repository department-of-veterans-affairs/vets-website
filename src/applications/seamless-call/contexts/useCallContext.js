import { useContext } from 'react';
import { CallContext } from './CallContext';

const useCallContext = () => useContext(CallContext);

export default useCallContext;
