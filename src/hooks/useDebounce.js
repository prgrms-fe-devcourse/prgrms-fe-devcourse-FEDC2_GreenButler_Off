import { useEffect } from 'react';
import useTimeoutfn from './useTimeoutfn';

const useDebounce = (fn, ms, deps) => {
  const [run, clear] = useTimeoutfn(fn, ms);

  useEffect(run, deps);

  return clear;
};

export default useDebounce;
