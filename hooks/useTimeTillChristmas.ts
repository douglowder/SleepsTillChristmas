import { DateTime, Interval } from 'luxon';
import { useEffect, useRef, useState } from 'react';

/**
 * A handy hook for finding out how long it will be before Santa arrives
 *
 * @param timeBetweenChecks Optional interval (seconds) between hook updates (defaults to 1 second)
 * @returns the days, hours, minutes, seconds, and sleeps until Christmas 2024
 */
export const useTimeTillChristmas = (timeBetweenChecks?: number) => {
  const interval = (timeBetweenChecks ?? 1) * 1000;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  useInterval(() => {
    setTimeLeft(calculateTimeLeft());
  }, interval);
  return timeLeft;
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  sleeps: number;
};

const calculateTimeLeft: () => TimeLeft = () => {
  const date = DateTime.now();
  const christmas = DateTime.local(2024, 12, 25, 0, 0);
  const interval = Interval.fromDateTimes(date, christmas);
  const days = Math.floor(interval.length('days'));
  const hours = Math.floor(interval.length('hours') - 24 * days);
  const minutes = Math.floor(
    interval.length('minutes') - 60 * (hours + 24 * days),
  );
  const seconds = Math.floor(
    interval.length('seconds') - 60 * (minutes + 60 * (hours + 24 * days)),
  );
  return {
    days,
    hours,
    minutes,
    seconds,
    sleeps: days + 1,
  };
};

/**
 * Hook that calls a callback periodically
 * Based on https://balavishnuvj.com/blog/using-callbacks-in-custom-hooks/
 *
 * @param callback The callback to be called
 * @param interval The interval between callbacks, in milliseconds
 */
const useInterval: (callback: () => void, interval: number) => void = (
  callback,
  interval,
) => {
  const callbackRef = useRef<typeof callback>();
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function cb() {
      callbackRef.current && callbackRef.current();
    }
    const id = setInterval(cb, interval);
    return () => clearInterval(id);
  }, [interval]);
};
