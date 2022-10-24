const setInnerTextById = (elementId, value = '') => {
    const element = document.getElementById(elementId);
    element.innerText = value;
}

const result = [];

document.getElementById('search-btn').addEventListener('click', function () {
    semesterCount = 0;
    toggleSpinner(true);
    const idInputField = document.getElementById('id-input');
    const idInputValue = idInputField.value;
    // const idInputValue = '192-15-2794';
    if (idInputValue != '') {
        const studentInfoUrl = `http://software.diu.edu.bd:8189/result/studentInfo?studentId=${idInputValue}`;
        fetch(studentInfoUrl)
            .then(res => res.json())
            .then(data => studentInfoView(data))

        document.getElementById('results-container').textContent = ``;

        const semesterIds = ['083', '091', '092', '093', '101', '102', '103', '111', '112', '113', '121', '122', '123', '131', '132', '133', '141', '142', '143', '151', '152', '153', '161', '162', '163', '171', '172', '173', '181', '182', '183', '191', '192', '193', '201', '202', '203', '211', '212', '213', '221', '222'];
        // const semesterIds = ['221', '222'];

        for (const semesterId of semesterIds) {
            toggleSpinner(false);
            const resultUrl = `http://software.diu.edu.bd:8189/result?grecaptcha=&semesterId=${semesterId}&studentId=${idInputValue}`;
            fetch(resultUrl)
                .then(res => res.json())
                .then(data => detailResultView(data))
            toggleSpinner(true);
        }
    }
    else {
        alert('ID cannot be empty');
    }
});

const toggleSpinner = isTrue => {
    const spinner = document.getElementById('loading-spinner');
    if (isTrue) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
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
        console.log(semesterResult);
        const resultsContainer = document.getElementById('results-container');
        const semesterResultDiv = document.createElement('div');
        const dynamicTRId = `${semesterResult[0].semesterName}-${semesterResult[0].semesterYear}`;
        semesterResultDiv.innerHTML = `
            <div class="mt-5">
                <p>Academic Result of: <span class="bg-info px-1 rounded">${semesterResult[0].semesterName} ${semesterResult[0].semesterYear}</span></p>
                <table class="w-100">
                    <thead>
                        <tr style="background-color: blue; color: white;">
                            <!-- <th class="px-1">Course Id</th> -->
                            <th class="px-1">Course Code</th>
                            <th class="px-1">Course Title</th>
                            <th class="px-1">Credit</th>
                            <th class="px-1">Grade</th>
                            <th class="px-1">Grade Point</th>
                            <!-- <th class="px-1">CGPA</th> -->
                        </tr>
                    </thead>
                    <tbody id="${dynamicTRId}">
                    </tbody>
                </table>
            </div>
                            `;
        resultsContainer.appendChild(semesterResultDiv);

        semesterResult.forEach(subject => {
            const subjectRow = document.getElementById(dynamicTRId);
            const subjectTr = document.createElement('tr');
            const newCourse = {
                id: subject.courseId,
                gpa: subject.pointEquivalent,
            }
            result.push(newCourse);
            subjectTr.innerHTML = `
            <!-- <td class="px-1">${subject.courseId}</td> -->
            <td class="px-1">${subject.customCourseId}</td>
            <td class="px-1">${subject.courseTitle}</td>
            <td class="px-1">${subject.totalCredit}</td>
            <td class="px-1">${subject.gradeLetter}</td>
            <td class="px-1">${subject.pointEquivalent}</td>
            <!-- <td class="px-1">${subject.cgpa}</td> -->
            `;
            subjectRow.appendChild(subjectTr);
        });

    }
}