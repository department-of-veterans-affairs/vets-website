import React, { useEffect } from 'react';

export default function Index(props) {
  useEffect(
    () => {
      const { router } = props;
      router.push('verify');
    },
    [props],
  );
  return <></>;
}
