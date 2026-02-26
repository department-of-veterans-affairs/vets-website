/**
 * useFocusSettle — delays `content` until page focus has been stable for 1 s.
 *
 * Returns an empty string while focus is still moving, then returns `content`
 * once focus has settled or a 5 s hard ceiling is reached.  Designed to be
 * rendered inside an `aria-live="polite"` region so screen readers don't
 * swallow the announcement while VoiceOver is busy reading the focused element.
 *
 * Extracted from AlertBackgroundBox so the same pattern can be reused
 * for inline success alerts without coupling to the Redux alert system.
 *
 * @param {string} content — the text to announce (pass '' or falsy to reset)
 * @returns {string} — '' until focus settles, then `content`
 */
import { useState, useLayoutEffect, useRef } from 'react';

const useFocusSettle = content => {
  const [srContent, setSrContent] = useState('');
  const timerSourceRef = useRef(null);

  useLayoutEffect(
    () => {
      if (!content) {
        setSrContent('');
        timerSourceRef.current = null;
        return undefined;
      }

      let debounceTimer;
      let rafId;
      timerSourceRef.current = null;

      const scheduleAnnounce = source => {
        timerSourceRef.current = source;
        // Force a real DOM text mutation: clear, then set on next frame
        setSrContent('');
        rafId = requestAnimationFrame(() => {
          setSrContent(content);
        });
      };

      const onFocusIn = () => {
        if (timerSourceRef.current) return;
        // Reset the 1 s debounce on every focus change
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(
          () => scheduleAnnounce('focus-settle'),
          1000,
        );
      };

      document.addEventListener('focusin', onFocusIn);

      // Kick off the initial debounce in case focus already settled
      onFocusIn();

      // Hard ceiling: announce after 5 s no matter what
      const ceilingTimer = setTimeout(() => {
        if (!timerSourceRef.current) {
          scheduleAnnounce('ceiling');
        }
      }, 5000);

      return () => {
        clearTimeout(debounceTimer);
        clearTimeout(ceilingTimer);
        cancelAnimationFrame(rafId);
        document.removeEventListener('focusin', onFocusIn);
      };
    },
    [content],
  );

  return srContent;
};

export default useFocusSettle;
