// ====== 1. Dark Mode ======
const btn = document.getElementById("darkBtn");
if (btn) {
    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        btn.innerHTML = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });
}

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    if (btn) btn.innerHTML = "☀️ Light Mode";
}

// ====== 2. Students Data ======
let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// ====== 3. Update Dashboard ======
function updateDashboard(){
    document.getElementById("totalStudents").innerText = students.length;
    const present = students.filter(student => student.status === "มา").length;
    document.getElementById("todayPresent").innerText = present;

    if (students.length > 0) {
        const totalScore = students.reduce((sum, student) => sum + (Number(student.score) || 0), 0);
        const avgScore = (totalScore / students.length).toFixed(1);
        document.getElementById("avgScore").innerText = avgScore;
    } else {
        document.getElementById("avgScore").innerText = "0";
    }

    const totalSavings = students.reduce((sum, student) => sum + (Number(student.savings) || 0), 0);
    document.getElementById("totalSavings").innerText = totalSavings.toLocaleString();
}

// ====== 4. Toggle Form ======
function toggleStudentForm() {
    const form = document.getElementById("studentForm");
    form.style.display = form.style.display === "none" ? "grid" : "none";
    if (form.style.display === "none") {
        clearStudentForm();
    }
}

function clearStudentForm() {
    document.getElementById("studentNo").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentRoom").value = "";
    document.getElementById("studentScore").value = "";
    document.getElementById("studentSavings").value = "";
    document.getElementById("studentGender").value = "ชาย";
}

// ====== 5. Add Student ======
function addStudent() {
    const noInput = document.getElementById("studentNo");
    const nameInput = document.getElementById("studentName");
    const roomInput = document.getElementById("studentRoom");
    const genderInput = document.getElementById("studentGender");
    const scoreInput = document.getElementById("studentScore");
    const savingsInput = document.getElementById("studentSavings");

    if (noInput.value === "" || nameInput.value === "" || roomInput.value === "") {
        showToast("⚠️ กรุณากรอกข้อมูลพื้นฐานให้ครบถ้วน");
        return;
    }

    if (students.some(s => s.no === noInput.value)) {
        showToast("⚠️ เลขที่นี้มีอยู่แล้ว");
        return;
    }

    students.push({
        no: noInput.value,
        name: nameInput.value,
        room: roomInput.value,
        gender: genderInput.value,
        score: scoreInput.value || 0,        
        savings: savingsInput.value || 0,    
        status: "มา"
    });

    saveStudents();
    showStudents();
    updateDashboard();
    toggleStudentForm();
    showToast("✅ เพิ่มข้อมูลนักเรียนเรียบร้อย");
}

// ====== 6. Show Students ======
function showStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";
    const keyword = document.getElementById("searchInput").value.toLowerCase();

    if (students.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 30px;">ไม่มีข้อมูลนักเรียน</td></tr>';
        return;
    }

    students.forEach((student, index) => {
        if (student.name.toLowerCase().includes(keyword)) {
            table.innerHTML += `
            <tr>
                <td>${student.no}</td>
                <td>${student.name} (คะแนน: ${student.score || 0} | ออม: ${student.savings || 0}฿)</td>
                <td>${student.room}</td>
                <td>${student.gender}</td>
                <td style="text-align:center;">
                    <div class="status-box">
                        <button class="status-btn btn-present ${student.status === 'มา' ? 'active' : ''}" onclick="changeStatus(${index}, 'มา')">มา</button>
                        <button class="status-btn btn-absent ${student.status === 'ขาด' ? 'active' : ''}" onclick="changeStatus(${index}, 'ขาด')">ขาด</button>
                        <button class="status-btn btn-leave ${student.status === 'ลา' ? 'active' : ''}" onclick="changeStatus(${index}, 'ลา')">ลา</button>
                    </div>
                </td>
                <td>
                    <button class="edit-btn" onclick="editStudent(${index})">📝 แก้ไข</button>
                    <button class="delete-btn" onclick="deleteStudent(${index})">🗑️ ลบ</button>
                </td>
            </tr>
            `;
        }
    });
}

function changeStatus(index, status) {
    students[index].status = status;
    saveStudents();
    showStudents();
    updateDashboard();
}

// ====== 7. Edit Modal ======
function editStudent(index) {
    document.getElementById("editIndex").value = index;
    document.getElementById("editNo").value = students[index].no;
    document.getElementById("editName").value = students[index].name;
    document.getElementById("editRoom").value = students[index].room;
    document.getElementById("editGender").value = students[index].gender;
    document.getElementById("editScore").value = students[index].score || 0;
    document.getElementById("editSavings").value = students[index].savings || 0;
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveEditStudent() {
    const index = document.getElementById("editIndex").value;
    const newNo = document.getElementById("editNo").value;

    if (students.some((s, i) => s.no === newNo && i !== parseInt(index))) {
        showToast("⚠️ เลขที่นี้มีอยู่แล้ว");
        return;
    }

    students[index].no = newNo;
    students[index].name = document.getElementById("editName").value;
    students[index].room = document.getElementById("editRoom").value;
    students[index].gender = document.getElementById("editGender").value;
    students[index].score = Number(document.getElementById("editScore").value) || 0;
    students[index].savings = Number(document.getElementById("editSavings").value) || 0;

    saveStudents();
    showStudents();
    updateDashboard();
    closeEditModal();
    showToast("✅ บันทึกข้อมูลแก้ไขสำเร็จ");
}

// ====== 8. Delete Modal ======
function deleteStudent(index) {
    document.getElementById("deleteIndex").value = index;
    document.getElementById("deleteStudentName").textContent = students[index].name;
    document.getElementById("deleteModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

function confirmDeleteStudent() {
    const index = document.getElementById("deleteIndex").value;
    const deletedName = students[index].name;
    students.splice(index, 1);
    saveStudents();
    showStudents();
    updateDashboard();
    closeDeleteModal();
    showToast(`🗑️ ลบข้อมูล ${deletedName} แล้ว`);
}

// ====== 9. Toast ======
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ====== 10. Tab Switching ======
function switchPage(pageName) {
    const pages = document.querySelectorAll('.tab-content');
    pages.forEach(page => {
        page.classList.remove('active-tab');
    });
    
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active-tab');
    }
}

// ====== 11. Toggle Theme ======
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.querySelector('.btn-theme');
    if (btn) {
        btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const btn = document.querySelector('.btn-theme');
    if (btn) btn.innerHTML = '☀️ Light Mode';
}

// Initialize
showStudents();
updateDashboard();
