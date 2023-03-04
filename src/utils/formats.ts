const timeFormatter = new Intl.RelativeTimeFormat(`en`, { style: `narrow` });

export const getRelativeDays = (date:Date) => {
    const timeStamp = new Date(date).getTime();
    return timeFormatter.format(
        Math.round((timeStamp - Date.now()) / (1000 * 60 * 60 * 24)),
        `day`
    );

}