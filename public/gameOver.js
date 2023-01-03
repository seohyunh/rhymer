const scoreboard = document.getElementById("scoreboard");

function setScoreboard() {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseHandler);
  let url = `/gameOver`;
  xhr.responseType = "json";
  xhr.open("GET", url);
  xhr.send();
}

function responseHandler() {
  if (this.response.success) {
    if (this.response.rows[0].score < 10) {
      scoreboard.innerHTML =
        "Oh... You need some more practice. You got a score of " +
        this.response.rows[0].score;
    } else if (
      this.response.rows[0].score >= 10 &&
      this.response.rows[0].score <= 20
    ) {
      scoreboard.innerHTML =
        "You're good at this! You got a score of " +
        this.response.rows[0].score +
        "!";
    } else {
      scoreboard.innerHTML =
        "Great job!!! You're a rhyming genius. You got a score of " +
        this.response.rows[0].score +
        "!";
    }
  } else {
    console.log(this.response.success);
  }
}

window.addEventListener("load", setScoreboard);
