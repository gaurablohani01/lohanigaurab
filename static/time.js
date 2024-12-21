document.addEventListener('DOMContentLoaded', function () {
    function updateTime() {
        let date = new Date();
        let options = { 
            timeZone: 'Asia/Kathmandu', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };

        let parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
        let year = parts.find(part => part.type === 'year').value;
        let month = parts.find(part => part.type === 'month').value;
        let day = parts.find(part => part.type === 'day').value;
        let hour = parts.find(part => part.type === 'hour').value;
        let minute = parts.find(part => part.type === 'minute').value;
        let second = parts.find(part => part.type === 'second').value;
        let ampm = parts.find(part => part.type === 'dayPeriod').value;

        document.querySelector('.date').innerHTML = `${month} ${day} || ${hour}:${minute}:${second} ${ampm}`;
        document.querySelector('.year').innerHTML = `${year} - Asia/Kathmandu`;
    }

    updateTime();
    setInterval(updateTime, 1000);
});
