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

        let formatter = new Intl.DateTimeFormat('en-US', options);
        let formattedDate = formatter.format(date);

        let [month, day, year, time] = formattedDate.replace(',', '').split(' ');
        let [hour, minute, second, ampm] = time.split(/[: ]/);

        document.querySelector('.date').innerHTML = `${month} ${day} || ${hour}:${minute}:${second} ${ampm}`;
        document.querySelector('.year').innerHTML = `${year} - Asia/Kathmandu`;
    }

    updateTime();
    setInterval(updateTime, 1000);
});
