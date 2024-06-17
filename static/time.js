document.addEventListener('DOMContentLoaded', function () {
    function updateTime() {
        let date = new Date();
        let hour = date.getHours();
        let min = date.getMinutes()
        let sec = date.getSeconds();
        let month = date.getMonth();
        let monthdate = date.getDate();
        let year = date.getFullYear();
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour == 0) {
            document.querySelector('.date').innerHTML = `${months[month]} ${monthdate} || 12:${min}:${sec} ${ampm}`;
        } else {
            document.querySelector('.date').innerHTML = `${months[month]} ${monthdate} || ${hour}:${min}:${sec} ${ampm}`;
        }

        let country = new Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.querySelector('.year').innerHTML = `${year} - ${country}`;
        // document.querySelector('.cuurentyear').innerHTML = `${year}`;
        document.querySelector('.currentyear2').innerHTML = `${year}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
});
