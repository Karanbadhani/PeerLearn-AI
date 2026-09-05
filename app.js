
const tutors = [
  {id:1,name:"Rahul Sharma",initials:"RS",subject:"DSA",skills:["Graphs","Trees","BFS/DFS"],language:"Hindi",rating:4.8,sessions:32,match:94,level:"Beginner Friendly",verified:true},
  {id:2,name:"Priya Kapoor",initials:"PK",subject:"DSA",skills:["Recursion","Graphs","Dynamic Programming"],language:"English",rating:4.9,sessions:28,match:89,level:"Concept First",verified:true},
  {id:3,name:"Arjun Mehta",initials:"AM",subject:"C++",skills:["OOP","C++","DSA"],language:"Hindi",rating:4.7,sessions:21,match:83,level:"Beginner Friendly",verified:true},
  {id:4,name:"Neha Verma",initials:"NV",subject:"Python",skills:["Python","Pandas","ML Basics"],language:"English",rating:4.8,sessions:40,match:87,level:"Practice First",verified:true},
  {id:5,name:"Rohan Joshi",initials:"RJ",subject:"Web Development",skills:["HTML","CSS","JavaScript"],language:"Hindi",rating:4.6,sessions:19,match:81,level:"Project Based",verified:true},
  {id:6,name:"Isha Singh",initials:"IS",subject:"DSA",skills:["Arrays","Linked List","Stacks"],language:"English",rating:4.9,sessions:35,match:86,level:"Visual Learning",verified:true}
];

const progressData = [
  ["Arrays",90],["Linked List",80],["Stacks",72],["Recursion",43],["Trees",55],["Graphs",35]
];

let selectedTutorId = null;

function seedDemo(){
  const users = JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
  if(!users.some(u=>u.email==="demo@peerlearn.ai")){
    users.push({
      name:"Demo Student",
      email:"demo@peerlearn.ai",
      password:"demo123",
      goal:"DSA",
      level:"Beginner",
      teach:"C++"
    });
    localStorage.setItem("peerlearn_users", JSON.stringify(users));
  }
}
seedDemo();

function navigate(route){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target = document.getElementById("page-"+route);
  if(target) target.classList.add("active");
  if(route==="dashboard" && !currentUser()){
    showToast("Please login first.");
    openAuth("login");
    return navigate("home");
  }
  window.scrollTo({top:0,behavior:"smooth"});
  if(route==="discover") renderTutors(tutors);
  if(route==="dashboard") refreshDashboard();
  if(route==="progress") renderProgress();
}

document.querySelectorAll("[data-route]").forEach(btn=>{
  btn.addEventListener("click",()=>navigate(btn.dataset.route));
});

function toggleMobileNav(){
  document.getElementById("mobileNav").classList.toggle("hidden");
}

function openModal(id){ document.getElementById(id).classList.add("show"); }
function closeModal(id){ document.getElementById(id).classList.remove("show"); }

function openAuth(mode="login"){
  openModal("authModal");
  switchAuth(mode);
}
function switchAuth(mode){
  const login = document.getElementById("loginForm");
  const signup = document.getElementById("signupForm");
  const tl = document.getElementById("tabLogin");
  const ts = document.getElementById("tabSignup");
  login.classList.toggle("hidden", mode!=="login");
  signup.classList.toggle("hidden", mode!=="signup");
  tl.classList.toggle("active", mode==="login");
  ts.classList.toggle("active", mode==="signup");
}

function fillDemoLogin(){
  document.getElementById("loginEmail").value="demo@peerlearn.ai";
  document.getElementById("loginPassword").value="demo123";
}

function handleSignup(e){
  e.preventDefault();
  const user = {
    name: document.getElementById("signupName").value.trim(),
    email: document.getElementById("signupEmail").value.trim().toLowerCase(),
    password: document.getElementById("signupPassword").value,
    goal: document.getElementById("signupGoal").value.trim(),
    level: document.getElementById("signupLevel").value,
    teach:""
  };
  let users = JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
  if(users.some(u=>u.email===user.email)){
    showToast("Account already exists. Please login.");
    return;
  }
  users.push(user);
  localStorage.setItem("peerlearn_users", JSON.stringify(users));
  localStorage.setItem("peerlearn_current_user", user.email);
  closeModal("authModal");
  updateAuthUI();
  showToast("Account created successfully!");
  navigate("dashboard");
}

