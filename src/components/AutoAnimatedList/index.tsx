import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

function AutoAnimatedList(props: any) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current &&
    autoAnimate(ref.current);
  }, [ref]);
  return <div ref={ref} {...props} />;
}

export default AutoAnimatedList;
