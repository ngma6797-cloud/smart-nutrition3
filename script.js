// الترحيب الصوتي
const enterBtn = document.getElementById("enterBtn");
const darkBtn = document.getElementById("darkModeBtn");

enterBtn.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  if(!name){ alert("من فضلك اكتب اسمك بالكامل"); return; }
  const text = `الدكتورة آيه أحمد نجم ترحب بكم ${name} وتهنئكم بالسنة الجديدة، استمتعوا!`;
  speak(text);
  document.getElementById("welcome").classList.remove("active");
  document.getElementById("nav").classList.remove("hidden");
  goTo("goal");
});

// Dark Mode Toggle
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Text-to-Speech
function speak(text){
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "ar-SA";
  msg.rate = 0.9;
  window.speechSynthesis.speak(msg);
}

// SPA Navigation
function goTo(id){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// الهدف
let goal = "cut";
function setGoal(g){
  goal = g;
  goTo("data");
}

// وجبات متنوعة لكل يوم
const mealOptions = {
  cut: [
    ["بيض + شوفان","فراخ + رز","زبادي + فاكهة"],
    ["توست + بيض","سمك + خضار","فاكهة + مكسرات"],
    ["عصير + شوفان","دجاج + بطاطس","زبادي + فواكه"],
    ["بيض مسلوق + خيار","سمك + ارز بني","فاكهة + مكسرات"],
    ["فول + بيض","لحم + خضار","زبادي + فواكه"],
    ["عصير طبيعي + توست","دجاج + خضار","فاكهة + مكسرات"],
    ["شوفان + فواكه","سمك + ارز","زبادي + مكسرات"]
  ],
  bulk: [
    ["بيض + شوفان + موز","لحمة + مكرونة","مكسرات + عشاء خفيف"],
    ["عصير + توست","دجاج + رز","زبادي + فاكهة"],
    ["بيض + خبز + جبن","سمك + بطاطس","فاكهة + مكسرات"],
    ["توست + بيض + فواكه","لحم + خضار + رز","زبادي + فواكه"],
    ["شوفان + حليب + موز","دجاج + مكرونة","مكسرات + فاكهة"],
    ["بيض + توست","سمك + ارز","زبادي + مكسرات"],
    ["فول + بيض + توست","لحم + خضار + بطاطس","فاكهة + مكسرات"]
  ]
};

// إنشاء النظام الغذائي الذكي
function buildPlan(){
  const w = +weight.value;
  const h = +height.value;
  const a = +age.value;
  const act = +activity.value;

  if(!w||!h||!a){ alert("أدخل كل البيانات"); return; }

  let diseases = {
    diabetes: document.getElementById("diabetes").checked,
    pressure: document.getElementById("pressure").checked,
    heart: document.getElementById("heart").checked,
    digest: document.getElementById("digest").checked,
    allergy: document.getElementById("allergy").checked
  };

  let meds = document.querySelector('input[name="meds"]:checked').value;

  // حساب السعرات
  let bmr = 10*w + 6.25*h - 5*a + 5;
  let calories = Math.round(bmr * act);
  calories += goal==="cut"? -500: 500;
  if(diseases.diabetes) calories -= 50;
  if(diseases.pressure) calories -= 30;
  if(diseases.heart) calories -= 20;
  if(diseases.digest) calories -= 50;

  document.getElementById("calories").innerText = calories + " kcal";

  // النظام اليومي بالتاريخ
  const startDate = new Date();
  let mealsHTML = "";
  for(let i=0;i<7;i++){
    const day = new Date(startDate);
    day.setDate(startDate.getDate()+i);
    const dateStr = day.toLocaleDateString("ar-EG", { weekday:'long', day:'numeric', month:'long' });
    mealsHTML += `<h4>اليوم ${i+1} - ${dateStr}</h4>`;
    const dayMeals = mealOptions[goal][i];
    mealsHTML += `08:00 فطار: ${dayMeals[0]}<br>`;
    mealsHTML += `13:00 غداء: ${dayMeals[1]}<br>`;
    mealsHTML += `19:00 عشاء: ${dayMeals[2]}<br>`;
    if(diseases.diabetes) mealsHTML += "<i>ملاحظة: قلل الكربوهيدرات البسيطة</i><br>";
    if(diseases.pressure) mealsHTML += "<i>ملاحظة: قلل الملح</i><br>";
    mealsHTML += "<hr>";
  }
  document.getElementById("meals").innerHTML = mealsHTML;

  // البدائل الذكية
  document.getElementById("alts").innerHTML = "فراخ ↔ سمك<br>رز ↔ بطاطس<br>شوفان ↔ عيش أسمر";

  goTo("plan");

  // حفظ البيانات LocalStorage
  const userData = {goal,w,h,a,act,diseases,meds,calories};
  localStorage.setItem("smartNutritionUser", JSON.stringify(userData));
}