function handleLogin(e){
  e.preventDefault();
  const email=document.getElementById("loginEmail").value.trim().toLowerCase();
  const password=document.getElementById("loginPassword").value;
  const users=JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
  const user=users.find(u=>u.email===email && u.password===password);
  if(!user){
    showToast("Invalid email or password.");
    return;
  }
  localStorage.setItem("peerlearn_current_user", email);
  closeModal("authModal");
  updateAuthUI();
  showToast("Login successful!");
  navigate("dashboard");
}

function logout(){
  localStorage.removeItem("peerlearn_current_user");
  updateAuthUI();
  showToast("Logged out.");
  navigate("home");
}

function currentUser(){
  const email=localStorage.getItem("peerlearn_current_user");
  if(!email) return null;
  const users=JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
  return users.find(u=>u.email===email) || null;
}

function updateAuthUI(){
  const u=currentUser();
  document.getElementById("guestActions").classList.toggle("hidden", !!u);
  document.getElementById("userActions").classList.toggle("hidden", !u);
  if(u){
    document.getElementById("topUserName").textContent=u.name;
    document.getElementById("topUserRole").textContent=(u.verified ? "Verified Tutor" : "Learner");
    document.getElementById("topAvatar").textContent=u.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
  }
}
updateAuthUI();

function runSmartSearch(inputId){
  const q=document.getElementById(inputId).value.trim();
  if(!q){ showToast("Write your learning problem first."); return; }

  const lower=q.toLowerCase();
  let subject = lower.includes("python") ? "Python" : lower.includes("c++") ? "C++" : lower.includes("web") ? "Web Development" : "DSA";
  let lang = lower.includes("hindi") ? "Hindi" : lower.includes("english") ? "English" : "";
  let topic = lower.includes("graph") ? "Graphs" : lower.includes("tree") ? "Trees" : lower.includes("recursion") ? "Recursion" : "General";

  document.getElementById("filterSubject").value=subject;
  document.getElementById("filterLanguage").value=lang;
  navigate("discover");

  setTimeout(()=>{
    document.getElementById("resultTitle").textContent=`AI Match: ${subject} • ${topic}`;
    document.getElementById("resultInfo").textContent=`NLP detected: Subject=${subject}, Topic=${topic}, Language=${lang||"Any"}, Level=Beginner/Intermediate.`;
    applyTutorFilters();
    showToast("AI analyzed your requirement.");
  },100);
}

function renderTutors(list){
  const grid=document.getElementById("tutorGrid");
  if(!grid) return;
  if(!list.length){
    grid.innerHTML=`<div class="empty-state">No tutors match these filters. Try another subject or language.</div>`;
    return;
  }
  grid.innerHTML=list.map(t=>`
    <article class="tutor-card">
      <div class="tutor-top">
        <div class="avatar">${t.initials}</div>
        <div class="tutor-info">
          <strong>${t.name}</strong>
          <span>${t.subject} Peer Tutor • ${t.verified ? "Verified ✅":"Not Verified"}</span>
        </div>
        <div class="match-badge">${t.match}% Match</div>
      </div>
      <div class="tag-row">
        ${t.skills.map(s=>`<span class="tag">${s}</span>`).join("")}
        <span class="tag">${t.language}</span>
        <span class="tag">${t.level}</span>
      </div>
      <div class="tutor-meta">
        <span>⭐ ${t.rating}</span>
        <span>${t.sessions} sessions</span>
      </div>
      <div class="tutor-actions">
        <button class="btn ghost full" onclick="viewTutor(${t.id})">View Profile</button>
        <button class="btn primary full" onclick="bookTutorById(${t.id})">Book Session</button>
      </div>
    </article>`).join("");
}

function applyTutorFilters(){
  const subject=document.getElementById("filterSubject").value;
  const language=document.getElementById("filterLanguage").value;
  const rating=parseFloat(document.getElementById("filterRating").value || "0");
  let list=tutors.filter(t=>(!subject||t.subject===subject)&&(!language||t.language===language)&&t.rating>=rating);
  renderTutors(list.sort((a,b)=>b.match-a.match));
}

