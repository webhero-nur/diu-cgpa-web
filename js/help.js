document.getElementById("id-input").value = '181-15-1966';

let completedCourseDetails = [];
const passedCourses = subject => {
    completedCourseDetails.push(subject);
}

const viewAllCourseResult = () => {
    document.getElementById("semester-result-btn").removeAttribute("disabled");
    document.getElementById("passed-course-btn").setAttribute("disabled", true);
    document.getElementById("semester-result-btn").classList.remove("not-allowed");
    document.getElementById("passed-course-btn").classList.add("not-allowed");

    document.getElementById('results-container').textContent = ``;

    completedCourseDetails.sort((a, b) => (a.customCourseId > b.customCourseId ? 1 : -1));

    const resultsContainer = document.getElementById('results-container');
    const semesterResultDiv = document.createElement('div');
    semesterResultDiv.innerHTML = `
        <div class="mt-5">
        <p class="bg-vallagchey p-2 text-light rounded">Academic Result of all completed courses for id: <span class="bg-info text-purple px-1 rounded fw-bold">${completedCourseDetails[0].studentId}</span></p>
            <table class="w-100 p-3">
                <thead>
                    <tr class="py-5 bg-primary text-white">
                        <th class="pe-1 ps-2">Sl No.</th>
                        <th class="px-1">Course Code</th>
                        <th class="px-1">Course Title</th>
                        <th class="px-1">Credit</th>
                        <th class="px-1">Grade</th>
                        <th class="px-1">Grade Point</th>
                    </tr>
                </thead>
                <tbody id="course-wise-result">
                </tbody>
            </table>
        </div>
    `;
    resultsContainer.appendChild(semesterResultDiv);

    let slNo = 0;
    let creditCompleted = 0;
    const subjectRow = document.getElementById("course-wise-result");
    completedCourseDetails.forEach(course => {
        slNo++;
        creditCompleted += course.totalCredit;
        const subjectTr = document.createElement('tr');
        subjectTr.innerHTML = `
            <td class="text-center">#${slNo}</td>
            <td class="px-1">${course.customCourseId}</td>
            <td class="px-1">${course.courseTitle}</td>
            <td class="px-1 text-center">${course.totalCredit}</td>
            <td class="ps-3 pe-1">${course.gradeLetter}</td>
            <td class="px-1 text-center">${course.pointEquivalent}</td>
            `;
        subjectRow.appendChild(subjectTr);
    });
    const calculationTr = document.createElement('tr');
    calculationTr.classList.add("fw-bold");
    calculationTr.innerHTML = `
        <td colspan="3" class="px-1 text-end">Total Completed Credit: </td>
        <td class="px-1 text-center">${creditCompleted}</td>
        <td class="px-1 text-end">CGPA: </td>
        <td id="cgpa-field" class="px-1 text-center">#</td>
        `;
    subjectRow.appendChild(calculationTr);
}