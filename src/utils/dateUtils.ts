import { format, subDays } from 'date-fns';

/**
 * Format date to YYYY-MM-DD format (for display)
 */
export const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Format date to YYYYMMDD format (for NASA POWER API)
 */
export const formatDateForAPI = (date: Date): string => {
    return format(date, 'yyyyMMdd');
};

/**
 * Get default start date (7 days ago, but within valid range)
 */
export const getDefaultStartDate = (): string => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const minDate = new Date('1981-01-01');
    const today = new Date();

    // If seven days ago is before 1981, use 1981-01-01
    if (sevenDaysAgo < minDate) {
        return formatDate(minDate);
    }
    // If seven days ago is after today, use 7 days before today
    if (sevenDaysAgo > today) {
        return formatDate(subDays(today, 7));
    }

    return formatDate(sevenDaysAgo);
};

/**
 * Get default end date (3 days before today)
 */
export const getDefaultEndDate = (): string => {
    const threeDaysAgo = subDays(new Date(), 3);
    return formatDate(threeDaysAgo);
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const threeDaysAgo = subDays(new Date(), 3);

    return start <= end && start >= new Date('1981-01-01') && end <= threeDaysAgo;
};

/**
 * Get date range for NASA POWER API (limited to historical data)
 */
export const getValidDateRange = (startDate: string, endDate: string): { start: string; end: string } => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // NASA POWER API has data from 1981 to present, but we limit to 3 days ago
    const minDate = new Date('1981-01-01');
    const threeDaysAgo = subDays(new Date(), 3);

    const validStart = start < minDate ? minDate : start > threeDaysAgo ? threeDaysAgo : start;
    const validEnd = end < minDate ? minDate : end > threeDaysAgo ? threeDaysAgo : end;

    return {
        start: formatDate(validStart),
        end: formatDate(validEnd)
    };
};

/**
 * Get valid date range for NASA POWER API in YYYYMMDD format
 */
export const getValidDateRangeForAPI = (startDate: string, endDate: string): { start: string; end: string } => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // NASA POWER API has data from 1981 to present, but we limit to 3 days ago
    const minDate = new Date('1981-01-01');
    const threeDaysAgo = subDays(new Date(), 3);

    const validStart = start < minDate ? minDate : start > threeDaysAgo ? threeDaysAgo : start;
    const validEnd = end < minDate ? minDate : end > threeDaysAgo ? threeDaysAgo : end;

    return {
        start: formatDateForAPI(validStart),
        end: formatDateForAPI(validEnd)
    };
};
