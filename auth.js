export function getNetpulseUser() {
  const url = new URL(window.location.href);
  const name = url.searchParams.get("name");
  const email = url.searchParams.get("email");
  const photo = url.searchParams.get("photo");

  if (email && name) {
    localStorage.setItem("netpulse_user_email", email);
    localStorage.setItem("netpulse_user_name", name);
    if (photo) localStorage.setItem("netpulse_user_photo", photo);
    window.history.replaceState({}, document.title, location.pathname); // очищає ?name=...
  }

  return {
    name: localStorage.getItem("netpulse_user_name"),
    email: localStorage.getItem("netpulse_user_email"),
    photo: localStorage.getItem("netpulse_user_photo")
  };
}

export function setupLoginButton(buttonId = "loginBtn") {
  const loginBtn = document.getElementById(buttonId);
  const user = getNetpulseUser();

  if (!loginBtn) return;

  if (user?.email) {
    loginBtn.textContent = `👤 ${user.name?.split(" ")[0] || "Користувач"}`;
    loginBtn.className = "btn btn-small profile-button";
    loginBtn.disabled = true;
  } else {
    loginBtn.className = "btn btn-small google-login";
    loginBtn.innerHTML = `
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style="width: 1rem; vertical-align: middle; margin-right: 0.5rem;">
      Увійти через Google
    `;
    loginBtn.addEventListener("click", () => {
      window.location.href = "https://netpulse-server.onrender.com/auth/google";
    });
  }

  return user;
}
