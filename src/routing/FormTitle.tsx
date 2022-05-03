import React from 'react';

export default function FormTitle({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string | undefined;
}) {
  return (
    <div className="va-form-title">
      <h1>{title}</h1>
      {subTitle && <div className="va-form-subtitle">{subTitle}</div>}
    </div>
  );
}
