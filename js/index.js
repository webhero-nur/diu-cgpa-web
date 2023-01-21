// let creditTaken = 0;
// let creditMultiplySubjectGP = 0;
const setInnerTextById = (elementId, value = '') => {
    const element = document.getElementById(elementId);
    element.innerText = value;
}

document.getElementById('search-btn').addEventListener('click', function () {
    callForWork();
});

document.getElementById("semester-result-btn").addEventListener('click', function () {
    callForWork();
    document.getElementById("semester-result-btn").setAttribute("disabled", true);
    document.getElementById("semester-result-btn").classList.add("not-allowed");
    document.getElementById("passed-course-btn").classList.remove("not-allowed");
});

const callForWork = () => {
    completedCourseDetails = [];
    toggleBtnById('search-btn', true);
    const idInputField = document.getElementById('id-input');
    const idInputValue = idInputField.value;
    if (idInputValue != '') {
        document.getElementById("result-section").classList.remove("d-none");
        document.getElementById("btn-selection-container").classList.add("d-none");
        const studentInfoUrl = `http://software.diu.edu.bd:8189/result/studentInfo?studentId=${idInputValue}`;
        fetch(studentInfoUrl)
            .then(res => res.json())
            .then(data => {
                if (data.studentId === null) {
                    alert('Invalid Student ID');
                    toggleBtnById('search-btn', false);
                }
                else {
                    studentInfoView(data);
                    document.getElementById('results-container').textContent = ``;

                    const semesterIds = ['171', '172', '173', '181', '182', '183', '191', '192', '193', '201', '202', '203', '211', '212', '213', '221', '222', '223', '231'];
                    // const semesterIds = ['221', '222'];

                    for (const semesterId of semesterIds) {
                        toggleSpinner(true);
                        const resultUrl = `http://software.diu.edu.bd:8189/result?grecaptcha=&semesterId=${semesterId}&studentId=${idInputValue}`;
                        fetch(resultUrl)
                            .then(res => res.json())
                            .then(data => detailResultView(data))
                    }
                }
            });

    }
    else {
        alert('ID cannot be empty');
        toggleBtnById('search-btn', false);
    }
}

const toggleSpinner = (isVisible = true) => {
    const spinner = document.getElementById('loading-spinner');
    const passedCourseBtn = document.getElementById("passed-course-btn");
    if (isVisible) {
        spinner.classList.remove('d-none');
        passedCourseBtn.setAttribute("disabled", true);
    }
    else {
        spinner.classList.add('d-none');
        passedCourseBtn.removeAttribute("disabled");
    }
}

const toggleBtnById = (id, isDisabled) => {
    const button = document.getElementById(id);
    if (isDisabled) {
        button.setAttribute('disabled', 'true');
    }
    else {
        button.removeAttribute('disabled');
    }
}

const studentInfoView = studentInfo => {
    const progInfo = `${studentInfo.programName} (Program Code: ${studentInfo.programId})`;

    setInnerTextById('student-program', progInfo);
    setInnerTextById('student-faculty', studentInfo.facultyName);
    setInnerTextById('student-name', studentInfo.studentName);
    setInnerTextById('student-id', studentInfo.studentId);
    setInnerTextById('student-enrolled', studentInfo.semesterName);
    setInnerTextById('student-batch', studentInfo.batchNo);
}


const detailResultView = semesterResult => {
    if (semesterResult.length != 0) {
        const resultsContainer = document.getElementById('results-container');
        const semesterResultDiv = document.createElement('div');
        const dynamicTRId = `${semesterResult[0].semesterName}-${semesterResult[0].semesterYear}`;
        semesterResultDiv.innerHTML = `
            <div class="mt-5">
                <p>Academic Result of: <span class="bg-info px-1 rounded">${semesterResult[0].semesterName} ${semesterResult[0].semesterYear}</span> for <span class="bg-warning px-1 rounded">${semesterResult[0].studentId}</span></p>
                <table class="w-100">
                    <thead>
                        <tr class="py-5 bg-primary text-white">
                            <th class="pe-1 ps-2">Course Code</th>
                            <th class="px-1">Course Title</th>
                            <th class="px-1">Credit</th>
                            <th class="px-1">Grade</th>
                            <th class="px-1">Grade Point</th>
                            <th class="px-1">SGPA</th>
                        </tr>
                    </thead>
                    <tbody id="${dynamicTRId}">
                    </tbody>
                </table>
            </div>
        `;
        resultsContainer.appendChild(semesterResultDiv);

        semesterResult.forEach(subject => {
            // console.log(subject);
            if (subject.pointEquivalent > 0) {
                passedCourses(subject);
            }
            // creditTaken += subject.totalCredit;
            // creditMultiplySubjectGP += subject.pointEquivalent * subject.totalCredit;
            const subjectRow = document.getElementById(dynamicTRId);
            const subjectTr = document.createElement('tr');
            subjectTr.innerHTML = `
            <td class="px-1">${subject.customCourseId}</td>
            <td class="px-1">${subject.courseTitle}</td>
            <td class="px-1">${subject.totalCredit}</td>
            <td class="px-1">${subject.gradeLetter}</td>
            <td class="px-1">${subject.pointEquivalent}</td>
            <td class="px-1">${subject.cgpa}</td>
            `;
            subjectRow.appendChild(subjectTr);
            toggleSpinner(false);
        });

        toggleBtnById('search-btn', false);

        document.getElementById("btn-selection-container").classList.remove("d-none");
    }
}

const calculateGPA = (semester, credit, result) => {
    if (semester === '222') {
        let GPA = result / credit;
        showGPA(credit, GPA);
    }
}

const showGPA = (totalCreditCompleted, resultFinal) => {
    console.log(totalCreditCompleted, resultFinal);
}