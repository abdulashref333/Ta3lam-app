
const EMAIL = document.querySelector("#exampleInputEmail1");
const PASSWORD = document.querySelector("#exampleInputPassword1");
const LOGINBUTTON = document.querySelector('#Login-button');
const rightPassword = "123456";
const rightEmail = "ahmed@gg.com";
// console.log(EMAIL);
const myForm = document.querySelector("#myloginform");
myForm.addEventListener("submit",function(e){
    e.preventDefault();

    const formData = new FormData(this);
    fetch("http://localhost:3000/api/users/login",{
        method: "post",
        body: formData
    }).then(function(response) {
        return response.text();
    }).then(function(text){
        console.log(text);
    }).catch(function(error){
        console.error();
    })
})

// EMAIL.addEventListener("keyup",function(){
//     // checkEmail(EMAIL.value);
// })
// PASSWORD.addEventListener("keyup",function(){
//     console.log(PASSWORD.value);
// })

// function checkEmail (){
// if(EMAIL.value ==rightEmail) return true;
// else return;
// }
// function checkPassword() {
//     if (PASSWORD.value == rightPassword) return true ;
//     else return;
// }

// LOGINBUTTON.addEventListener("click",function(){
//     if(checkEmail() && checkPassword()) {
//         alert("This is right");
//     }
//     else {
//         alert("This is wrong")
//     }
// })