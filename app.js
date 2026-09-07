const tutors = [
  {id:1,name:"Rahul Sharma",initials:"RS",subject:"DSA",skills:["Graphs","Trees","BFS/DFS"],language:"Hindi",rating:4.8,sessions:32,match:94,style:"Beginner Friendly",verified:true,price:49,bio:"I simplify DSA using visual examples and step-by-step problem solving.",availability:"Today 6 PM",proficiency:92},
  {id:2,name:"Priya Kapoor",initials:"PK",subject:"DSA",skills:["Recursion","Graphs","Dynamic Programming"],language:"English",rating:4.9,sessions:28,match:89,style:"Concept First",verified:true,price:59,bio:"Strong focus on concepts first, then practice.",availability:"Tomorrow 5 PM",proficiency:95},
  {id:3,name:"Arjun Mehta",initials:"AM",subject:"C++",skills:["OOP","C++","DSA"],language:"Hindi",rating:4.7,sessions:21,match:83,style:"Beginner Friendly",verified:true,price:39,bio:"I teach C++ from basics with mini-project examples.",availability:"Today 7 PM",proficiency:89},
  {id:4,name:"Neha Verma",initials:"NV",subject:"Python",skills:["Python","Pandas","ML Basics"],language:"English",rating:4.8,sessions:40,match:87,style:"Practice First",verified:true,price:69,bio:"Hands-on Python learning with real datasets and coding exercises.",availability:"Tomorrow 6 PM",proficiency:93},
  {id:5,name:"Rohan Joshi",initials:"RJ",subject:"Web Development",skills:["HTML","CSS","JavaScript"],language:"Hindi",rating:4.6,sessions:19,match:81,style:"Project Based",verified:true,price:49,bio:"Build while learning. Every session ends with something practical.",availability:"Sat 4 PM",proficiency:86},
  {id:6,name:"Isha Singh",initials:"IS",subject:"DSA",skills:["Arrays","Linked List","Stacks"],language:"English",rating:4.9,sessions:35,match:86,style:"Visual Learning",verified:true,price:55,bio:"I use diagrams and visual analogies for core DSA topics.",availability:"Today 5 PM",proficiency:94}
];
const progressData=[["Arrays",90],["Linked List",80],["Stacks",72],["Recursion",43],["Trees",55],["Graphs",35]];
let selectedTutorId=null, currentRating=0, selectedReviewBooking=null, sessionTab="upcoming";

function seedDemo(){
  let users=JSON.parse(localStorage.getItem("edunexa_users")||"[]");
  if(!users.some(u=>u.email==="demo@edunexa.ai")){
    users.push({name:"Demo Student",email:"demo@edunexa.ai",password:"demo123",goal:"DSA",level:"Beginner",teach:"C++",verified:false});
    localStorage.setItem("edunexa_users",JSON.stringify(users));
  }
  if(!localStorage.getItem("edunexa_notifications")){
    localStorage.setItem("edunexa_notifications",JSON.stringify([
      {title:"Welcome to EDUNEXA",text:"Complete your learning profile for better AI matches."},
      {title:"AI Insight",text:"Graphs is currently your weakest DSA topic."},
      {title:"Verification",text:"You can unlock a verified tutor badge through the DSA test."}
    ]));
  }
}
seedDemo();

