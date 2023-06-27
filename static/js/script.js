document.querySelector("#form").addEventListener("submit", submitHandler);
document.querySelector("#size").addEventListener("input", checkDisabled);
document.querySelector("#check").addEventListener("click", check);
document.querySelector("#size").addEventListener("paste", pasteHandler);
document.querySelector("#remember").addEventListener("click", rememberHandler);

function sunRiseEffect() {
  for (let deg = 0; deg < 391; deg += 10) {
    setTimeout(function () {
      document.querySelector("body").style = `background:linear-gradient(${deg}deg, rgb(28 151 177) 0%, rgb(9 9 52) 54%, rgb(0 0 12) 100%)`;
    }, 1500 * (deg/10));
    if (deg == 360) {

       break;
     }
  }

}

window.addEventListener("load", sunRiseEffect);

async function checkLocalStorage() {
  if (localStorage.getItem("data")) {
    let lsData = JSON.parse(localStorage.getItem("data"));
    document.querySelector(".remember-btn").style =
      "background-color:darkgreen";
    document.querySelector("#speed").value = lsData.speed;
    document.querySelector("#speedSelect").value = lsData["unit"];

    document.querySelector("#remember").title = "Forget?";
  }
}
checkLocalStorage();

const speedSelect = () => {
  let speedUnit = document.querySelector("#speedSelect").value;
  return speedUnit;
};
document.querySelector("#speedSelect").addEventListener("change", speedSelect);

const sizeSelect = () => {
  let sizeUnit = document.querySelector("#sizeSelect").value;
  return sizeUnit;
};
document.querySelector("#sizeSelect").addEventListener("change", sizeSelect);

function submitHandler(e) {
  e.preventDefault();
  let speed = document.querySelector("#speed").value;
  let unit = document.querySelector("#speedSelect").value;
  if (localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify({ speed: speed, unit: unit }));
  }
  let size = document.querySelector("#size").value;
  if (speed == "" || size == "" || speed == 0 || size == 0 || !Number(size)) {
    document.querySelector("#result").innerHTML = "Please Enter Your Download Speed Or Size Of The File";
    return;
  }
  let currentSpeedUnit = speedSelect();
  let currentSizeUnit = sizeSelect();
  if (currentSpeedUnit == "KB") {
    speed = speed / 1024; // returns the speed per MB, e.g. if users speed is 512 KBs, it will return 0.5 in MegaByte
  }

  if (currentSpeedUnit == "GB") {
    speed = speed * 1024; // returns the speed per GB, e.g. if users speed is 1.2 TBs, it will return 1200 in MegaByte
  }

  if (currentSizeUnit == "KB") {
    size = size / 1024; // returns the speed per MB, e.g. if users speed is 512 KBs, it will return 0.5 in MegaByte
  }

  if (currentSizeUnit == "GB") {
    size = size * 1024; // returns the speed per GB, e.g. if users speed is 1.2 TBs, it will return 1200 in MegaByte
  }
  let finalTime = size / speed / 60; // Will return the result in 'Minutes'
  
  let roundedTime = Math.round(finalTime);
  let exactTime = finalTime.toFixed(2);
  if(exactTime < 1){
    roundedTime = "Less Than 1 "
  }
  document.querySelector("#result").innerHTML = `It Will Take <span class='exact-time' title='${exactTime} Minutes, To be Exact!'> ${roundedTime}  </span> Minutes to Download This File!`;
}

function checkDisabled(e) {
  let userEnteredValue = e.target.value;
  if (userEnteredValue.includes("http")) {
    if (document.querySelector("#check").disabled) {
      document.querySelector("#check").disabled = false;
      document.querySelector("#check").style = "color:green";
      document.querySelector("#size").style = "padding-right:5%";
      setTimeout(() => {
        document.querySelector("#size").style = "";
      }, 4000);
    }
  }
}
function pasteHandler(e) {
  setTimeout(() => {
    let userEnteredValue = e.target.value;
    if (userEnteredValue.includes("http")) {
      check();
    }
  }, 100);
}

function check() {
  (async () => {
    const rawResponse = await fetch("https://api.own3r.me/size/", {
      method: "POST",
      body: document.querySelector("#size").value,
    });
    const response = await rawResponse.json();
    if (response.status == "OK") {
      let getSize = Number.isInteger(response.result) ? response.result : response.result.toFixed(2);
      let sizeUnit = response.SizeUnit;
      document.querySelector("#sizeSelect").value = sizeUnit;
      document.querySelector("#size").value = getSize;
      document.querySelector("#check").innerHTML = "Checked!";
      document.querySelector("#check").style = "color:green";
      setTimeout(() => {
        document.querySelector("#check").disabled = true;
        document.querySelector("#check").style = "color:#d50d0d";
        document.querySelector("#check").innerHTML = "Check!";
      }, 3000);
    } else if (response === 0) {
      document.querySelector("#check").innerHTML =
        "This Website is not supported:(";
      document.querySelector("#check").disabled = true;
      document.querySelector("#check").style = "color:#d50d0d";
      setTimeout(() => {
        document.querySelector("#check").disabled = false;
        document.querySelector("#check").innerHTML = "Check!";
      }, 3000);
    }
  })();
}

function rememberHandler() {
  let value = document.querySelector("#speed").value;
  let speedUnit = document.querySelector("#speedSelect").value;
  if (value !== "" && localStorage.getItem("data") == null) {
    let dataToSave = { speed: value, unit: speedUnit };
    localStorage.setItem("data", JSON.stringify(dataToSave));
    document.querySelector(".remember-btn").style = "background-color:darkgreen";
  } else if (localStorage.getItem("data")) {
    confirm("Are Sure You Want To Disable Saving Your Speed in LocalStorage?") && localStorage.clear();
    document.querySelector("#speed").value = "";
    document.querySelector(".remember-btn").style = "";
  }
}
