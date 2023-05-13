export {}

declare global {
    interface Date {
        toDisplayFormat(): string;
    }
}

// eslint-disable-next-line
Date.prototype.toDisplayFormat = function () {
    return new Date(this).toLocaleString('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC'
    });
};