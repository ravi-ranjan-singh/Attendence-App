var maxPercentChart = document.querySelector('.max-perc-chart');
    maxPercChart=new EasyPieChart(maxPercentChart, {
        barColor:'tomato',
        scaleColor:false,
        lineWidth:5,
    });
    var currentPercentChart = document.querySelector('.cur-perc-chart');
   curPercChart= new EasyPieChart(currentPercentChart, {
        barColor:'dodgerblue',
        scaleColor:false,
        lineWidth:5,
    });

/*<---------------------------------------------Main Program Starts Here---------------------------------------->*/    

/*-------------------------------Dom Strings------------------------ */

let addIcon=document.querySelector('.fa-plus-circle');
let btnBasicInfo=document.querySelector('.btn-basic-info');
let inputMonth=document.querySelector('#input-month');
let inputMaxPercent=document.querySelector('#input-max-perc');
let inputNoOfSubject=document.querySelector('#input-no-sub');
let MonthDom=document.querySelector('.month');
let btnToAddSubs=document.querySelector('.btn-add-sub');
let closeBtn=document.querySelector('.fa-times-circle');
let subjectInputForm=document.querySelector('.subject-input-form');
let inputSubjectDomList;
let btnToAddSubToArray=document.querySelector('.btn-push-subject');
let MaxPerceDisp=document.querySelector('.max-perc');
let attendenceCardSection=document.querySelector('.attendence-card-section');
let mainSection=document.querySelector('.main-section');
let subChangeSaveBtn=document.querySelector('.sub-change-save-btn');
let attendedClassesInput=document.querySelector('.attended-class-input');
let totalClassesInput=document.querySelector('.total-class-input');
let currentPercentDisp=document.querySelector('.cur-perc');
let classAttendedDisp=document.querySelector('.c-attended-content')

/*-------------------------------Variable Declaration------------------------ */

let Months=['January','February','March','April','May','June','July','August','September','October','November','December']
let presentMonth = Months[new Date().getMonth()];
let Attendence;
let subInFormHtml=`<div class="form-group"><label for="input-subject">Subject</label><input class="form-control form-control-sm" id="input-subject" type="text" placeholder="Subjects"></div>`
let card

/*--------------------------------------Creation Of Objects Using Constructer Function------------------------ */

let AttendenceInfo = function (month,maxPercent,noOfSubject) {
    this.month=month;
    this.maxPercent=maxPercent;
    this.noOfSubject=noOfSubject;
    this.totalClasses=0;
    this.attendedClasses=0;
    this.currentPercent=0;
    this.subjects=[];
}

let Subject = function (nameOfSubject) {
    this.nameOfSubject=nameOfSubject;
    this.subPercent=0;
    this.subClassAttended=0;
    this.subClassTotal=0;
}

/*--------------------------------------Functions-------------------------- */

function init() {
    if (JSON.parse(localStorage.getItem(presentMonth))!==null) {
        displayCard();
        addIcon.classList.add('invisible');
        closeBtn.classList.remove('invisible');
    }
}
init();
function createAttendence(e) {
    Attendence = new AttendenceInfo(presentMonth,Number(inputMaxPercent.value),Number(inputNoOfSubject.value));
    printBasicInfo(presentMonth,Number(inputMaxPercent.value));
}

function printBasicInfo(pMonth,maxPerc) {
    maxPercChart.update(maxPerc);
    curPercChart.update(0);
    MonthDom.textContent=pMonth;
    btnToAddSubs.classList.remove('invisible');
    addIcon.classList.add('invisible');
    closeBtn.classList.remove('invisible');
    MaxPerceDisp.textContent=maxPerc+'%';

}

function addSubjectInputsToDom(e) {
    for (let i = 0; i < Attendence.noOfSubject; i++) {
        subjectInputForm.insertAdjacentHTML('beforeend',subInFormHtml)
    }
}

function saveToLocalStorage(Attendence) {
    localStorage.setItem(Attendence.month,JSON.stringify(Attendence))
}

function getFromLocalStorage(pMonth) {
    return JSON.parse(localStorage.getItem(pMonth));
}

function getSubjects(e) {
    inputSubjectDomList=document.querySelectorAll('#input-subject');
    for (let i = 0; i < Attendence.noOfSubject; i++) {
        let subject=new Subject(inputSubjectDomList[i].value)
        Attendence.subjects.push(subject);
    }
    saveToLocalStorage(Attendence);
    displayCard();
 }

 function displayCard() {
    btnToAddSubs.classList.add('invisible');
    Attendence=getFromLocalStorage(presentMonth);
    Attendence.subjects.forEach(subject => {
        let html= `<div class="card">
                    <div class="card-header">
                        <h5 class="card-title">${subject.nameOfSubject}<i class="fa fa-pencil" aria-hidden="true" data-toggle="" data-target=""></i></h5>
                    </div>
                    <div class="card-body">
                    <div class="attendence-fraction">
                        <span class="class-attended">${subject.subClassAttended}</span> /
                        <span class="total-attendence">${subject.subClassTotal}</span>
                        
                    </div>
                    <div class="attendence-percentage">${subject.subPercent}%</div>
                    </div>
                   </div>`;
        attendenceCardSection.insertAdjacentHTML('beforeend',html)
    });
    MaxPerceDisp.textContent=Attendence.maxPercent+'%';
    maxPercChart.update(Attendence.maxPercent);
    curPercChart.update(Attendence.currentPercent);
    classAttendedDisp.textContent=Attendence.attendedClasses;
    currentPercentDisp.textContent=Attendence.currentPercent+'%';
    MonthDom.textContent=presentMonth;
 }

function editSub(e) {
    let elToCompare=e.target.parentElement.parentElement.parentElement;
    
    if (elToCompare.className==='card') {
        e.target.setAttribute("data-target", "#Modal3");
        e.target.setAttribute("data-toggle", "modal");
    }
    card=elToCompare;
}

function changeSubjectData() {
    let newTotalClassesVal=totalClassesInput.value;
    let newAttendedClassesVal=attendedClassesInput.value;
    Attendence=getFromLocalStorage(presentMonth);
    Attendence.subjects.forEach((subject)=>{
        if(subject.nameOfSubject===card.children[0].children[0].textContent)
        {
            subject.subClassAttended=newAttendedClassesVal;
            subject.subClassTotal=newTotalClassesVal;
            subject.subPercent=Math.round((newAttendedClassesVal/newTotalClassesVal)*100);
        }
    })
    updateAttendence();
    saveToLocalStorage(Attendence);
    location.reload();
}

function updateAttendence() {
    let totalClassesatt=0;
    let totalClassesocc=0;
    Attendence.subjects.forEach((subject)=>{
        totalClassesatt+=Number(subject.subClassAttended);
        totalClassesocc+=Number(subject.subClassTotal);
    })
    Attendence.totalClasses=totalClassesocc;
    Attendence.attendedClasses=totalClassesatt;
    Attendence.currentPercent=Math.round((totalClassesatt/totalClassesocc)*100);
}

function closeFile() {
    localStorage.clear();
    location.reload();
}
/*--------------------------------------Event Listners------------------------ */

btnBasicInfo.addEventListener('click',createAttendence);
btnToAddSubs.addEventListener('click',addSubjectInputsToDom);
btnToAddSubToArray.addEventListener('click',getSubjects);
mainSection.addEventListener('click',editSub);
subChangeSaveBtn.addEventListener('click',changeSubjectData);
closeBtn.addEventListener('click',closeFile);
/*------------------------------Normal Code------------------------------- */
inputMonth.value=presentMonth;
