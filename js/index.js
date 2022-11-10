let creditTaken = 0;
let creditMultiplySubjectGP = 0;
const setInnerTextById = (elementId, value = '') => {
    const element = document.getElementById(elementId);
    element.innerText = value;
}

document.getElementById('search-btn').addEventListener('click', function () {
    creditTaken = 0;
    creditMultiplySubjectGP = 0;
    semesterCount = 0;
    toggleBtnById('search-btn', true);
    const idInputField = document.getElementById('id-input');
    const idInputValue = idInputField.value;
    if (idInputValue != '') {
        const studentInfoUrl = `http://software.diu.edu.bd:8189/result/studentInfo?studentId=${idInputValue}`;
        fetch(studentInfoUrl)
            .then(res => res.json())
            // .then(data => data.studentId ? studentInfoView(data) : alert('not exist'))
            .then(data => {
                console.log(data.studentId);
                if (data.studentId === null) {
                    alert('Invalid Student ID');
                    toggleBtnById('search-btn', false);
                }
                else {
                    studentInfoView(data);
                    document.getElementById('results-container').textContent = ``;

                    const semesterIds = ['083', '091', '092', '093', '101', '102', '103', '111', '112', '113', '121', '122', '123', '131', '132', '133', '141', '142', '143', '151', '152', '153', '161', '162', '163', '171', '172', '173', '181', '182', '183', '191', '192', '193', '201', '202', '203', '211', '212', '213', '221', '222'];
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
});

const toggleSpinner = (isVisible = true) => {
    const spinner = document.getElementById('loading-spinner');
    if (isVisible) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
    }
}

const toggleBtnById = (id, isDisabled) => {
    const button = document.getElementById(id);
    if (isDisabled === true) {
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
        // console.log(semesterResult);

        const resultsContainer = document.getElementById('results-container');
        const semesterResultDiv = document.createElement('div');
        const dynamicTRId = `${semesterResult[0].semesterName}-${semesterResult[0].semesterYear}`;
        semesterResultDiv.innerHTML = `
            <div class="mt-5">
                <p>Academic Result of: <span class="bg-info px-1 rounded">${semesterResult[0].semesterName} ${semesterResult[0].semesterYear}</span> for <span class="bg-warning px-1 rounded">${semesterResult[0].studentId}</p>
                <table class="w-100 p-3">
                    <thead>
                        <tr style="background-color: blue; color: white;">
                            <!-- <th class="px-1">Course Id</th> -->
                            <th class="px-1">Course Code</th>
                            <th class="px-1">Course Title</th>
                            <th class="px-1">Credit</th>
                            <th class="px-1">Grade</th>
                            <th class="px-1">Grade Point</th>
                            <th class="px-1">CGPA</th>
                            <!-- <th class="px-1">Credit Count</th> -->
                        </tr>
                    </thead>
                    <tbody id="${dynamicTRId}">
                    </tbody>
                </table>
            </div>
        `;
        resultsContainer.appendChild(semesterResultDiv);

        semesterResult.forEach(subject => {
            creditTaken += subject.totalCredit;
            creditMultiplySubjectGP += subject.pointEquivalent * subject.totalCredit;
            const subjectRow = document.getElementById(dynamicTRId);
            const subjectTr = document.createElement('tr');
            // subjectTr.classList.add("d-flex", "justify-content-between");
            subjectTr.innerHTML = `
            <!-- <td class="px-1">${subject.courseId}</td> -->
            <td class="px-1">${subject.customCourseId}</td>
            <td class="px-1">${subject.courseTitle}</td>
            <td class="px-1">${subject.totalCredit}</td>
            <td class="px-1">${subject.gradeLetter}</td>
            <td class="px-1">${subject.pointEquivalent}</td>
            <td class="px-1">${subject.cgpa}</td>
            <!-- <td class="px-1">${creditTaken}</td> -->
            `;
            subjectRow.appendChild(subjectTr);
            toggleSpinner(false);
        });

        toggleBtnById('search-btn', false);

        if (semesterResult[0].semesterId === '222') {
            calculateGPA(semesterResult[0].semesterId, creditTaken, creditMultiplySubjectGP);
        }
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