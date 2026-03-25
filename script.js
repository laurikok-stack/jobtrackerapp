const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");

const countHaettu = document.getElementById("countHaettu");
const countHaastattelu = document.getElementById("countHaastattelu");
const countHylatty = document.getElementById("countHylatty");

const countTotal = document.getElementById("countTotal");
const percentHaettu = document.getElementById("percentHaettu");
const percentHaastattelu = document.getElementById("percentHaastattelu");
const percentHylatty = document.getElementById("percentHylatty");

const barHaettu = document.getElementById("barHaettu");
const barHaastattelu = document.getElementById("barHaastattelu");
const barHylatty = document.getElementById("barHylatty");

const countTarjous = document.getElementById("countTarjous");
const percentTarjous = document.getElementById("percentTarjous");
const barTarjous = document.getElementById("barTarjous");

let jobs = loadJobs();

function loadJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateStats() {
  const total = jobs.length;
  const haettu = jobs.filter(job => job.status === "Haettu").length;
  const haastattelu = jobs.filter(job => job.status === "Haastattelu").length;
  const tarjous = jobs.filter(job => job.status === "Tarjous").length;
  const hylatty = jobs.filter(job => job.status === "Hylätty").length;

  const haettuPercent = total > 0 ? Math.round((haettu / total) * 100) : 0;
  const haastatteluPercent = total > 0 ? Math.round((haastattelu / total) * 100) : 0;
  const tarjousPercent = total > 0 ? Math.round((tarjous / total) * 100) : 0;
  const hylattyPercent = total > 0 ? Math.round((hylatty / total) * 100) : 0;

  if (countTotal) countTotal.textContent = total;
  if (countHaettu) countHaettu.textContent = haettu;
  if (countHaastattelu) countHaastattelu.textContent = haastattelu;
  if (countTarjous) countTarjous.textContent = tarjous;
  if (countHylatty) countHylatty.textContent = hylatty;

  if (percentHaettu) percentHaettu.textContent = haettuPercent;
  if (percentHaastattelu) percentHaastattelu.textContent = haastatteluPercent;
  if (percentTarjous) percentTarjous.textContent = tarjousPercent;
  if (percentHylatty) percentHylatty.textContent = hylattyPercent;

  if (barHaettu) barHaettu.style.width = `${haettuPercent}%`;
  if (barHaastattelu) barHaastattelu.style.width = `${haastatteluPercent}%`;
  if (barTarjous) barTarjous.style.width = `${tarjousPercent}%`;
  if (barHylatty) barHylatty.style.width = `${hylattyPercent}%`;
}

function createJobElement(job, index) {
  const li = document.createElement("li");

  const textSpan = document.createElement("span");
  textSpan.textContent = `${job.title} - ${job.company}`;

  const statusSelect = document.createElement("select");
  ["Haettu", "Haastattelu", "Tarjous", "Hylätty"].forEach(status => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    if (status === job.status) option.selected = true;
    statusSelect.appendChild(option);
  });

  statusSelect.addEventListener("change", () => {
    jobs[index].status = statusSelect.value;
    saveJobs();
    renderJobs();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Poista ❌";
  deleteBtn.addEventListener("click", () => {
    jobs.splice(index, 1);
    saveJobs();
    renderJobs();
  });

  li.appendChild(textSpan);
  li.appendChild(statusSelect);
  li.appendChild(deleteBtn);

  return li;
}

function renderJobs() {
  if (!jobList) return;

  jobList.innerHTML = "";
  const searchText = searchInput ? searchInput.value.toLowerCase() : "";

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchText) ||
    job.company.toLowerCase().includes(searchText)
  );

  filteredJobs.forEach((job, index) => {
    const li = createJobElement(job, index);
    jobList.appendChild(li);
  });

  updateStats();
}

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const company = document.getElementById("company").value;
    const status = document.getElementById("status").value;

    jobs.push({ title: jobTitle, company, status });
    saveJobs();
    renderJobs();
    form.reset();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", renderJobs);
}

renderJobs();