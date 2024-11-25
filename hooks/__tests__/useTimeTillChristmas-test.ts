import { calculateTimeLeft } from '../useTimeTillChristmas';
import { DateTime } from 'luxon';

describe('calculateTimeLeft', () => {
  it('Nov 1 2024, 12:00:00', () => {
    const result = calculateTimeLeft(DateTime.local(2024, 11, 1, 0, 0, 0));
    expect(result.days).toEqual(54);
    expect(result.hours).toEqual(1); // change from daylight to standard time
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
  });
  it('Dec 1 2024, 12:00:00', () => {
    const result = calculateTimeLeft(DateTime.local(2024, 12, 1, 0, 0, 0));
    expect(result.days).toEqual(24);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
  });
  it('Jan 1 2025, 12:00:00', () => {
    const result = calculateTimeLeft(DateTime.local(2025, 1, 1, 0, 0, 0));
    expect(result.days).toEqual(358);
    expect(result.hours).toEqual(0);
    expect(result.minutes).toEqual(0);
    expect(result.seconds).toEqual(0);
  });
});
