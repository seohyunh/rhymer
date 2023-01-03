let loginButton = document.getElementById("login")
let username = document.getElementById("username")
let password = document.getElementById("password")

function login(event){
    event.preventDefault()
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query=`username=${username.value}&password=${password.value}`
    url = `/attempt_login`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)
}

function responseHandler(){
    let message = document.getElementById("message")
    message.style.display = "block"
    if (this.response.success){    
        window.location.href="homepage.html"; //will load the the homepage when login is successful
    }else{
        console.log(this.response.message)
        message.classList.remove("d-none");
        message.innerText = this.response.message
    }
}

loginButton.addEventListener("click", login)