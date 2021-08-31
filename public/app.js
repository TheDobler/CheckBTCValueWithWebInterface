
const Http = new XMLHttpRequest();
let stopTimer = false;
let stopRemoveText = false;
let btcValueNew = 0;
let btcValueOld = 0;
var typeOfCoin = 0;
var jsonObject = {};

var NoCoinChange = true;
var ReadyForStart = true;
var NoStopPress = false;

//Play sound
function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function sendData() {
    try {
        Http.open('POST', '/', true);
        Http.setRequestHeader('Content-type', 'text/plain');
        Http.status = 200;
        Http.send();
    } catch (error) {
        console.error(error.message);
        alert("Something is wrong here !, check the console window");
    }

}
try {
    Http.onreadystatechange = () => {
        if (Http.readyState === XMLHttpRequest.DONE) {
            var status = Http.status;
            if (status === 0 || (status >= 200 && status < 400)) {

                if (stopTimer == true) {
                    document.getElementById('waitingText').innerHTML = 'The timer is running ...';
                }

                var encoded = Http.responseText;
                jsonObject = JSON.parse(encoded);

                document.getElementById('coinsBtn0').innerHTML = jsonObject.name[0];
                document.getElementById('coinsBtn1').innerHTML = jsonObject.name[1];
                document.getElementById('coinsBtn2').innerHTML = jsonObject.name[2];

                displayCoin();
                valueChange();

            }
        }
    }
} catch (error) {
    console.error(error.message);
    alert("Something is wrong here !, check the console window");
}

function displayCoin() {

    document.getElementById('BtcName').innerHTML = "The value of " + jsonObject.name[typeOfCoin] + " is right now:";
    document.getElementById('PriceSymbol').innerHTML = '1 ' + jsonObject.symbol[typeOfCoin] + ' = ' + Math.round(jsonObject.price[typeOfCoin]) + "$";
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    // var res = jsonObject.last_updated.split('T')
    // res = res[1].split('.')
    // res = res[0]

    document.getElementById('BtcLastUpdated').innerHTML = 'Last update is ' + dateTime;
}

function valueChange() {

    btcValueNew = jsonObject.price[typeOfCoin];

    if (btcValueNew > btcValueOld) {
        playSound('Increase.mp3');
        document.getElementById('Increase').innerHTML = 'The value has risen in the last 5 minutes!';
    }
    else if (btcValueNew === btcValueOld) {
        document.getElementById('Increase').innerHTML = 'The value is the same for the last 5 minutes.';
    }
    else if (btcValueNew < btcValueOld) {
        playSound('Decrease.mp3');
        document.getElementById('Increase').innerHTML = 'The value has decreased in the last 5 minutes';
    }


    btcValueOld = btcValueNew;
    btcValueNew = 0;
}

async function DelayForStart() {
    if (NoStopPress === false) {
        NoStopPress = true;
        await sleep(300000).then(() => {
            ReadyForStart = true;
            document.getElementById('waitingText').innerHTML = '5 minutes have passed! You can press the start button again.'
            NoStopPress = false;
        })
    }
}

if (btnStart) {
    btnStart.addEventListener("click", param => {
        if (stopTimer === false && ReadyForStart === true) {
            stopTimer = true;
            stopRemoveText = true;
            NoCoinChange = false;
            console.log('Start')
            document.getElementById('waitingText').innerHTML = 'The timer has started, please wait..';
            sendData();
            Tutor();
        }
    });
}

if (btnStop) {
    btnStop.addEventListener("click", param => {
        if (stopTimer === true) {
            console.log('Stop')
            stopTimer = false;
            document.getElementById('waitingText').innerHTML = 'The timer has stopped, Please press start to continue in 5 minutes...';
            stopRemoveText = false;
            removeText();
            ReadyForStart = false;
            DelayForStart();
        }
    });
}

if (coinsBtn0) {
    coinsBtn0.addEventListener("click", param => {
        if (NoCoinChange === false) {
            typeOfCoin = 0;
            btcValueOld = jsonObject.price[0];
            document.getElementById('Increase').innerHTML = '';
            document.getElementById('BtcLastUpdated').innerHTML = '';
            displayCoin();
        }
    })
}
if (coinsBtn1) {
    coinsBtn1.addEventListener("click", param => {
        if (NoCoinChange === false) {
            typeOfCoin = 1;
            btcValueOld = jsonObject.price[1];
            document.getElementById('Increase').innerHTML = '';
            document.getElementById('BtcLastUpdated').innerHTML = '';
            displayCoin();
        }
    })
}
if (coinsBtn2) {
    coinsBtn2.addEventListener("click", param => {
        if (NoCoinChange === false) {
            typeOfCoin = 2;
            btcValueOld = jsonObject.price[2];
            document.getElementById('Increase').innerHTML = '';
            document.getElementById('BtcLastUpdated').innerHTML = '';
            displayCoin();
        }
    })
}

async function Tutor() {
    while (stopTimer) {
        await sleep(300000).then(() => {
            sendData();
        })
    }
}
async function removeText() {
    await sleep(600000).then(() => {
        if (stopRemoveText != true) {
            NoCoinChange = true;
            document.getElementById('BtcName').innerHTML = '';
            document.getElementById('PriceSymbol').innerHTML = '';
            document.getElementById('BtcLastUpdated').innerHTML = '';
            document.getElementById('Increase').innerHTML = '';
            document.getElementById('waitingText').innerHTML = 'The timer has stopped, Please press start to continue...';
        }
    })
}



