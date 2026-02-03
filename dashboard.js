document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('js-appointments-list');
    
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    function getEndTime(startTime, motif) {
        let [hours, minutes] = startTime.split(':').map(Number);
        if (motif === 'couple') {
            hours += 1;
        } else {
            minutes += 45;
            if (minutes >= 60) {
                hours += 1;
                minutes -= 60;
            }
        }
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }

    function renderLine(app) {
        const isCouple = app.motif === 'couple';
        const typeClass = isCouple ? 'row-couple' : 'row-enceinte';
        const timeLabel = app.heure.replace(':', 'h');
        const endTime = getEndTime(app.heure, app.motif);
        const labelAction = "GÉRER LE RENDEZ-VOUS"; [cite: 1]

        return `
            <div class="appointment-row ${typeClass}">
                <span class="time">${timeLabel} - ${endTime}</span>
                <span class="patient">${app.patientName}</span>
                <button class="btn-manage">${labelAction}</button>
            </div>
        `;
    }

    if (appointments.length === 0) {
        listContainer.innerHTML = `
            <div class="appointment-row row-empty">
                <span class="time">09h00 - 10h00</span>
                <span class="patient">Aucun rendez-vous enregistré</span>
                <button class="btn-manage">GÉRER LE CRÉNEAU</button>
            </div>
            <div class="appointment-row row-repos">
                <span class="time">12h00 - 14h00</span>
                <span class="patient">PAUSE DÉJEUNER</span>
            </div>
        `;
    } else {
        appointments.sort((a, b) => a.heure.localeCompare(b.heure));

        let htmlContent = "";
        let pauseAdded = false;

        appointments.forEach(app => {
            if (!pauseAdded && app.heure >= "12:00") {
                htmlContent += `
                    <div class="appointment-row row-repos">
                        <span class="time">12h00 - 14h00</span>
                        <span class="patient">PAUSE DÉJEUNER</span>
                    </div>
                `;
                pauseAdded = true;
            }
            htmlContent += renderLine(app);
        });

        if (!pauseAdded) {
            htmlContent += `
                <div class="appointment-row row-repos">
                    <span class="time">12h00 - 14h00</span>
                    <span class="patient">PAUSE DÉJEUNER</span>
                </div>
            `;
        }

        listContainer.innerHTML = htmlContent;
    }
});