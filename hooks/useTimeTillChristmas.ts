import { DateTime, Duration, Interval } from 'luxon';
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
};

export const calculateTimeLeft: (currentDateTime?: DateTime) => TimeLeft = (
  currentDateTime,
) => {
  let date = currentDateTime ?? DateTime.now();
  let year = 2024;
  // add a second, intervals include start but not end
  let christmas = DateTime.local(year, 12, 25, 0, 0, 0);
  let interval = Interval.fromDateTimes(date, christmas.plus(1));
  while (!interval.isValid) {
    // Increase year until Christmas happens after the current date
    year = year + 1;
    christmas = DateTime.local(year, 12, 25, 0, 0, 0);
    interval = Interval.fromDateTimes(date, christmas.plus(1));
  }
  const days = Math.floor(interval.length('days'));
  const hours = Math.floor(interval.length('hours'));
  const minutes = Math.floor(interval.length('minutes'));
  const seconds = Math.floor(interval.length('seconds'));
  return {
    days,
    hours: hours - 24 * days,
    minutes: minutes - 60 * hours,
    seconds: seconds - 60 * minutes,
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
