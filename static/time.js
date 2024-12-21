document.addEventListener('DOMContentLoaded', function () {
    function updateTime() {
        // Get current date and time in Asia/Kathmandu timezone
        let options = { timeZone: 'Asia/Kathmandu', hour12: true };
        let formatter = new Intl.DateTimeFormat('en-US', {
            ...options,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        let parts = formatter.formatToParts(new Date());
        let year = parts.find(part => part.type === 'year').value;
        let month = parts.find(part => part.type === 'month').value;
        let day = parts.find(part => part.type === 'day').value;
        let hour = parts.find(part => part.type === 'hour').value;
        let minute = parts.find(part => part.type === 'minute').value;
        let second = parts.find(part => part.type === 'second').value;
        let ampm = parts.find(part => part.type === 'dayPeriod').value;

        // Update the date and time display
        document.querySelector('.date').innerHTML = `${month} ${day} || ${hour}:${minute}:${second} ${ampm}`;
        document.querySelector('.year').innerHTML = `${year} - Asia/Kathmandu`;
    }

    updateTime();
    setInterval(updateTime, 1000);
});
