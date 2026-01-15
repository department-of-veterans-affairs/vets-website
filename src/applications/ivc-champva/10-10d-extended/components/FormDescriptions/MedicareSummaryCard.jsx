import React from 'react';
import content from '../../locales/en/content.json';

export const SCHEMA_LABELS = Object.freeze({
  ab: content['medicare--plan-type-option--ab'],
  c: content['medicare--plan-type-option--c'],
  a: content['medicare--plan-type-option--a'],
  b: content['medicare--plan-type-option--b'],
});
const PART_D_LABEL = content['medicare--plan-type-option--d'];

const getPlanTypeLabel = planType => SCHEMA_LABELS[planType] ?? '';

const MedicareSummaryCard = item => {
  const { medicarePlanType, hasMedicarePartD } = item ?? {};
  const baseLabel = getPlanTypeLabel(medicarePlanType);
  const typeLabel = hasMedicarePartD
    ? `${baseLabel}, ${PART_D_LABEL}`
    : baseLabel;
  return (
    <ul className="no-bullets">
      <li>
        <strong>Type:</strong> {typeLabel}
      </li>
    </ul>
  );
};

export default MedicareSummaryCard;
