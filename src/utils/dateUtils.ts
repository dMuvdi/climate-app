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
 * Get default end date (today)
 */
export const getDefaultEndDate = (): string => {
    const today = new Date();
    return formatDate(today);
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    return start <= end && start >= new Date('1981-01-01') && end <= today;
};

/**
 * Get date range for NASA POWER API (limited to historical data)
 */
export const getValidDateRange = (startDate: string, endDate: string): { start: string; end: string } => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // NASA POWER API has data from 1981 to present
    const minDate = new Date('1981-01-01');
    const today = new Date();

    const validStart = start < minDate ? minDate : start > today ? today : start;
    const validEnd = end < minDate ? minDate : end > today ? today : end;

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

    // NASA POWER API has data from 1981 to present
    const minDate = new Date('1981-01-01');
    const today = new Date();

    const validStart = start < minDate ? minDate : start > today ? today : start;
    const validEnd = end < minDate ? minDate : end > today ? today : end;

    return {
        start: formatDateForAPI(validStart),
        end: formatDateForAPI(validEnd)
    };
};
