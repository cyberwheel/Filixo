console.log("Admin dashboard loaded");

document.querySelectorAll(".block-btn").forEach(btn => {
  btn.onclick = () => {
    alert("User blocked (demo)");
  };
});
