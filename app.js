const SUPABASE_URL = "PLAK_JOU_SUPABASE_URL_HIER";
const SUPABASE_ANON_KEY = "PLAK_JOU_ANON_KEY_HIER";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Login fout: " + error.message);
    return;
  }

  loadApp();
}

async function logout() {
  await client.auth.signOut();
  location.reload();
}

async function loadApp() {
  const { data: sessionData } = await client.auth.getSession();

  if (!sessionData.session) return;

  document.getElementById("loginBox").hidden = true;
  document.getElementById("logoutBtn").hidden = false;

  loadModules();
}

async function loadModules() {
  const { data, error } = await client
    .from("modules")
    .select("*")
    .order("id");

  const box = document.getElementById("modules");
  box.innerHTML = "<h2>Jou Modules</h2>";

  if (error) {
    box.innerHTML += "<p>Kon nie modules laai nie.</p>";
    return;
  }

  data.forEach(module => {
    box.innerHTML += `
      <div class="card">
        <h3>${module.title}</h3>
        <p>${module.description || ""}</p>
        <button onclick="loadWeeks(${module.id}, '${module.title}')">Maak oop</button>
      </div>
    `;
  });
}

async function loadWeeks(moduleId, moduleTitle) {
  const { data, error } = await client
    .from("weeks")
    .select("*")
    .eq("module_id", moduleId)
    .order("id");

  const box = document.getElementById("weeks");
  box.innerHTML = `<h2>${moduleTitle}</h2>`;

  if (error) {
    box.innerHTML += "<p>Kon nie weeks laai nie.</p>";
    return;
  }

  data.forEach(week => {
    box.innerHTML += `
      <div class="card">
        <h3>${week.title}</h3>
        <p>${week.content}</p>
      </div>
    `;
  });
}

loadApp();
