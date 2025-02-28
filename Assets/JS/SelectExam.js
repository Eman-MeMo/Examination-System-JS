function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let userId = getQueryParam("id") || localStorage.getItem("id");
if (userId) {
    fetch('./Assets/Data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const student = data.Users.find(s => s.id == userId);
            if (student) {
                document.getElementById("welcome").textContent = `Welcome ${student.fname} ${student.lname}`;
                document.getElementById("id").value = student.id;
            } else {
                window.location.href = "login.html";
            }
        })
        .catch(error => console.error("Error loading students:", error));
} else {
    window.location.href = "login.html";
}

let submitbtn = document.getElementById("start-btn");
submitbtn.addEventListener("click", function (e) {
    const levelSelected = document.querySelector('input[name="level"]:checked');
    const courseSelected = document.querySelector('input[name="course"]:checked');
    if (!levelSelected || !courseSelected) {
        document.getElementById("error").style.display = "block";
        e.preventDefault();
    }
});