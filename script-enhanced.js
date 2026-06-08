// ====== Export to Excel ======
function exportToExcel() {
    if (students.length === 0) {
        showToast('⚠️ ไม่มีข้อมูลนักเรียนที่จะส่งออก');
        return;
    }

    // Prepare data
    const data = students.map(student => ({
        'เลขที่': student.no,
        'ชื่อนักเรียน': student.name,
        'ห้อง': student.room,
        'เพศ': student.gender,
        'คะแนน': student.score || 0,
        'ยอดออม': student.savings || 0,
        'สถานะ': student.status
    }));

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Generate file name
    const fileName = `FikClass_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download
    XLSX.writeFile(workbook, fileName);
    showToast('✅ Export Excel สำเร็จแล้ว');
}

// ====== Chart Configuration ======
let scoresChart = null;
let savingsChart = null;

function initCharts() {
    const chartCanvas = document.getElementById('scoresChart');
    const savingsCanv = document.getElementById('savingsChart');
    
    if (!chartCanvas || !savingsCanv) return;

    // Destroy existing charts
    if (scoresChart) scoresChart.destroy();
    if (savingsChart) savingsChart.destroy();

    // Sort students by score
    const topStudents = students.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);
    
    const scoresLabels = topStudents.map(s => s.name);
    const scoresData = topStudents.map(s => s.score || 0);

    // Scores Chart
    scoresChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: scoresLabels,
            datasets: [{
                label: 'คะแนน',
                data: scoresData,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });

    // Savings Chart
    const topSavers = students.sort((a, b) => (b.savings || 0) - (a.savings || 0)).slice(0, 10);
    const savingsLabels = topSavers.map(s => s.name);
    const savingsData = topSavers.map(s => s.savings || 0);

    savingsChart = new Chart(savingsCanv, {
        type: 'doughnut',
        data: {
            labels: savingsLabels,
            datasets: [{
                data: savingsData,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(0, 255, 136, 0.8)',
                    'rgba(0, 212, 255, 0.8)',
                    'rgba(255, 153, 102, 0.8)',
                    'rgba(102, 205, 170, 0.8)',
                    'rgba(255, 192, 203, 0.8)',
                    'rgba(135, 206, 250, 0.8)',
                    'rgba(221, 160, 221, 0.8)',
                    'rgba(238, 203, 85, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// ====== Update Analytics ======
function updateAnalytics() {
    if (students.length > 0) {
        const totalScore = students.reduce((sum, student) => sum + (Number(student.score) || 0), 0);
        const avgScore = (totalScore / students.length).toFixed(1);
        
        const totalSavings = students.reduce((sum, student) => sum + (Number(student.savings) || 0), 0);
        
        const presentCount = students.filter(student => student.status === 'มา').length;
        const presentPercentage = ((presentCount / students.length) * 100).toFixed(1);
        
        document.getElementById('avgScoreValue').textContent = avgScore;
        document.getElementById('totalSavingsValue').textContent = totalSavings.toLocaleString();
        document.getElementById('presentPercentageValue').textContent = presentPercentage + '%';
    }
    
    initCharts();
}

// ====== Update on page switch ======
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageName) {
    originalSwitchPage(pageName);
    if (pageName === 'analytics') {
        setTimeout(() => {
            updateAnalytics();
        }, 100);
    }
};

// ====== Add Dark Mode to existing code ======
const btnTheme = document.querySelector('.btn-theme');
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btnTheme.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        btnTheme.innerHTML = '☀️ Light Mode';
    }
}

// Load page on init
window.addEventListener('load', () => {
    updateAnalytics();
});
