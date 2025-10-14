// Keep a stable ref to the latest value without causing re-renders.
// Useful inside stable callbacks or unmount cleanups.
import { useRef } from 'react';

export default function useLatest(value) {
  const ref = useRef(value);
  ref.current = value; // safe: does not cause a re-render
  return ref;
}