function navigate(route){
  if(route==="dashboard"&&!currentUser()){showToast("Please login first.");openAuth("login");return}
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target=document.getElementById("page-"+route);if(target)target.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
  if(route==="discover")renderTutors(tutors);
  if(route==="dashboard")refreshDashboard();
  if(route==="progress")renderProgress();
  if(route==="sessions")renderSessionsPage();
}
document.querySelectorAll("[data-route]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.route)));

function toggleMobileNav(){document.getElementById("mobileNav").classList.toggle("hidden")}
function openModal(id){document.getElementById(id).classList.add("show")}
function closeModal(id){document.getElementById(id).classList.remove("show")}
function openAuth(mode="login"){openModal("authModal");switchAuth(mode)}
function switchAuth(mode){
  document.getElementById("loginForm").classList.toggle("hidden",mode!=="login");
  document.getElementById("signupForm").classList.toggle("hidden",mode!=="signup");
  document.getElementById("tabLogin").classList.toggle("active",mode==="login");
  document.getElementById("tabSignup").classList.toggle("active",mode==="signup");
}
function fillDemoLogin(){document.getElementById("loginEmail").value="demo@edunexa.ai";document.getElementById("loginPassword").value="demo123"}
function fillHero(q){document.getElementById("heroNeed").value=q}

function users(){return JSON.parse(localStorage.getItem("edunexa_users")||"[]")}
function currentUser(){
  const email=localStorage.getItem("edunexa_current_user");if(!email)return null;
  return users().find(u=>u.email===email)||null;
}
function handleSignup(e){
  e.preventDefault();
  const user={name:signupName.value.trim(),email:signupEmail.value.trim().toLowerCase(),password:signupPassword.value,goal:signupGoal.value.trim(),level:signupLevel.value,teach:"",verified:false};
  let arr=users();
  if(arr.some(u=>u.email===user.email)){showToast("Account already exists.");return}
  arr.push(user);localStorage.setItem("edunexa_users",JSON.stringify(arr));localStorage.setItem("edunexa_current_user",user.email);
  closeModal("authModal");updateAuthUI();showToast("Account created successfully!");navigate("dashboard");
}
function handleLogin(e){
  e.preventDefault();const email=loginEmail.value.trim().toLowerCase(),password=loginPassword.value;
  const u=users().find(x=>x.email===email&&x.password===password);
  if(!u){showToast("Invalid email or password.");return}
  localStorage.setItem("edunexa_current_user",email);closeModal("authModal");updateAuthUI();showToast("Login successful!");navigate("dashboard");
}
function logout(){localStorage.removeItem("edunexa_current_user");updateAuthUI();showToast("Logged out.");navigate("home")}
function updateAuthUI(){
  const u=currentUser();guestActions.classList.toggle("hidden",!!u);userActions.classList.toggle("hidden",!u);
  if(u){topUserName.textContent=u.name;topUserRole.textContent=u.verified?"Verified Tutor":"Learner";topAvatar.textContent=u.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
}
updateAuthUI();

function runSmartSearch(id){
  const q=document.getElementById(id).value.trim();if(!q){showToast("Write your learning problem first.");return}
  const l=q.toLowerCase();
  let subject=l.includes("python")?"Python":l.includes("c++")||l.includes("oop")?"C++":l.includes("web")?"Web Development":"DSA";
  let lang=l.includes("hindi")?"Hindi":l.includes("english")?"English":"";
  let topic=l.includes("graph")?"Graphs":l.includes("tree")?"Trees":l.includes("recursion")?"Recursion":l.includes("function")?"Functions":"General";
  navigate("discover");
  setTimeout(()=>{
    filterSubject.value=subject;filterLanguage.value=lang;
    resultTitle.textContent=`AI Match: ${subject} • ${topic}`;
    resultInfo.textContent=`NLP detected: subject=${subject}, topic=${topic}, language=${lang||"Any"}, level=Beginner/Intermediate.`;
    applyTutorFilters();showToast("EDUNEXA analyzed your requirement.");
  },80)
}
function renderTutors(list){
  tutorGrid.innerHTML=list.length?list.map(t=>`
    <article class="tutor-card">
      <div class="tutor-top">
        <div class="avatar">${t.initials}</div>
        <div class="tutor-info"><strong>${t.name}</strong><span>${t.subject} Peer Tutor • ${t.verified?"Verified ✅":"Not Verified"}</span></div>
        <div class="match-badge">${t.match}% Match</div>
      </div>
      <div class="tag-row">${t.skills.map(s=>`<span class="tag">${s}</span>`).join("")}<span class="tag">${t.language}</span><span class="tag">${t.style}</span></div>
      <div class="tutor-meta"><span>⭐ ${t.rating} • ${t.sessions} sessions</span><span>₹${t.price}/session</span></div>
      <div class="tutor-actions">
        <button class="btn ghost full" onclick="viewTutor(${t.id})">View Profile</button>
        <button class="btn primary full" onclick="bookTutorById(${t.id})">Book Session</button>
        <button class="save-btn ${isSaved(t.id)?"saved":""}" onclick="toggleSaved(${t.id},this)">♥</button>
      </div>
    </article>`).join(""):`<div class="empty-state">No peers match these filters. Try a different subject, language or style.</div>`;
}
function applyTutorFilters(){
  const s=filterSubject.value,l=filterLanguage.value,r=parseFloat(filterRating.value||"0"),st=filterStyle.value;
  renderTutors(tutors.filter(t=>(!s||t.subject===s)&&(!l||t.language===l)&&t.rating>=r&&(!st||t.style===st)).sort((a,b)=>b.match-a.match));
}
function resetFilters(){filterSubject.value="";filterLanguage.value="";filterRating.value="0";filterStyle.value="";resultTitle.textContent="Recommended Peer Tutors";resultInfo.textContent="Ranked using skill fit, learner level, proficiency, rating and availability.";renderTutors(tutors)}

function savedIds(){return JSON.parse(localStorage.getItem("edunexa_saved")||"[]")}
function isSaved(id){return savedIds().includes(id)}
function toggleSaved(id,btn){
  let s=savedIds();s=s.includes(id)?s.filter(x=>x!==id):[...s,id];localStorage.setItem("edunexa_saved",JSON.stringify(s));
  btn?.classList.toggle("saved",s.includes(id));showToast(s.includes(id)?"Peer saved.":"Removed from saved peers.");refreshDashboard();
}

function viewTutor(id){
  const t=tutors.find(x=>x.id===id);
  tutorProfileContent.innerHTML=`
    <div class="tutor-profile-head">
      <div class="avatar">${t.initials}</div>
      <div><div class="eyebrow">${t.verified?"VERIFIED PEER TUTOR":"PEER TUTOR"}</div><h2>${t.name}</h2><p>${t.bio}</p></div>
      <div class="match-badge">${t.match}% Match</div>
    </div>
    <div class="profile-stats">
      <div class="profile-stat"><strong>${t.rating}★</strong><span>Rating</span></div>
      <div class="profile-stat"><strong>${t.proficiency}%</strong><span>Proficiency</span></div>
      <div class="profile-stat"><strong>${t.sessions}</strong><span>Sessions</span></div>
      <div class="profile-stat"><strong>₹${t.price}</strong><span>Per Session</span></div>
    </div>
    <div class="tag-row">${t.skills.map(s=>`<span class="tag">${s}</span>`).join("")}<span class="tag">${t.language}</span><span class="tag">${t.style}</span></div>
    <div class="why-match"><strong>Why EDUNEXA matched you</strong><ul><li>Strong topic fit for your current learning gap</li><li>${t.style} teaching style matches your profile</li><li>${t.availability} availability</li></ul></div>
    <h3>Recent Reviews</h3>
    <div class="review-list">
      <div class="review-item"><strong>“Explained Graphs very clearly.”</strong><small>5★ • Student review</small></div>
      <div class="review-item"><strong>“Good examples and patient teaching.”</strong><small>4.8★ • Student review</small></div>
    </div>
    <div class="button-row" style="margin-top:16px"><button class="btn primary" onclick="closeModal('tutorModal');bookTutorById(${t.id})">Book Session</button><button class="btn ghost" onclick="toggleSaved(${t.id});closeModal('tutorModal')">${isSaved(t.id)?"Remove Saved":"Save Peer"}</button></div>`;
  openModal("tutorModal");
}
function bookTutorById(id){
  if(!currentUser()){showToast("Login first to book a session.");openAuth("login");return}
  selectedTutorId=id;const t=tutors.find(x=>x.id===id);
  bookingTutorSummary.innerHTML=`<div class="eyebrow">BOOK PEER SESSION</div><h2>${t.name}</h2><p>${t.subject} • ${t.skills.join(", ")} • ${t.rating}★ • ${t.match}% match</p>`;
  const tomorrow=new Date(Date.now()+86400000);bookingDate.min=new Date().toISOString().split("T")[0];bookingDate.value=tomorrow.toISOString().split("T")[0];openModal("bookingModal");
}
function bookings(){return JSON.parse(localStorage.getItem("edunexa_bookings")||"[]")}
function confirmBooking(e){
  e.preventDefault();const u=currentUser(),t=tutors.find(x=>x.id===selectedTutorId);
  const b={id:Date.now(),user:u.email,tutorId:t.id,tutorName:t.name,subject:t.subject,date:bookingDate.value,time:bookingTime.value,type:bookingType.value,doubt:bookingDoubt.value.trim(),status:"upcoming"};
  const arr=bookings();arr.push(b);localStorage.setItem("edunexa_bookings",JSON.stringify(arr));closeModal("bookingModal");pushNotification("Session booked",`${t.name} • ${b.date} • ${b.time}`);showToast("Session booked successfully!");navigate("dashboard");
}
function refreshDashboard(){
  const u=currentUser();if(!u)return;
  dashName.textContent=u.name;dashGoal.textContent=u.goal||"Not set";dashLevel.textContent=u.level||"Beginner";tutorStatus.textContent=u.verified?"Verified ✅":"Not Verified";
  const arr=bookings().filter(b=>b.user===u.email&&b.status==="upcoming");bookingCount.textContent=arr.length;
  bookingList.innerHTML=arr.length?arr.slice().reverse().map(b=>`
    <div class="booking-item"><div><strong>${b.tutorName}</strong><span>${b.subject} • ${b.type}${b.doubt?` • ${b.doubt}`:""}</span></div><div><strong>${b.date}</strong><span>${b.time}</span></div><div class="booking-actions"><button class="btn primary small" onclick="joinRoom(${b.id})">Join</button><button class="btn ghost small" onclick="cancelBooking(${b.id})">Cancel</button></div></div>`).join(""):`<div class="empty-state">No sessions booked yet. Find a peer to start learning.</div>`;
  const saved=savedIds().map(id=>tutors.find(t=>t.id===id)).filter(Boolean);
  savedTutorList.innerHTML=saved.length?saved.map(t=>`<div class="saved-item"><div class="avatar sm">${t.initials}</div><div><strong>${t.name}</strong><small>${t.subject} • ${t.match}% match</small></div><button class="link-btn" onclick="viewTutor(${t.id})">View</button></div>`).join(""):`<div class="empty-state">Save peers from Discover to see them here.</div>`;
}
function cancelBooking(id){let arr=bookings().filter(b=>b.id!==id);localStorage.setItem("edunexa_bookings",JSON.stringify(arr));showToast("Session cancelled.");refreshDashboard();renderSessionsPage()}
function joinRoom(id){const b=bookings().find(x=>x.id===id);if(!b)return;selectedReviewBooking=id;roomTitle.textContent=`${b.subject} with ${b.tutorName}`;openModal("roomModal")}
function toggleRoomTool(btn,on,off){btn.textContent=btn.textContent.trim()===on?off:on}
function endDemoSession(){
  closeModal("roomModal");let arr=bookings().map(b=>b.id===selectedReviewBooking?{...b,status:"completed"}:b);localStorage.setItem("edunexa_bookings",JSON.stringify(arr));openModal("reviewModal");renderSessionsPage();refreshDashboard()
}
function setSessionTab(tab,btn){sessionTab=tab;document.querySelectorAll(".session-tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderSessionsPage()}
function renderSessionsPage(){
  const u=currentUser();if(!u){sessionsPageList.innerHTML=`<div class="empty-state">Login to view your sessions.</div>`;return}
  const arr=bookings().filter(b=>b.user===u.email&&b.status===sessionTab);
  sessionsPageList.innerHTML=arr.length?arr.map(b=>`
    <div class="session-card"><div class="session-icon">${b.status==="completed"?"✓":"📚"}</div><div><strong>${b.subject} with ${b.tutorName}</strong><small>${b.date} • ${b.time} • ${b.type}</small></div><div class="session-actions">${b.status==="upcoming"?`<button class="btn primary small" onclick="joinRoom(${b.id})">Join Room</button><button class="btn ghost small" onclick="cancelBooking(${b.id})">Cancel</button>`:`<button class="btn ghost small" onclick="openReview(${b.id})">Rate Session</button>`}</div></div>`).join(""):`<div class="empty-state">No ${sessionTab} sessions yet.</div>`;
}
function openReview(id){selectedReviewBooking=id;currentRating=0;setRating(0);reviewText.value="";openModal("reviewModal")}
function setRating(n){currentRating=n;document.querySelectorAll("#ratingStars button").forEach((b,i)=>b.classList.toggle("active",i<n))}
function submitReview(){if(!currentRating){showToast("Select a rating first.");return}closeModal("reviewModal");pushNotification("Thanks for your feedback",`${currentRating}★ rating saved and will improve future matching.`);showToast("Feedback submitted!");currentRating=0}

function openVerification(){if(!currentUser()){openAuth("login");return}verifyResult.innerHTML="";openModal("verifyModal")}
function submitVerification(e){
  e.preventDefault();let score=0;["q1","q2","q3"].forEach(id=>{if(document.getElementById(id).value==="1")score++});
  if(score>=2){const u=currentUser();let arr=users().map(x=>x.email===u.email?{...x,verified:true}:x);localStorage.setItem("edunexa_users",JSON.stringify(arr));verifyResult.innerHTML=`<div class="result-pass">✅ Score ${score}/3. Verified Peer Tutor badge unlocked.</div>`;pushNotification("Tutor verification unlocked","You are now a verified EDUNEXA peer tutor.");updateAuthUI();refreshDashboard()}
  else verifyResult.innerHTML=`<div class="result-fail">Score ${score}/3. You need at least 2 correct answers. Try again.</div>`
}
function openProfileEditor(){const u=currentUser();profileName.value=u.name||"";profileGoal.value=u.goal||"";profileLevel.value=u.level||"Beginner";profileTeach.value=u.teach||"";openModal("profileModal")}
function saveProfile(e){
  e.preventDefault();const u=currentUser();let arr=users().map(x=>x.email===u.email?{...x,name:profileName.value.trim(),goal:profileGoal.value.trim(),level:profileLevel.value,teach:profileTeach.value.trim()}:x);
  localStorage.setItem("edunexa_users",JSON.stringify(arr));closeModal("profileModal");updateAuthUI();refreshDashboard();showToast("Profile updated.")
}

function renderProgress(){skillProgress.innerHTML=progressData.map(([n,v])=>`<div class="skill-row"><div class="skill-label"><span>${n}</span><strong>${v}%</strong></div><div class="bar"><div class="fill" style="width:${v}%"></div></div></div>`).join("")}
function openAIWithPrompt(p){navigate("ai");setTimeout(()=>aiInput.value=p,80)}
function setAIPrompt(p){aiInput.value=p}
function sendAIMessage(){
  const text=aiInput.value.trim();if(!text)return;chatBody.innerHTML+=`<div class="message user"><div class="bubble">${escapeHtml(text)}</div></div>`;aiInput.value="";
  setTimeout(()=>{chatBody.innerHTML+=`<div class="message bot"><div class="bubble">${demoAIReply(text)}</div></div>`;chatBody.scrollTop=chatBody.scrollHeight},320)
}
function demoAIReply(text){
  const q=text.toLowerCase();
  if(q.includes("recursion"))return `<strong>Recursion</strong> means a function calls itself to solve a smaller version of the same problem.<br><br><strong>Example:</strong> factorial(5)=5×factorial(4).<br><br><strong>Remember:</strong> every recursive function needs a base case.`;
  if(q.includes("quiz")||q.includes("mcq"))return `<strong>Quick Quiz</strong><br>1. Which data structure does BFS use?<br>2. Why do we use a visited array?<br>3. Difference between BFS and DFS?<br>4. When is BFS useful for shortest path?<br>5. Time complexity of graph traversal?`;
  if(q.includes("study plan")||q.includes("7-day"))return `<strong>7-Day DSA Plan</strong><br>Day 1: Arrays & Strings<br>Day 2: Linked List<br>Day 3: Stack & Queue<br>Day 4: Recursion<br>Day 5: Trees<br>Day 6: Graphs<br>Day 7: Practice + Revision`;
  if(q.includes("summary"))return `<strong>Session Summary</strong><br>You covered BFS, DFS and Graph Traversal.<br><br><strong>Strong:</strong> BFS queue logic<br><strong>Needs improvement:</strong> visited-array handling<br><strong>Next step:</strong> solve 3 traversal questions, then take a short quiz.`;
  if(q.includes("bfs"))return `<strong>BFS in simple words:</strong><br>BFS explores a graph level by level. It uses a Queue. Start from one node, visit it, add its unvisited neighbours to the queue, then continue until the queue is empty.`;
  return `I understood your request. In the real version, the LLM will use your learning level, session history and weak topics to generate a personalized response.`;
}
function clearChat(){chatBody.innerHTML=`<div class="message bot"><div class="bubble">Hi! Tell me what you are struggling with. I can explain a concept, create a quiz, make a study plan or summarize a learning session.</div></div>`}

function pushNotification(title,text){const arr=JSON.parse(localStorage.getItem("edunexa_notifications")||"[]");arr.unshift({title,text});localStorage.setItem("edunexa_notifications",JSON.stringify(arr));notifDot.classList.remove("hidden")}
function openNotifications(){
  const arr=JSON.parse(localStorage.getItem("edunexa_notifications")||"[]");
  notificationList.innerHTML=arr.length?arr.map(n=>`<div class="notification-item"><strong>${n.title}</strong><span>${n.text}</span></div>`).join(""):`<div class="empty-state">No notifications.</div>`;
  notifDot.classList.add("hidden");openModal("notificationsModal")
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>toast.classList.remove("show"),2400)}

document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".modal.show").forEach(m=>m.classList.remove("show"))});
renderTutors(tutors);renderProgress();updateAuthUI();