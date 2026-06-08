// ====== List of Time Zones ======
const timeZones = [
    { name: '🌏 Bangkok (ICT)', timezone: 'Asia/Bangkok', offset: '+7' },
    { name: '🌏 Tokyo (JST)', timezone: 'Asia/Tokyo', offset: '+9' },
    { name: '🌏 Singapore (SGT)', timezone: 'Asia/Singapore', offset: '+8' },
    { name: '🌏 Hong Kong (HKT)', timezone: 'Asia/Hong_Kong', offset: '+8' },
    { name: '🌏 Shanghai (CST)', timezone: 'Asia/Shanghai', offset: '+8' },
    { name: '🌏 Mumbai (IST)', timezone: 'Asia/Kolkata', offset: '+5:30' },
    { name: '🌍 London (GMT/BST)', timezone: 'Europe/London', offset: '+0/+1' },
    { name: '🌍 Paris (CET/CEST)', timezone: 'Europe/Paris', offset: '+1/+2' },
    { name: '🌍 Dubai (GST)', timezone: 'Asia/Dubai', offset: '+4' },
    { name: '🌍 Sydney (AEDT/AEST)', timezone: 'Australia/Sydney', offset: '+10/+11' },
    { name: '🌎 New York (EST/EDT)', timezone: 'America/New_York', offset: '-5/-4' },
    { name: '🌎 Los Angeles (PST/PDT)', timezone: 'America/Los_Angeles', offset: '-8/-7' },
    { name: '🌎 Mexico City (CST/CDT)', timezone: 'America/Mexico_City', offset: '-6/-5' },
    { name: '🌎 São Paulo (BRT)', timezone: 'America/Sao_Paulo', offset: '-3' },
    { name: '🌍 Istanbul (EET)', timezone: 'Europe/Istanbul', offset: '+3' },
    { name: '🌏 Seoul (KST)', timezone: 'Asia/Seoul', offset: '+9' },
    { name: '🌏 Manila (PHT)', timezone: 'Asia/Manila', offset: '+8' },
    { name: '🌏 Jakarta (WIB)', timezone: 'Asia/Jakarta', offset: '+7' },
    { name: '🌏 Hanoi (ICT)', timezone: 'Asia/Ho_Chi_Minh', offset: '+7' },
    { name: '🌍 Cairo (EET)', timezone: 'Africa/Cairo', offset: '+2' },
];

let selectedTimeZones = [
    { name: '🌏 Bangkok (ICT)', timezone: 'Asia/Bangkok' },
    { name: '🌎 New York (EST/EDT)', timezone: 'America/New_York' },
    { name: '🌍 London (GMT/BST)', timezone: 'Europe/London' },
];

let is24HourFormat = true;

// ====== Initialize ======
function init() {
    renderClocks();
    renderTimeZoneList();
    setInterval(updateAllClocks, 1000);
}

// ====== Render All Clocks ======
function renderClocks() {
    const clocksGrid = document.getElementById('clocksGrid');
    clocksGrid.innerHTML = '';

    selectedTimeZones.forEach((tz, index) => {
        const clockCard = document.createElement('div');
        clockCard.className = 'clock-card';
        clockCard.id = `clock-${index}`;
        clockCard.innerHTML = `
            <div class="timezone-name">${tz.name}</div>
            <div class="timezone-region">${tz.timezone}</div>
            <div class="digital-time" id="time-${index}">--:--:--</div>
            <div class="digital-date" id="date-${index}">---</div>
            <div class="timezone-offset" id="offset-${index}">Offset: --</div>
            <button class="btn-remove" onclick="removeTimeZone(${index})">🗑️ Remove</button>
        `;
        clocksGrid.appendChild(clockCard);
    });

    updateAllClocks();
}

// ====== Update All Clocks ======
function updateAllClocks() {
    selectedTimeZones.forEach((tz, index) => {
        updateClock(index, tz.timezone);
    });
}

