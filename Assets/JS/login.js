let students = [];

fetch('./Assets/Data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        students = data.Users;
    })
    .catch(error => console.error(error));

const email = document.getElementById("email");
const userpass = document.getElementById("password");

email.addEventListener('blur', function () {
    this.classList.toggle("error", !isemailValid());
    this.classList.toggle("success", isemailValid());
});

userpass.addEventListener('blur', function () {
    this.classList.toggle("error", !isUserPassValid());
    this.classList.toggle("success", isUserPassValid());
});

document.forms[0].addEventListener('submit', function (e) {
    if (!isemailValid() || !isUserPassValid()) {
        e.preventDefault();
        return;
    }

    let student = students.find(student => student.email === email.value && student.password === userpass.value);
    if (!student) {
        document.getElementById('error').style.display = "block";
        e.preventDefault();
    } else {
        document.getElementById('id').value = student.id;
        console.log(student.id);

        let remember = document.getElementById("remember");
        if (remember.checked) {
            localStorage.setItem("id", student.id);
        }
    }
});

function isemailValid() {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
}

function isUserPassValid() {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,10}$/.test(userpass.value);
}
