import { useEffect } from 'react';
import { getIsRxSkill } from '../utils/sessionStorage';

function setRXStorageSession(setIsRXSkillStateFn) {
  const isRxSkill = getIsRxSkill();
  setIsRXSkillStateFn(isRxSkill);
}

function rxSkillEventListener(setIsRXSkillStateFn) {
  const event = () => setRXStorageSession(setIsRXSkillStateFn);

  window.addEventListener('rxSkill', event);
  return () => window.removeEventListener('rxSkill', event);
}

export default function useRxSkillEventListener(setIsRXSkill) {
  useEffect(() => rxSkillEventListener(setIsRXSkill), [setIsRXSkill]);
}