function resetFilters(){
  document.getElementById("filterSubject").value="";
  document.getElementById("filterLanguage").value="";
  document.getElementById("filterRating").value="0";
  document.getElementById("resultTitle").textContent="Recommended Peer Tutors";
  document.getElementById("resultInfo").textContent="Ranked using skill fit, rating, availability and teaching suitability.";
  renderTutors(tutors);
}

function viewTutor(id){
  const t=tutors.find(x=>x.id===id);
  showToast(`${t.name}: ${t.subject}, ${t.skills.join(", ")}, ${t.rating}★, ${t.match}% match`);
}

function bookTutorById(id){
  if(!currentUser()){
    showToast("Login first to book a session.");
    openAuth("login");
    return;
  }
  selectedTutorId=id;
  const t=tutors.find(x=>x.id===id);
  document.getElementById("bookingTutorSummary").innerHTML=`
    <div class="eyebrow">BOOK PEER SESSION</div>
    <h2>${t.name}</h2>
    <p>${t.subject} • ${t.skills.join(", ")} • ${t.rating}★ • ${t.match}% match</p>`;
  const date=document.getElementById("bookingDate");
  const tomorrow=new Date(Date.now()+86400000);
  date.min=new Date().toISOString().split("T")[0];
  date.value=tomorrow.toISOString().split("T")[0];
  openModal("bookingModal");
}

