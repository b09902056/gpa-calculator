let c = [0,0,0,0,0];
let get = [0,0,0,0,0];
let left = [0,0,0,0,0];
let Name = "";
function hi(){
    document.getElementById("hi").innerHTML = "Hi, " + Name;
}
function checkLogin(){
    if (sessionStorage.getItem("name") === null){
        window.location.replace("/login");
    }
}
function checkLogout(){
    if (sessionStorage.getItem("name") !== null){
        window.location.replace("/");
    }
}
function logout(){
    sessionStorage.removeItem("name");
    localStorage.removeItem("name");
    window.location.replace("/login");
}
function login(){
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value
    if (name == "" || password == ""){
        document.getElementById("error").innerHTML = "please fill in Name and Password";
        return;
    }
    localStorage.setItem("name", name);
    const data = {"name": name, "password": password};
    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((response) => {
        const status = response.status;
        if (status == 201){
            window.location.replace("/");
        }
        else if (status == 202){
            document.getElementById("error").innerHTML = "password incorrect";
        }
        else{
            document.getElementById("error").innerHTML = "account incorrect";
        }
    })
}

async function getName(){
    if (sessionStorage.getItem("name") == null){
        Name = localStorage.getItem("name");
        if (Name != null){
            localStorage.removeItem("name")
            sessionStorage.setItem("name", Name);
        }
    }
    else{
        Name = sessionStorage.getItem("name");
    }
}
//
async function initCredit() {
    const response = await fetch('/api/getcredit/' + Name);
    const data = await response.json();
    const total = data[0].type1 + data[0].type2 + data[0].type3 + data[0].type4;
    document.getElementById("c0").innerHTML = total;
    document.getElementById("c1").value = data[0].type1;
    document.getElementById("c2").value = data[0].type2;
    document.getElementById("c3").value = data[0].type3;
    document.getElementById("c4").value = data[0].type4;
    
    c[0] = Number(total);
    c[1] = Number(data[0].type1);
    c[2] = Number(data[0].type2);
    c[3] = Number(data[0].type3);
    c[4] = Number(data[0].type4);
    for (let i = 0; i <= 4; i++){
        left[i] = c[i] - get[i];
        document.getElementById("left"+i).innerHTML = left[i];
    }
    b = document.getElementById("csave");
    b.innerHTML = "modify";
    b.setAttribute("onclick", "modifyCredit()");
    document.getElementById("c1").disabled = true;
    document.getElementById("c2").disabled = true;
    document.getElementById("c3").disabled = true;
    document.getElementById("c4").disabled = true;
}
async function initCourse() {
    for (let sem = 1; sem <= 9; sem++){
        const response = await fetch(`/api/initcourse/${Name}sem${sem}`);
        const data = await response.json();
        for (let i = 0; i < data.length; i++){
            addForm(sem);
            document.getElementById("course"+sem+"."+i).value = data[i].title;
            document.getElementById("type"+sem+"."+i).value = data[i].type;
            document.getElementById("credit"+sem+"."+i).value = data[i].credit;
            document.getElementById("grade"+sem+"."+i).value = data[i].grade;
            saveCourse(sem, i);
        }
    }
}

function modifyCredit(){
    document.getElementById("c1").disabled = false;
    document.getElementById("c2").disabled = false;
    document.getElementById("c3").disabled = false;
    document.getElementById("c4").disabled = false;
    let b = document.getElementById("csave");
    b.innerHTML = "save";
    b.setAttribute("onclick", "saveCredit()");
}

