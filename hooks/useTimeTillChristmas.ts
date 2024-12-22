import { DateTime, Interval } from 'luxon';
import { useEffect, useRef, useState } from 'react';

/**
 * A handy hook for finding out how long it will be before Santa arrives
 *
 * @param timeBetweenChecks Optional interval (seconds) between hook updates (defaults to 1 second)
 * @returns the days, hours, minutes, seconds, and sleeps until Christmas
 */
export const useTimeTillChristmas = (timeBetweenChecks?: number) => {
  const interval = (timeBetweenChecks ?? 1) * 1000;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeftTillChristmas(),
  );
  useInterval(() => {
    setTimeLeft(calculateTimeLeftTillChristmas());
  }, interval);
  return timeLeft;
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isChristmas: boolean;
};

/**
 * Calculates the days, hours, minutes, and seconds until the next Christmas
 * @param epoch Optional DateTime object, defaults to the current time
 * @returns the days, hours, minutes, seconds, and sleeps until the next Christmas following the epoch
 */
export const calculateTimeLeftTillChristmas: (epoch?: DateTime) => TimeLeft = (
  epoch,
) => {
  let date = epoch ?? DateTime.now();
  // Check to see if Christmas is today
  if (date.month === 12 && date.day === 25) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isChristmas: true,
    };
  }
  // Start with 2024 -- if interval not valid (negative),
  // keep adding years until Christmas is after the current date
  let year = 2024;
  let christmas = DateTime.local(year, 12, 25, 0, 0, 0);
  let interval = Interval.fromDateTimes(date, christmas.plus(1));
  while (!interval.isValid) {
    // Increase year until Christmas happens after the current date
    year = year + 1;
    christmas = DateTime.local(year, 12, 25, 0, 0, 0);
    interval = Interval.fromDateTimes(date, christmas.plus(1));
  }
  // Extract interval length and return the TimeLeft object
  const intervalLengthInDays = Math.floor(interval.length('days'));
  const intervalLengthInHours = Math.floor(interval.length('hours'));
  const intervalLengthInMinutes = Math.floor(interval.length('minutes'));
  const intervalLengthInSeconds = Math.floor(interval.length('seconds'));
  return {
    days: intervalLengthInDays,
    hours: intervalLengthInHours - 24 * intervalLengthInDays,
    minutes: intervalLengthInMinutes - 60 * intervalLengthInHours,
    seconds: intervalLengthInSeconds - 60 * intervalLengthInMinutes,
    isChristmas: false,
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
