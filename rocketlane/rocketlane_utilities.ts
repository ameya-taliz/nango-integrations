/**
 * Converts a Unix timestamp (in seconds or milliseconds) to an ISO 8601 formatted datetime string.
 * @param timestamp - Unix timestamp (will handle both seconds and milliseconds)
 * @returns ISO 8601 formatted datetime string (e.g., "2024-01-15T10:30:00.000Z")
 */
export function unixTimestampToISO(timestamp: number): string {
    // If timestamp is in seconds (less than year 2000 in milliseconds), convert to milliseconds
    const milliseconds = timestamp < 946684800000 ? timestamp * 1000 : timestamp;
    return new Date(milliseconds).toISOString();
}

