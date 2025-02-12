// このスクリプトは、DevToolで即実行可能なコンパクトなモーダルフォームを生成し、
// ユーザーに各種入力値（studentId, bookId, unit, classId, markAllLessons, 自動スコア設定, スコア, 経過時間, レッスン番号）を入力させます。
// 入力値はlocalStorageに保存され、classIdはAPI URLに反映され、autoScoreが"y"の場合はAPIからJSONデータを取得して自動でスコアを決定します。

// 現在の日時を "YYYY-MM-DD HH:mm:ss±HHMM" 形式で返す関数
function getCurrentTimezone() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const offsetMinutes = now.getTimezoneOffset();
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMin = pad(absOffset % 60);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${sign}${offsetHours}${offsetMin}`;
}

// レッスン番号を取得する関数
const getLessonNumber = lesson => {
  if (lesson < 1 || lesson > 16) throw new Error("レッスン番号は1～16の範囲です");
  return lesson === 1 ? "01" : lesson <= 9 ? "02" : lesson <= 14 ? "03" : "04";
};

// リクエストデータ生成関数
const createRequestData = (unit, lesson, activity, fileName, score, time, studentId, maxScore) => ({
  data: JSON.stringify({
    activityAttempts: [{
      data: JSON.stringify({ order: 1, maxScore, state: `<a>` }),
      unit: unit.toString().padStart(2, "0"),
      lesson,
      activity,
      fileName,
      time,
      activityType: "mc_questions_single_image",
      score,
      studentId
    }],
    order: 1,
    maxScore,
    state: `<state></state>`
  }),
  unit: unit.toString().padStart(2, "0"),
  lesson,
  activity,
  fileName,
  time,
  activityType: "mc_questions_single_image",
  score,
  studentId
});

// APIへリクエスト送信関数
const sendRequest = (data, bookId) => {
  fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(r => { 
    if (!r.ok) throw new Error(`HTTPエラー: ${r.status}`);
    return r.json();
  })
  .then(d => console.log("成功:", d))
  .catch(e => console.error("エラー:", e));
};

/**
 * 自動スコア決定用のJSONデータから、指定unit, lesson, activityに対応するmaxScoreを返す関数
 * 見つからなければnullを返す
 */
function getAutoScore(jsonData, unitId, lessonId, activityId) {
  if (!jsonData || !jsonData.data || !jsonData.data.units) return null;
  for (const unit of jsonData.data.units) {
    if (unit.unit === unitId) {
      if (unit.lessons && Array.isArray(unit.lessons)) {
        for (const lesson of unit.lessons) {
          if (lesson.lesson === lessonId) {
            if (lesson.activities && Array.isArray(lesson.activities)) {
              for (const activity of lesson.activities) {
                if (activity.activity === activityId) {
                  return activity.maxScore;
                }
              }
            }
          }
        }
      }
    }
  }
  return null;
}

// モーダルフォームを動的に作成して即実行
(async function createModalForm(){
  // オーバーレイ作成
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;overflow:auto";
  
  // モーダルコンテナ作成
  const modal = document.createElement("div");
  modal.style.cssText = "background:#fff;padding:20px;border-radius:8px;width:90%;max-width:500px;position:relative;box-sizing:border-box;max-height:90%;overflow-y:auto";
  
  // 閉じるボタン
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.cssText = "position:absolute;top:10px;right:10px;border:none;background:transparent;font-size:24px;cursor:pointer";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  modal.appendChild(closeBtn);
  
  // フォーム作成
  const form = document.createElement("form");
  
  // 入力フィールド生成のヘルパー関数
  const createField = (id, labelText, type="text", defaultVal="") => {
    const c = document.createElement("div");
    c.style.marginBottom = "10px";
    const l = document.createElement("label");
    l.htmlFor = id;
    l.textContent = labelText;
    l.style.cssText = "display:block;margin-bottom:5px";
    const i = document.createElement("input");
    i.type = type;
    i.id = id;
    i.name = id;
    i.value = defaultVal;
    i.style.cssText = "width:100%;padding:8px;box-sizing:border-box";
    c.appendChild(l);
    c.appendChild(i);
    return c;
  };
  
  // localStorageから保存された値を取得
  const storedStudentId = localStorage.getItem("studentId") || "2751883",
        storedBookId = localStorage.getItem("bookId") || "129",
        storedClassId = localStorage.getItem("classId") || "379216";
  
  form.appendChild(createField("studentId", "studentId (空の場合は2751883)", "text", storedStudentId));
  form.appendChild(createField("bookId", "bookId (空の場合は129)", "text", storedBookId));
  // classIdフィールド追加
  form.appendChild(createField("classId", "classId (空の場合は379216)", "text", storedClassId));
  form.appendChild(createField("unit", "ユニット番号 (例:4)", "number", ""));
  
  // 「このユニットすべてをマークしますか？」フィールド
  const markDiv = document.createElement("div");
  markDiv.style.marginBottom = "10px";
  const markLabel = document.createElement("label");
  markLabel.htmlFor = "markAllLessons";
  markLabel.textContent = "このユニットすべてをマークしますか？";
  markLabel.style.cssText = "display:block;margin-bottom:5px";
  markDiv.appendChild(markLabel);
  const markSelect = document.createElement("select");
  markSelect.id = "markAllLessons";
  markSelect.name = "markAllLessons";
  ["y","n"].forEach(v=>{
    const op = document.createElement("option");
    op.value = v; op.textContent = v;
    markSelect.appendChild(op);
  });
  markSelect.value = "n";
  markDiv.appendChild(markSelect);
  form.appendChild(markDiv);
  
  // 「自動で点数を決めるか？」フィールド
  const autoScoreDiv = document.createElement("div");
  autoScoreDiv.style.marginBottom = "10px";
  const autoScoreLabel = document.createElement("label");
  autoScoreLabel.htmlFor = "autoScore";
  autoScoreLabel.textContent = "自動で点数を決めますか？";
  autoScoreLabel.style.cssText = "display:block;margin-bottom:5px";
  autoScoreDiv.appendChild(autoScoreLabel);
  const autoScoreSelect = document.createElement("select");
  autoScoreSelect.id = "autoScore";
  autoScoreSelect.name = "autoScore";
  ["y","n"].forEach(v=>{
    const op = document.createElement("option");
    op.value = v; op.textContent = v;
    autoScoreSelect.appendChild(op);
  });
  autoScoreSelect.value = "n";
  autoScoreDiv.appendChild(autoScoreSelect);
  form.appendChild(autoScoreDiv);
  
  // スコア手入力フィールド
  const scoreDiv = createField("score", "スコア (例:8)", "number", "8");
  form.appendChild(scoreDiv);
  
  // 自動点数が有効の場合、スコア入力を隠す
  autoScoreSelect.onchange = e => scoreDiv.style.display = e.target.value==="y"?"none":"block";
  
  // 経過時間フィールド
  form.appendChild(createField("time", "経過時間 (秒) (例:45)", "number", "45"));
  
  // レッスン番号フィールド（markAllLessonsが「n」の場合のみ表示）
  const lessonDiv = createField("lessonNumber", "レッスン番号 (例:5)", "number", "");
  lessonDiv.style.display = markSelect.value==="n"?"block":"none";
  form.appendChild(lessonDiv);
  
  // markAllLessonsによりレッスン番号の表示を切り替え
  markSelect.onchange = e => lessonDiv.style.display = e.target.value==="n"?"block":"none";
  
  // 送信ボタン
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "送信";
  submitBtn.style.cssText = "padding:10px 20px;font-size:16px;cursor:pointer";
  form.appendChild(submitBtn);
  
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // フォーム送信時の処理（asyncにしてfetch待機）
  form.onsubmit = async e => {
    e.preventDefault();
    const studentId = (document.getElementById("studentId").value.trim() || "2751883"),
          bookId = (document.getElementById("bookId").value.trim() || "129"),
          classId = (document.getElementById("classId").value.trim() || "379216"),
          unitStr = document.getElementById("unit").value.trim(),
          markAll = markSelect.value.toLowerCase(),
          autoScore = autoScoreSelect.value.toLowerCase(),
          scoreInput = document.getElementById("score").value.trim(),
          timeStr = document.getElementById("time").value.trim();
    let lessonStr = document.getElementById("lessonNumber").value.trim();

    if (!unitStr || isNaN(parseInt(unitStr, 10))) {
      alert("有効なユニット番号を入力してください。");
      return;
    }
    if (!timeStr || isNaN(parseInt(timeStr, 10)) || parseInt(timeStr, 10) <= 0) {
      alert("有効な経過時間 (秒) を入力してください。");
      return;
    }
    if (markAll === "n") {
      if (!lessonStr || isNaN(parseInt(lessonStr, 10))) {
        alert("有効なレッスン番号を入力してください。");
        return;
      }
      const ln = parseInt(lessonStr, 10);
      if (ln < 1 || ln > 16) {
        alert("レッスン番号は1～16の範囲です");
        return;
      }
    }
    
    localStorage.setItem("studentId", studentId);
    localStorage.setItem("bookId", bookId);
    localStorage.setItem("classId", classId);
    
    const unit = parseInt(unitStr, 10),
          timeVal = parseInt(timeStr, 10);
    let scoreVal;  // 未使用。手動の場合はscoreInputを
    let jsonData = null;
    
    // autoScoreが有効な場合、指定のクラスIDを使ってJSONを取得
    if (autoScore === "y") {
      const apiUrl = `https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities?classId=${classId}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'timezone': getCurrentTimezone()
          }
        });
        if (!response.ok) throw new Error('JSON取得エラー: ' + response.status);
        jsonData = await response.json();
      } catch (error) {
        alert("JSONデータの取得に失敗しました。後ほど再度お試しください。");
        console.error(error);
        return;
      }
    }
    
    // リクエスト送信
    if (markAll === "y") {
      for (let i = 1; i <= 16; i++) {
        const lesson = getLessonNumber(i),
              activity = i.toString().padStart(2, "0"),
              fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
        let score = autoScore === "y"
          ? getAutoScore(jsonData, unit.toString().padStart(2, "0"), lesson, activity)
          : parseInt(scoreInput, 10);
        if (score === null) {
          alert(`Unit: ${unit.toString().padStart(2, "0")}, Lesson: ${lesson}, Activity: ${activity} のスコアが取得できませんでした。`);
          return;
        }
        const reqData = createRequestData(unit, lesson, activity, fileName, score, timeVal, studentId, score);
        sendRequest(reqData, bookId);
      }
    } else {
      const ln = parseInt(lessonStr, 10),
            lesson = getLessonNumber(ln),
            activity = ln.toString().padStart(2, "0"),
            fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
      let score = autoScore === "y"
        ? getAutoScore(jsonData, unit.toString().padStart(2, "0"), lesson, activity)
        : parseInt(scoreInput, 10);
      if (score === null) {
        alert(`Unit: ${unit.toString().padStart(2, "0")}, Lesson: ${lesson}, Activity: ${activity} のスコアが取得できませんでした。`);
        return;
      }
      const reqData = createRequestData(unit, lesson, activity, fileName, score, timeVal, studentId, score);
      sendRequest(reqData, bookId);
    }
    alert("リクエストを送信しました。");
    document.body.removeChild(overlay);
  };
})();
