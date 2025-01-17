import {formatDistanceStrict, format} from 'date-fns';
import locale from 'date-fns/locale/en-US';

const formatDistanceLocale: Record<any, string> = {
  lessThanXSeconds: '{{count}} secs',
  xSeconds: '{{count}} secs',
  halfAMinute: '30 secs',
  lessThanXMinutes: '{{count}} min',
  xMinutes: '{{count}} min',
  aboutXHours: '{{count}} hours',
  xHours: '{{count}} hours',
  xDays: '{{count}} days',
  aboutXWeeks: '{{count}} weeks',
  xWeeks: '{{count}} weeks',
  aboutXMonths: '{{count}} months',
  xMonths: '{{count}} months',
  aboutXYears: '{{count}} years',
  xYears: '{{count}} years',
  overXYears: '{{count}} years',
  almostXYears: '{{count}} years',
};

const customFormatDistance = (token: any, count: any, options: any) => {
  options = options || {};

  let result = formatDistanceLocale[token].replace('{{count}}', count);

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result;
    } else {
      if (count < 45 && token === 'xSeconds') return (result = 'just now');
      if (count === 1 && token === 'xDays') return (result = 'yesterday');
      return result + ' ago';
    }
  }

  return result;
};

export const timeAgo = (value: string | Date): string => {
  return formatDistanceStrict(new Date(value), new Date(), {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance: customFormatDistance,
    },
  });
};

export const formatDate = (date: Date): string => {
  const newFormat = format(new Date(date), 'd MMMM y');
  return newFormat;
};
