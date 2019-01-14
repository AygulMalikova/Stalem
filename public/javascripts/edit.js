const edit = document.querySelector('.edit');
const editForm = document.querySelector('.editForm');
const textAbout = document.querySelector('.textAbout');
const input = document.getElementById("textarea");


edit.addEventListener('click', function () {
    editForm.classList.toggle('edit');
    textAbout.classList.toggle('hide');
    edit.classList.toggle('hide');
    let text =  document.querySelector('.textAbout').innerHTML;
    document.getElementById("textarea").defaultValue = text;
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

