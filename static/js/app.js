let currentTool = null;
let selectedFiles = null;
let convertedBlob = null;

function goHome() {
  window.location.href = "/";
}
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function resetToTools() {
  document.getElementById("controls").classList.add("hidden");
  document.getElementById("toolSelect").classList.remove("hidden");
}

function selectTool(tool) {
  currentTool = tool;
  selectedFiles = null;

 const map = {
  img: "Image → PDF",
  pdf: "PDF → DOCX",
  docx: "DOCX → PDF"
};

document.getElementById("operationLine").innerText =
  `Home → ${map[tool]}`;


  document.getElementById("toolSelect").classList.add("hidden");
  document.getElementById("controls").classList.remove("hidden");

  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(tool).classList.remove("hidden");

  document.getElementById("convertBtn").classList.remove("hidden");
  document.getElementById("downloadBtn").classList.add("hidden");
  document.getElementById("resetBtn").classList.add("hidden");
  document.getElementById("preview").classList.add("hidden");
}


function handleFiles(input) {
  selectedFiles = input.files;
  const file = input.files[0];
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);

  const info = document.getElementById("fileInfo");
  info.innerText = `${file.name} • ${sizeMB} MB`;
  info.classList.remove("hidden");
}

async function convert() {
  if (!selectedFiles) {
    alert("Please select a file");
    return;
  }

  const fd = new FormData();
  if (currentTool === "img") {
    for (let f of selectedFiles) fd.append("files", f);
  } else {
    fd.append("file", selectedFiles[0]);
  }

  showLoader(); // ✅ ONLY HERE

  try {
    const url =
      currentTool === "img" ? "/img2pdf" :
      currentTool === "pdf" ? "/pdf2docx" :
      "/docx2pdf";

    const res = await fetch(url, {
      method: "POST",
      body: fd
    });

    if (!res.ok) throw new Error("Conversion failed");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    // show download button
    document.getElementById("downloadBtn").onclick = () => {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "converted_file";
      a.click();
    };

    document.getElementById("downloadBtn").classList.remove("hidden");
    document.getElementById("convertBtn").classList.add("hidden");
    document.getElementById("resetBtn").classList.remove("hidden");

    // preview
    const preview = document.getElementById("preview");
    preview.innerHTML = `<iframe src="${blobUrl}"></iframe>`;
    preview.classList.remove("hidden");

  } catch (e) {
    alert("Conversion failed. Please try again.");
  } finally {
    hideLoader(); // ✅ ALWAYS HIDE
  }
}


function resetAll() {
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  hideLoader();
});
