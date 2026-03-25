const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");

const countHaettu = document.getElementById("countHaettu");
const countHaastattelu = document.getElementById("countHaastattelu");
const countHylatty = document.getElementById("countHylatty");

let jobs = loadJobs();

function loadJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateStats() {
  const haettu = jobs.filter(job => job.status === "Haettu").length;
  const haastattelu = jobs.filter(job => job.status === "Haastattelu").length;
  const hylatty = jobs.filter(job => job.status === "Hylätty").length;

  if (countHaettu) countHaettu.textContent = haettu;
  if (countHaastattelu) countHaastattelu.textContent = haastattelu;
  if (countHylatty) countHylatty.textContent = hylatty;
}

function createJobElement(job, index) {
  const li = document.createElement("li");

  const textSpan = document.createElement("span");
  textSpan.textContent = `${job.title} - ${job.company}`;

  const statusSelect = document.createElement("select");
  ["Haettu", "Haastattelu", "Hylätty"].forEach(status => {
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