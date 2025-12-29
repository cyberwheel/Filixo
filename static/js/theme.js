const btn = document.createElement("button");
btn.innerText = "🌗";
document.body.appendChild(btn);
btn.onclick = () => document.body.classList.toggle("dark");
