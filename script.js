const monthYearEl = document.getElementById("monthYear");
const datesEl = document.getElementById("dates");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const saveEventButton = document.getElementById("saveEvent");
const eventInput = document.getElementById("eventInput");
const eventListEl = document.getElementById("eventList");


let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); 
let selectedDate = null;
let events = JSON.parse(localStorage.getItem("events")) || {};

const months = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

function renderCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  monthYearEl.textContent = `${months[currentMonth]} ${currentYear}`;
  datesEl.innerHTML = "";


  for (let i = firstDayOfMonth; i > 0; i--) {
    const day = document.createElement("div");
    day.classList.add("inactive");
    day.textContent = lastDayOfPrevMonth - i + 1;
    datesEl.appendChild(day);
  }


  for (let i = 1; i <= lastDateOfMonth; i++) {
    const day = document.createElement("div");
    day.textContent = i;
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;


    if (events[dateKey]) {
      day.classList.add("has-event");
      const eventDot = document.createElement("span");
      eventDot.textContent = "•";
      eventDot.style.color = "red";
      eventDot.style.marginLeft = "5px";
      day.appendChild(eventDot);
    }

    if (i === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()) {
      day.classList.add("today");
    }

    day.addEventListener("click", () => openEventModal(dateKey));
    datesEl.appendChild(day);
  }


  const remainingDays = 7 - (datesEl.childElementCount % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const day = document.createElement("div");
      day.classList.add("inactive");
      day.textContent = i;
      datesEl.appendChild(day);
    }
  }
}

function openEventModal(date) {
  selectedDate = date;
  eventInput.value = events[date] || "";
  modal.style.display = "flex";
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  selectedDate = null;
});

// zapisywanie wydarzenia
saveEventButton.addEventListener("click", () => {
  if (eventInput.value) {
    events[selectedDate] = eventInput.value;
    localStorage.setItem("events", JSON.stringify(events));
  } else {
    delete events[selectedDate];
    localStorage.setItem("events", JSON.stringify(events));
  }
  modal.style.display = "none";
  renderCalendar();
  renderEventList();
});

function deleteEvent(date) {
    if (confirm(`Czy na pewno chcesz usunąć wydarzenie z dnia ${date}?`)) {
      delete events[date]; // Usuń wydarzenie z obiektu
      localStorage.setItem("events", JSON.stringify(events)); // Zaktualizuj localStorage
      renderCalendar(); // Odśwież kalendarz
      renderEventList(); // Odśwież listę wydarzeń
    }
  }
  

function renderEventList() {
  eventListEl.innerHTML = "";
  for (const [date, event] of Object.entries(events)) {
    const li = document.createElement("li");
  
    const eventText = document.createElement("span");
    eventText.textContent = `${date}: ${event}`;
    li.appendChild(eventText);
  
    // usuń
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.style.marginLeft = "10px";
    deleteButton.addEventListener("click", () => deleteEvent(date));
    li.appendChild(deleteButton);
  
    eventListEl.appendChild(li);
  }
  
  }


const quotes = [
    "Nigdy nie przestawaj się uczyć, bo życie nigdy nie przestaje nauczać. - Tomasz Leja TI 26062",
    "Każdy dzień to nowa szansa, by coś zmienić. - Tomasz Leja TI 26062",
    "Sukces to suma małych wysiłków powtarzanych dzień po dniu. - Tomasz Leja TI 26062",
  ];
  document.getElementById("dailyQuote").textContent =
    quotes[Math.floor(Math.random() * quotes.length)];


prevButton.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
  renderEventList();
});

nextButton.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
  renderEventList();
});

// Inicjalizacja
renderCalendar();
renderEventList();