function confirmBooking(e){
  e.preventDefault();
  const u=currentUser(); if(!u) return;
  const t=tutors.find(x=>x.id===selectedTutorId);
  const booking={
    id:Date.now(),
    user:u.email,
    tutorId:t.id,
    tutorName:t.name,
    date:document.getElementById("bookingDate").value,
    time:document.getElementById("bookingTime").value,
    type:document.getElementById("bookingType").value,
    doubt:document.getElementById("bookingDoubt").value.trim()
  };
  const bookings=JSON.parse(localStorage.getItem("peerlearn_bookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("peerlearn_bookings", JSON.stringify(bookings));
  closeModal("bookingModal");
  showToast("Session booked successfully!");
  refreshDashboard();
  navigate("dashboard");
}

function refreshDashboard(){
  const u=currentUser(); if(!u) return;
  document.getElementById("dashName").textContent=u.name;
  document.getElementById("dashGoal").textContent=u.goal || "Not set";
  document.getElementById("dashLevel").textContent=u.level || "Beginner";
  document.getElementById("tutorStatus").textContent=u.verified ? "Verified ✅" : "Not Verified";
  const bookings=JSON.parse(localStorage.getItem("peerlearn_bookings") || "[]").filter(b=>b.user===u.email);
  document.getElementById("bookingCount").textContent=bookings.length;
  const list=document.getElementById("bookingList");
  list.innerHTML=bookings.length ? bookings.slice().reverse().map(b=>`
    <div class="booking-item">
      <div><strong>${b.tutorName}</strong><span>${b.type}${b.doubt?` • ${b.doubt}`:""}</span></div>
      <div><strong>${b.date}</strong><span>${b.time}</span></div>
    </div>`).join("") : `<div class="empty-state">No sessions booked yet.</div>`;
}

function openVerification(){
  if(!currentUser()){ openAuth("login"); return; }
  document.getElementById("verifyResult").innerHTML="";
  openModal("verifyModal");
}

function submitVerification(e){
  e.preventDefault();
  let score=0;
  ["q1","q2","q3"].forEach(id=>{ if(document.getElementById(id).value==="1") score++; });
  const result=document.getElementById("verifyResult");
  if(score>=2){
    const u=currentUser();
    let users=JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
    users=users.map(x=>x.email===u.email ? {...x,verified:true}:x);
    localStorage.setItem("peerlearn_users", JSON.stringify(users));
    result.innerHTML=`<div class="result-pass">✅ Score: ${score}/3. Verified Peer Tutor badge unlocked.</div>`;
    updateAuthUI(); refreshDashboard();
  }else{
    result.innerHTML=`<div class="result-fail">Score: ${score}/3. You need at least 2 correct answers. Try again.</div>`;
  }
}

function openProfileEditor(){
  const u=currentUser(); if(!u) return;
  document.getElementById("profileName").value=u.name || "";
  document.getElementById("profileGoal").value=u.goal || "";
  document.getElementById("profileLevel").value=u.level || "Beginner";
  document.getElementById("profileTeach").value=u.teach || "";
  openModal("profileModal");
}

function saveProfile(e){
  e.preventDefault();
  const u=currentUser();
  let users=JSON.parse(localStorage.getItem("peerlearn_users") || "[]");
  users=users.map(x=>x.email===u.email ? {
    ...x,
    name:document.getElementById("profileName").value.trim(),
    goal:document.getElementById("profileGoal").value.trim(),
    level:document.getElementById("profileLevel").value,
    teach:document.getElementById("profileTeach").value.trim()
  }:x);
  localStorage.setItem("peerlearn_users", JSON.stringify(users));
  closeModal("profileModal");
  updateAuthUI(); refreshDashboard();
  showToast("Profile updated.");
}

function renderProgress(){
  const wrap=document.getElementById("skillProgress");
  wrap.innerHTML=progressData.map(([name,val])=>`
    <div class="skill-row">
      <div class="skill-label"><span>${name}</span><strong>${val}%</strong></div>
      <div class="bar"><div class="fill" style="width:${val}%"></div></div>
    </div>`).join("");
}

function openAIWithPrompt(prompt){
  navigate("ai");
  setTimeout(()=>{
    document.getElementById("aiInput").value=prompt;
  },100);
}

function setAIPrompt(prompt){
  document.getElementById("aiInput").value=prompt;
}

function sendAIMessage(){
  const input=document.getElementById("aiInput");
  const text=input.value.trim(); if(!text) return;
  const body=document.getElementById("chatBody");
  body.innerHTML+=`<div class="message user"><div class="bubble">${escapeHtml(text)}</div></div>`;
  const reply=demoAIReply(text);
  setTimeout(()=>{
    body.innerHTML+=`<div class="message bot"><div class="bubble">${reply}</div></div>`;
    body.scrollTop=body.scrollHeight;
  },350);
  input.value="";
  body.scrollTop=body.scrollHeight;
}

function demoAIReply(text){
  const q=text.toLowerCase();
  if(q.includes("recursion")) return `<strong>Recursion</strong> means a function calls itself to solve a smaller version of the same problem.<br><br>Example: factorial(5) = 5 × factorial(4).<br><br><strong>Key idea:</strong> always have a base case, otherwise the function keeps calling itself.`;
  if(q.includes("quiz") || q.includes("mcq")) return `<strong>Quick Quiz</strong><br>1. Which data structure does BFS use?<br>2. What is the difference between BFS and DFS?<br>3. Why do we maintain a visited array?<br>4. When is BFS useful for shortest paths?<br>5. What is the time complexity of graph traversal?`;
  if(q.includes("study plan") || q.includes("7-day")) return `<strong>7-Day DSA Plan</strong><br>Day 1: Arrays & Strings<br>Day 2: Linked List<br>Day 3: Stack & Queue<br>Day 4: Recursion<br>Day 5: Trees<br>Day 6: Graphs<br>Day 7: Practice + Revision`;
  if(q.includes("summary")) return `<strong>Session Summary</strong><br>You covered BFS, DFS and Graph Traversal.<br><br><strong>Strong:</strong> BFS queue logic<br><strong>Needs improvement:</strong> visited-array handling<br><strong>Next step:</strong> solve 3 traversal questions, then take a short quiz.`;
  if(q.includes("bfs")) return `<strong>BFS in simple words:</strong><br>BFS explores a graph level by level. It uses a Queue. Start from one node, visit it, add its unvisited neighbours to the queue, then continue until the queue is empty.`;
  return `I understood your request. In the real version, an LLM API would generate a personalized answer using your current level, learning history and weak topics. For this prototype, I can simulate explanations, quizzes, study plans and session summaries.`;
}

function clearChat(){
  document.getElementById("chatBody").innerHTML=`<div class="message bot"><div class="bubble">Hi! Tell me what you are struggling with. I can explain a concept, create a quiz, make a study plan or summarize a learning session.</div></div>`;
}

function escapeHtml(s){ return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

function showToast(msg){
  const t=document.getElementById("toast");
  t.textContent=msg; t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove("show"),2500);
}

document.querySelectorAll(".modal").forEach(m=>{
  m.addEventListener("click",e=>{ if(e.target===m) m.classList.remove("show"); });
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") document.querySelectorAll(".modal.show").forEach(m=>m.classList.remove("show"));
});

renderTutors(tutors);
renderProgress();