// ====== Update Single Clock ======
function updateClock(index, timezone) {
    const timeElement = document.getElementById(`time-${index}`);
    const dateElement = document.getElementById(`date-${index}`);
    const offsetElement = document.getElementById(`offset-${index}`);

    if (!timeElement) return;

    try {
        // Get current time in the specified timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !is24HourFormat,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        const parts = formatter.formatToParts(new Date());
        let time = '';
        let date = '';

        // Extract time
        const hour = parts.find(p => p.type === 'hour')?.value || '00';
        const minute = parts.find(p => p.type === 'minute')?.value || '00';
        const second = parts.find(p => p.type === 'second')?.value || '00';
        const period = parts.find(p => p.type === 'dayPeriod')?.value || '';

        time = `${hour}:${minute}:${second}`;
        if (period) time += ` ${period}`;

        // Extract date
        const month = parts.find(p => p.type === 'month')?.value || 'Jan';
        const day = parts.find(p => p.type === 'day')?.value || '01';
        const year = parts.find(p => p.type === 'year')?.value || '2024';
        date = `${day} ${month} ${year}`;

        timeElement.textContent = time;
        dateElement.textContent = date;

        // Calculate and display offset
        const currentDate = new Date();
        const utcTime = new Date(currentDate.toLocaleString('en-US', { timeZone: 'UTC' }));
        const tzTime = new Date(currentDate.toLocaleString('en-US', { timeZone: timezone }));
        const offset = (tzTime - utcTime) / (1000 * 60 * 60);
        const offsetHours = Math.floor(Math.abs(offset));
        const offsetMinutes = (Math.abs(offset) % 1) * 60;
        const sign = offset >= 0 ? '+' : '-';
        const offsetString = offsetMinutes > 0 
            ? `UTC ${sign}${offsetHours}:${Math.round(offsetMinutes).toString().padStart(2, '0')}`
            : `UTC ${sign}${offsetHours}`;
        offsetElement.textContent = `Offset: ${offsetString}`;

    } catch (error) {
        console.error(`Error updating clock for ${timezone}:`, error);
        timeElement.textContent = '--:--:--';
    }
}

// ====== Toggle 12/24 Hour Format ======
function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    updateAllClocks();
}

// ====== Show Add Clock Modal ======
function showAddClock() {
    document.getElementById('addClockModal').classList.add('show');
}

// ====== Close Add Clock Modal ======
function closeAddClock() {
    document.getElementById('addClockModal').classList.remove('show');
}

// ====== Render Time Zone List ======
function renderTimeZoneList() {
    const timezoneList = document.getElementById('timezoneList');
    timezoneList.innerHTML = '';

    timeZones.forEach((tz) => {
        const item = document.createElement('div');
        item.className = 'timezone-item';
        if (selectedTimeZones.some(s => s.timezone === tz.timezone)) {
            item.classList.add('selected');
        }
        item.innerHTML = `${tz.name} <span style="float: right; opacity: 0.7;">${tz.offset}</span>`;
        item.onclick = () => toggleTimeZone(tz);
        timezoneList.appendChild(item);
    });
}

// ====== Toggle Time Zone Selection ======
function toggleTimeZone(tz) {
    const index = selectedTimeZones.findIndex(s => s.timezone === tz.timezone);

    if (index > -1) {
        // Remove if already selected
        if (selectedTimeZones.length > 1) {
            selectedTimeZones.splice(index, 1);
        }
    } else {
        // Add if not selected
        selectedTimeZones.push({ name: tz.name, timezone: tz.timezone });
    }

    renderClocks();
    renderTimeZoneList();
}

// ====== Remove Time Zone ======
function removeTimeZone(index) {
    if (selectedTimeZones.length > 1) {
        selectedTimeZones.splice(index, 1);
        renderClocks();
        renderTimeZoneList();
    } else {
        alert('⚠️ Must have at least one time zone!');
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('addClockModal');
    if (e.target === modal) {
        closeAddClock();
    }
});

// Initialize on load
init();