function saveCredit(){
    c[1] = Number(document.getElementById("c1").value);
    c[2] = Number(document.getElementById("c2").value);
    c[3] = Number(document.getElementById("c3").value);
    c[4] = Number(document.getElementById("c4").value);
    c[0] = c[1] + c[2] + c[3] + c[4];
    document.getElementById("c0").innerHTML = c[0];
    for (let i = 0; i <= 4; i++){
        left[i] = c[i] - get[i];
        document.getElementById("left"+i).innerHTML = left[i];
    }
    b = document.getElementById("csave");
    b.innerHTML = "modify";
    b.setAttribute("onclick", "modifyCredit()");
    document.getElementById("c1").disabled = true;
    document.getElementById("c2").disabled = true;
    document.getElementById("c3").disabled = true;
    document.getElementById("c4").disabled = true;

    const data = {"type1": c[1], "type2": c[2], "type3": c[3], "type4": c[4]};
    fetch('/api/updatecredit/'+Name, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((response) => response.json())
}

class semester{
    constructor(id){
        this.num = 0;
        this.id = id;
        this.course = [];
        this.credit = [];
        this.grade = [];
        this.creditSum = 0;
        this.failed = 0;
        this.pass = 0;
        this.gpaSum = 0;
    }
}

let allS = [];
for (let i = 0; i <= 9; i++){
    allS.push(new semester(i));
}

function showGPA(id){
    let s = String(Math.floor((id+1)/2)) + "-" + (2-id%2) + ":\u00A0\u00A0";
    let c = "Earned Credits = " + (allS[id].creditSum + allS[id].pass);
    let g = ",\u00A0\u00A0\u00A0GPA = ";
    if (allS[id].gpaSum == 0 || allS[id].creditSum == 0) g += 0;
    else{
        let x = Math.round(100 * allS[id].gpaSum / (allS[id].creditSum + allS[id].failed));
        let strX = String(x);
        g += strX[0] + "." + strX[1] + strX[2];
    }
    if (id == 0)
        document.getElementById(id).innerHTML = "Overall:\u00A0\u00A0" + c + g;
    else if (id == 9)
        document.getElementById(id).innerHTML = "Others:\u00A0\u00A0" + c + g;
    else
        document.getElementById(id).innerHTML = s + c + g;
}

function modifyCourse(id, num){
    document.getElementById("course" + id + '.' + num).disabled = false;
    document.getElementById("type" + id + '.' + num).disabled = false;
    document.getElementById("credit" + id + '.' + num).disabled = false;
    document.getElementById("grade" + id + '.' + num).disabled = false;
    let button = document.getElementById("button" + id + '.' + num);
    button.value = "save";
    button.setAttribute("onclick", "saveCourse("+id+","+num+")");
    
    let t = Number(document.getElementById("type" + id + '.' + num).value);
    let credit = Number(document.getElementById("credit" + id + '.' + num).value);
    if (allS[id].grade[num] != 0 && t != 5){
        get[t] -= credit; 
        get[0] -= credit; 
        left[t] = c[t] - get[t];
        left[0] = c[0] - get[0]; 
        document.getElementById("get"+t).innerHTML = get[t];
        document.getElementById("get0").innerHTML = get[0];
        document.getElementById("left"+t).innerHTML = left[t];
        document.getElementById("left0").innerHTML = left[0];
    }

    if (allS[id].grade[num] == -1){
        if (t != 5)
            allS[0].pass -= allS[id].credit[num];
        allS[id].pass -= allS[id].credit[num];
    }
    else if (allS[id].grade[num] == 0){
        if (t != 5)
            allS[0].failed -= allS[id].credit[num];
        allS[id].failed -= allS[id].credit[num];
    }
    else{
        allS[id].creditSum -= allS[id].credit[num];
        allS[id].gpaSum -= allS[id].credit[num] * allS[id].grade[num];
        if (t != 5){
            allS[0].creditSum -= allS[id].credit[num];
            allS[0].gpaSum -= allS[id].credit[num] * allS[id].grade[num];
        }
    }
    allS[id].course[num] = "";
    allS[id].credit[num] = 0;
    allS[id].grade[num] = 0;

    showGPA(id);
    showGPA(0);
}

function saveCourse(id, num){
    let course = document.getElementById("course" + id + '.' + num);
    let type = document.getElementById("type" + id + '.' + num);
    let credit = document.getElementById("credit" + id + '.' + num);
    let grade = document.getElementById("grade" + id + '.' + num);
    let button = document.getElementById("button" + id + '.' + num);

    course.disabled = true;
    type.disabled = true;
    credit.disabled = true;
    grade.disabled = true;
    button.value = "modify";
    button.setAttribute("onclick", "modifyCourse("+id+","+num+")");

    allS[id].course[num] = course.value;
    allS[id].credit[num] = Number(credit.value);
    allS[id].grade[num] = Number(grade.value);
    
    if (allS[id].grade[num] == -1){
        if (type.value != 5)
            allS[0].pass += allS[id].credit[num];
        allS[id].pass += allS[id].credit[num];
    }
    else if (allS[id].grade[num] == 0){
        if (type.value != 5)
            allS[0].failed += allS[id].credit[num];
        allS[id].failed += allS[id].credit[num];
    }
    else{
        allS[id].creditSum += allS[id].credit[num];
        allS[id].gpaSum += allS[id].credit[num] * allS[id].grade[num];
        if (type.value != 5){
            allS[0].creditSum += allS[id].credit[num];
            allS[0].gpaSum += allS[id].credit[num] * allS[id].grade[num];
        }
    }

    let t = Number(type.value);
    let credit1 = Number(document.getElementById("credit" + id + '.' + num).value);
    if (allS[id].grade[num] != 0 && t != 5){
        get[t] += credit1; 
        get[0] += credit1; 
        left[t] = c[t] - get[t]; 
        left[0] = c[0] - get[0]; 
        document.getElementById("get"+t).innerHTML = get[t];
        document.getElementById("get0").innerHTML = get[0];
        document.getElementById("left"+t).innerHTML = left[t];
        document.getElementById("left0").innerHTML = left[0];
    }
    
    showGPA(id);
    showGPA(0);
    
    const data = {"sem": id, "id": num, "title": course.value, "type": type.value,
                  "credit": Number(credit.value), "grade": grade.value};
    if (data.title === "") data.title = "nothing";
    fetch('/api/updatecourse/' + Name, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    // .then((response) => response.json())
}

function addForm(id) {
    let num = allS[id].num;
    allS[id].num += 1;

    let form = document.createElement("form");
    form.id = "input" + id + "." + num;

    let courseLabel = document.createElement("label");
    courseLabel.for = "course" + id + '.' + num;
    courseLabel.innerHTML = "Course Title: ";

    let courseInput = document.createElement("input");
    courseInput.type = "text";
    courseInput.id = "course" + id + '.' + num;

    let typeInput = document.createElement("select");
    typeInput.id = "type" + id + '.' + num;

    let option1 = document.createElement("option");
    option1.value = "1";
    option1.innerHTML = "共同必修及通識 ";
    let option2 = document.createElement("option");
    option2.value = "2";
    option2.innerHTML = "必修";
    let option3 = document.createElement("option");
    option3.value = "3";
    option3.innerHTML = "系內選修";
    let option4 = document.createElement("option");
    option4.value = "4";
    option4.innerHTML = "系外選修";
    let option5 = document.createElement("option");
    option5.value = "5";
    option5.innerHTML = "體育";
    typeInput.appendChild(option1);
    typeInput.appendChild(option2);
    typeInput.appendChild(option3);
    typeInput.appendChild(option4);
    typeInput.appendChild(option5);

    let creditLabel = document.createElement("label");
    creditLabel.for = "credit" + id + '.' + num;
    creditLabel.innerHTML = "Credits: ";
    
    let creditInput = document.createElement("input");
    creditInput.type ="number";
    creditInput.id = "credit" + id + '.' + num;
    creditInput.style = "width:40px";
    creditInput.min = "0";
    creditInput.max = "10";

    let gradeLabel = document.createElement("label");
    gradeLabel.for = "grade";
    gradeLabel.innerHTML = "Grade: ";

    let gradeInput = document.createElement("select");
    gradeInput.id = "grade" + id + '.' + num;

    let optionA1 = document.createElement("option");
    optionA1.value = "4.3";
    optionA1.innerHTML = "A+";
    let optionA2 = document.createElement("option");
    optionA2.value = "4.0";
    optionA2.innerHTML = "A";
    let optionA3 = document.createElement("option");
    optionA3.value = "3.7";
    optionA3.innerHTML = "A-";

    let optionB1 = document.createElement("option");
    optionB1.value = "3.3";
    optionB1.innerHTML = "B+";
    let optionB2 = document.createElement("option");
    optionB2.value = "3.0";
    optionB2.innerHTML = "B";
    let optionB3 = document.createElement("option");
    optionB3.value = "2.7";
    optionB3.innerHTML = "B-";

    let optionC1 = document.createElement("option");
    optionC1.value = "2.3";
    optionC1.innerHTML = "C+";
    let optionC2 = document.createElement("option");
    optionC2.value = "2.0";
    optionC2.innerHTML = "C";
    let optionC3 = document.createElement("option");
    optionC3.value = "1.7";
    optionC3.innerHTML = "C-";

    let optionF = document.createElement("option");
    optionF.value = "0";
    optionF.innerHTML = "F";
    let optionX = document.createElement("option");
    optionX.value = "0";
    optionX.innerHTML = "X";
    let optionP = document.createElement("option");
    optionP.value = "-1";
    optionP.innerHTML = "Pass";

    gradeInput.appendChild(optionA1);
    gradeInput.appendChild(optionA2);
    gradeInput.appendChild(optionA3);
    gradeInput.appendChild(optionB1);
    gradeInput.appendChild(optionB2);
    gradeInput.appendChild(optionB3);
    gradeInput.appendChild(optionC1);
    gradeInput.appendChild(optionC2);
    gradeInput.appendChild(optionC3);
    gradeInput.appendChild(optionF);
    gradeInput.appendChild(optionX);
    gradeInput.appendChild(optionP);
    
    let save = document.createElement("input");
    save.type = "button";
    save.id = "button" + id + '.' + num;
    save.value = "save";
    save.setAttribute("onclick", "saveCourse("+id+","+num+")");

    form.appendChild(courseLabel);
    form.appendChild(courseInput);
    form.appendChild(typeInput);
    form.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
    form.appendChild(creditLabel);
    form.appendChild(creditInput);
    form.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
    form.appendChild(gradeLabel);
    form.appendChild(gradeInput);
    form.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
    form.appendChild(save);

    document.getElementById("form" + id).appendChild(form);
    allS[id].course[num] = "";
    allS[id].credit[num] = 0;
    allS[id].grade[num] = 0;
}

function deleteForm(id) {
    if (allS[id].num <= 0) return;
    allS[id].num -= 1;
    let num = allS[id].num;

    let t = Number(document.getElementById("type" + id + '.' + num).value);
    let credit = Number(document.getElementById("credit" + id + '.' + num).value);
    if (allS[id].grade[num] != 0 && t != 5){
        get[t] -= credit; 
        get[0] -= credit; 
        left[t] = c[t] - get[t];
        left[0] = c[0] - get[0]; 
        document.getElementById("get"+t).innerHTML = get[t];
        document.getElementById("get0").innerHTML = get[0];
        document.getElementById("left"+t).innerHTML = left[t];
        document.getElementById("left0").innerHTML = left[0];
    }

    if (allS[id].grade[num] == -1){
        allS[0].pass -= allS[id].credit[num];
        allS[id].pass -= allS[id].credit[num];
    }
    else if (allS[id].grade[num] == 0){
        allS[0].failed -= allS[id].credit[num];
        allS[id].failed -= allS[id].credit[num];
    }
    else{
        allS[id].creditSum -= allS[id].credit[num];
        allS[0].creditSum -= allS[id].credit[num];
        allS[id].gpaSum -= allS[id].credit[num] * allS[id].grade[num];
        allS[0].gpaSum -= allS[id].credit[num] * allS[id].grade[num];
    }
    allS[id].course[num] = "";
    allS[id].credit[num] = 0;
    allS[id].grade[num] = 0;

    showGPA(id);
    showGPA(0);
    document.getElementById("input" + id + "." + num).remove();
    
    const data = {"sem": id, "id": num};
    fetch('/api/deletecourse/' + Name, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}


function register(){
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    if (name == "" || password == ""){
        document.getElementById("error").innerHTML = "please fill in Name, Email, and Password";
        return;
    }
    if (! /^[a-z]+$/i.test(name) ){
        document.getElementById("error").innerHTML = "Name can only consists of English letters";
        return;
    }
    const data = {"name": name, "password": password};
    fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then((response) => {
        const status = response.status;
        if (status == 201){
            document.getElementById("error").innerHTML = "The name is registered";
        }
        else{
            window.location.replace("/login");
        }
    })
}
