const edit = document.querySelector('.edit');
const editForm = document.querySelector('.editForm');
const textAbout = document.querySelector('.textAbout');
const input = document.getElementById("textarea");

// let text =  document.getElementsByTagName('p')[0].innerHTML;
// document.getElementById("textarea").value = text;

edit.addEventListener('click', function () {
    editForm.classList.toggle('edit');
    textAbout.classList.toggle('hide');
    edit.classList.toggle('hide');
    let text =  document.querySelector('.textAbout').innerHTML;
    document.getElementById("textarea").defaultValue = text;
    // input.oninput = function() {
    //     document.getElementById("textarea").innerHTML = input.value;
    //     document.getElementsByTagName('p')[0].innerHTML = input.value;
    // };
    // let text =  document.getElementsByTagName('p')[0].innerHTML;
    // document.getElementById("textarea").defaultValue = text;
    // document.getElementsByTagName('p')[0].innerHTML = text;
    // text =  document.getElementsByTagName('p')[0].innerHTML;
});


editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    edit.classList.toggle('hide');

    fetch('/admin', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: document.getElementById("textarea").value,
        })
    }).then(response => response.json())
    .then((response) => {
        document.getElementById("textarea").value = response.text;
        document.querySelector('.textAbout').innerHTML = response.text;
        editForm.classList.toggle('edit');
        textAbout.classList.toggle('hide');
    }).catch(
        error => console.log(error) // Handle the error response object
    );

    return false;
});


// var socket = io();
// $(() => {
//     $("#send").click(()=>{
//         sendMessage({about: $("#textarea").val()});
//     });
//     getMessages()
// });
//
// socket.on('about', addMessages);
//
// function addMessages(textarea){
//     $("#messages").append(`<h4> ${about} </h4>`)
// }
// function getMessages(){
//     $.get('http://localhost:3000/admin', (data) => {
//         data.forEach(addMessages);
//     })
// }
// function sendMessage(message){
//     $.post('http://localhost:3000/admin', message)
// }

