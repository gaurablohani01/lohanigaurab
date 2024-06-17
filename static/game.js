let userdata = 0;
let computerdata = 0;
let userwin = false;

msgbtn = document.querySelector("#btn")
usercount = document.querySelector('.userdata')
compcount = document.querySelector('.computerdata')

function msg(userwin, userchoice, compdata) {
    if (userwin) {
        msgbtn.innerHTML = `<b>You Win.  ${userchoice} Beat ${compdata}</b>`;
        msgbtn.style.backgroundColor = "green";
    }
    else {
        msgbtn.innerHTML = `<b>You Lost.  ${compdata} Beat ${userchoice}</b>`;
        msgbtn.style.backgroundColor = "red";
    }

}

function computerchoice() {
    complist = ['Rock', 'Scssicor', 'Paper']
    compnumb = Math.floor(Math.random() * 3)
    compdata = complist[compnumb]
    return compdata;
}

function playgame(userchoice) {
    comch = computerchoice()
    if (userchoice === comch) {
        msgbtn.innerHTML = "<b>Draw</b>";
        msgbtn.style.backgroundColor = '';


    }
    else {
        if (userchoice === "Rock") {
            if (comch === "Scssicor") {
                userdata = userdata + 1;
                usercount.innerHTML = userdata

                userwin = true;
                msg(userwin, userchoice, comch)
            }
            else {
                computerdata = computerdata + 1;
                compcount.innerHTML = computerdata
                userwin = false;
                msg(userwin, userchoice, comch)

            }
        }
        else if (userchoice === "Scssicor") {
            if (comch === "Rock") {
                computerdata = computerdata + 1;
                compcount.innerHTML = computerdata
                userwin = false;
                msg(userwin, userchoice, comch)
            }
            else {
                userdata = userdata + 1;
                usercount.innerHTML = userdata
                userwin = true;
                msg(userwin, userchoice, comch)
            }
        }
        else if (userchoice == "Paper") {
            if (comch === "Rock") {
                userdata = userdata + 1;
                usercount.innerHTML = userdata
                userwin = true;
                msg(userwin, userchoice, comch)
            }
            else {
                computerdata = computerdata + 1;
                compcount.innerHTML = computerdata
                userwin = false;
                msg(userwin, userchoice, comch)
            }
        }
    }
}

const choice = document.body.querySelectorAll('.choice')
choice.forEach(e => {
    const choiceidname = e.getAttribute('id');
    e.addEventListener("click", () => {
        playgame(choiceidname);
    })

});
