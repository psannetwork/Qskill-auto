(function(){
  // ダークテーマ用CSS
  const darkThemeCSS = `
    body { background-color: #121212 !important; color: #e0e0e0 !important; }
    div, pre, h2, ul, li { background-color: #1e1e1e !important; color: #e0e0e0 !important; }
    a { color: #64b5f6 !important; text-decoration: none; }
    * { border-color: #333 !important; }
    input, select { background: #121212; color: #e0e0e0; border: 1px solid #444; padding: 8px; }
    option { background: #1e1e1e; color: #e0e0e0; }
  `;
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(darkThemeCSS));
  document.head.appendChild(styleEl);

  // タイムゾーンを取得する関数: yyyy-MM-dd HH:mm:ss±hhmm
  function getCurrentTimezone(){
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const year = now.getFullYear(),
          month = pad(now.getMonth() + 1),
          day = pad(now.getDate()),
          hours = pad(now.getHours()),
          minutes = pad(now.getMinutes()),
          seconds = pad(now.getSeconds());
    const offsetMinutes = now.getTimezoneOffset();
    const sign = offsetMinutes <= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absOffset/60));
    const offsetMin = pad(absOffset % 60);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${sign}${offsetHours}${offsetMin}`;
  }

  // レッスン番号から変換番号を取得（1～16）
  const getLessonNumber = lesson => { 
    if(lesson < 1 || lesson > 16) throw new Error("error");
    return lesson === 1 ? "01" : lesson <= 9 ? "02" : lesson <= 14 ? "03" : "04";
  };

  // リクエストデータ作成用関数
  const createRequestData = (unit, lesson, activity, fileName, score, time, studentId, maxScore) => ({
    data: JSON.stringify({ 
      activityAttempts: [{
        data: JSON.stringify({ order: 1, maxScore, state: `<a>` }),
        unit: unit.toString().padStart(2, "0"), lesson, activity, fileName, time,
        activityType: "mc_questions_single_image", score, studentId 
      }],
      order: 1, maxScore, state: `<state></state>`
    }),
    unit: unit.toString().padStart(2, "0"), lesson, activity, fileName, time,
    activityType: "mc_questions_single_image", score, studentId
  });

  // サーバーにリクエスト送信する関数
  const sendRequest = (data, bookId) => {
    fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data) 
    })
      .then(r => { 
        if(!r.ok) throw new Error(`HTTPエラー:${r.status}`);
        return r.json();
      })
      .then(d => console.log("成功:", d))
      .catch(e => console.error("エラー:", e));
  };

  // 自動採点用：jsonDataからスコアを取得する
  function getAutoScore(jsonData, unitId, lessonId, activityId) {
    if (!jsonData || !jsonData.data || !jsonData.data.units) return null;
    for (const unit of jsonData.data.units)
      if (unit.unit === unitId)
        if (unit.lessons && Array.isArray(unit.lessons))
          for (const lesson of unit.lessons)
            if (lesson.lesson === lessonId)
              if (lesson.activities && Array.isArray(lesson.activities))
                for (const activity of lesson.activities)
                  if (activity.activity === activityId) return activity.maxScore;
    return null;
  }

  // オーバーレイとモーダルの作成
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;overflow:auto";
  const modal = document.createElement("div");
  modal.style.cssText = "background:#1e1e1e;padding:20px;border-radius:8px;width:90%;max-width:500px;position:relative;box-sizing:border-box;max-height:90%;overflow-y:auto";
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.cssText = "position:absolute;top:10px;right:10px;border:none;background:transparent;font-size:24px;cursor:pointer;color:#e0e0e0";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  modal.appendChild(closeBtn);

  // ヘッダー部分
  const header = document.createElement("div");
  header.style.cssText = "text-align:center;margin-bottom:20px";
  const title = document.createElement("h2");
  title.textContent = "Qskill Control Panel";
  title.style.cssText = "margin:0;color:#e0e0e0";
  const subtitle = document.createElement("div");
  subtitle.textContent = "written by psan";
  subtitle.style.cssText = "font-size:14px;color:#888;margin-bottom:10px";
  header.appendChild(title);
  header.appendChild(subtitle);
  modal.appendChild(header);

  // ユーティリティ関数：入力フィールドの作成
  const createField = (id, labelText, type="text", def="") => {
    const c = document.createElement("div");
    c.style.marginBottom = "10px";
    const l = document.createElement("label");
    l.setAttribute("for", id);
    l.textContent = labelText;
    l.style.cssText = "display:block;margin-bottom:5px;color:#e0e0e0";
    const i = document.createElement("input");
    i.type = type;
    i.id = id;
    i.name = id;
    i.value = def;
    i.style.cssText = "width:100%;padding:8px;box-sizing:border-box";
    c.appendChild(l);
    c.appendChild(i);
    return c;
  };

  // ユーティリティ関数：セレクトボックスの作成
  const createSelectField = (id, labelText, options, def) => {
    const c = document.createElement("div");
    c.style.marginBottom = "10px";
    const l = document.createElement("label");
    l.setAttribute("for", id);
    l.textContent = labelText;
    l.style.cssText = "display:block;margin-bottom:5px;color:#e0e0e0";
    const sel = document.createElement("select");
    sel.id = id;
    sel.name = id;
    options.forEach(v => {
      const op = document.createElement("option");
      op.value = v;
      op.textContent = v;
      sel.appendChild(op);
    });
    sel.value = def;
    c.appendChild(l);
    c.appendChild(sel);
    return c;
  };

  // 各項目の初期値（ローカルストレージまたはデフォルト値）
  const storedStudentId = localStorage.getItem("studentId") || "2751883";
  const storedBookId    = localStorage.getItem("bookId") || "129";
  const storedClassId   = localStorage.getItem("classId") || "379216";

  // --- セクションの順番 ---
  // 1. ユニット設定
  const unitDiv = document.createElement("div");
  const unitTitle = document.createElement("div");
  unitTitle.textContent = "ユニット設定";
  unitTitle.style.cssText = "padding:10px 0; border-bottom:1px solid #444; margin-bottom:10px; color:#e0e0e0; font-weight:bold";
  unitDiv.appendChild(unitTitle);
  const markAllUnitsField = createSelectField("markAllUnits", "すべてのユニットをマークしますか？ (y/n)", ["y","n"], "n");
  unitDiv.appendChild(markAllUnitsField);
  const unitField = createField("unit", "ユニット番号 (例:4)", "number", "");
  unitDiv.appendChild(unitField);

  // 2. レッスン設定
  const lessonDiv = document.createElement("div");
  const lessonTitle = document.createElement("div");
  lessonTitle.textContent = "レッスン設定";
  lessonTitle.style.cssText = "padding:10px 0; border-bottom:1px solid #444; margin-bottom:10px; color:#e0e0e0; font-weight:bold";
  lessonDiv.appendChild(lessonTitle);
  const markAllLessonsField = createSelectField("markAllLessons", "このユニットすべてのレッスンをマークしますか？ (y/n)", ["y","n"], "n");
  lessonDiv.appendChild(markAllLessonsField);
  const lessonField = createField("lessonNumber", "レッスン番号 (例:5)", "number", "");
  lessonDiv.appendChild(lessonField);

  // 3. 時間設定
  const timeDiv = document.createElement("div");
  const timeTitle = document.createElement("div");
  timeTitle.textContent = "時間設定";
  timeTitle.style.cssText = "padding:10px 0; border-bottom:1px solid #444; margin-bottom:10px; color:#e0e0e0; font-weight:bold";
  timeDiv.appendChild(timeTitle);
  const randomTimeField = createSelectField("randomTime", "時間をランダムにしますか？ (y/n)", ["y","n"], "n");
  timeDiv.appendChild(randomTimeField);
  const timeField = createField("time", "経過時間 (秒) (例:45)", "number", "45");
  timeDiv.appendChild(timeField);

  // 4. 採点設定
  const scoreDiv = document.createElement("div");
  const scoreTitle = document.createElement("div");
  scoreTitle.textContent = "採点設定";
  scoreTitle.style.cssText = "padding:10px 0; border-bottom:1px solid #444; margin-bottom:10px; color:#e0e0e0; font-weight:bold";
  scoreDiv.appendChild(scoreTitle);
  const autoScoreField = createSelectField("autoScore", "自動で点数を決めますか？ (y/n)", ["y","n"], "n");
  scoreDiv.appendChild(autoScoreField);
  const scoreField = createField("score", "スコア (例:8)", "number", "8");
  scoreDiv.appendChild(scoreField);

  // フォームの組み立て（上記4セクションの順番で）
  const form = document.createElement("form");
  form.appendChild(unitDiv);
  form.appendChild(lessonDiv);
  form.appendChild(timeDiv);
  form.appendChild(scoreDiv);

  // 送信ボタンの追加
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "送信";
  submitBtn.style.cssText = "padding:10px 20px;font-size:16px;cursor:pointer;background:#333;color:#e0e0e0;border:none; margin-top:10px";
  form.appendChild(submitBtn);

  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // --- イベントリスナー設定 ---

  // markAllUnits の変更：全ユニットの場合、ユニット入力とレッスン設定を非表示にする
  const markAllUnitsSelect = document.getElementById("markAllUnits");
  markAllUnitsSelect.onchange = e => {
    if(e.target.value === "y"){
      unitField.style.display = "none";
      // 全ユニットの場合は自動で全レッスンマーク（非表示）
      document.getElementById("markAllLessons").value = "y";
      markAllLessonsField.style.display = "none";
      lessonField.style.display = "none";
    } else {
      unitField.style.display = "block";
      markAllLessonsField.style.display = "block";
      if(document.getElementById("markAllLessons").value === "n"){
        lessonField.style.display = "block";
      } else {
        lessonField.style.display = "none";
      }
    }
  };

  // markAllLessons の変更：個別ユニットの場合のみ反映
  const markAllLessonsSelect = document.getElementById("markAllLessons");
  markAllLessonsSelect.onchange = e => {
    if(document.getElementById("markAllUnits").value === "n"){
      lessonField.style.display = e.target.value === "n" ? "block" : "none";
    }
  };

  // randomTime の変更：ランダムなら時間入力欄を非表示にする
  const randomTimeSelect = document.getElementById("randomTime");
  randomTimeSelect.onchange = e => {
    timeField.style.display = e.target.value === "y" ? "none" : "block";
  };
  if(randomTimeSelect.value === "y"){
    timeField.style.display = "none";
  }

  // autoScore の変更：自動採点ならスコア入力欄を非表示にする
  const autoScoreSelect = document.getElementById("autoScore");
  autoScoreSelect.onchange = e => {
    scoreField.style.display = e.target.value === "y" ? "none" : "block";
  };
  if(autoScoreSelect.value === "y"){
    scoreField.style.display = "none";
  }

  // フォーム送信処理
  form.onsubmit = async e => {
    e.preventDefault();
    const studentId = localStorage.getItem("studentId") || "2751883"; // 学生IDなどはストレージや別途管理
    const bookId = localStorage.getItem("bookId") || "129";
    const classId = localStorage.getItem("classId") || "379216";
    const markAllUnits = document.getElementById("markAllUnits").value.toLowerCase();
    const randomTime = document.getElementById("randomTime").value.toLowerCase();
    const autoScore = document.getElementById("autoScore").value.toLowerCase();
    let unitStr = document.getElementById("unit").value.trim();
    if(markAllUnits === "y"){
      unitStr = "";
    }
    let lessonStr = document.getElementById("lessonNumber").value.trim();
    let timeStr = document.getElementById("time").value.trim();

    // 時間の設定：ランダムなら30〜300秒（300未満）の整数、固定なら入力値
    let timeVal;
    if(randomTime === "y"){
      timeVal = Math.floor(Math.random() * (300 - 30)) + 30;
    } else {
      if(!timeStr || isNaN(parseInt(timeStr,10)) || parseInt(timeStr,10) <= 0){
        alert("有効な経過時間を入力してください");
        return;
      }
      timeVal = parseInt(timeStr,10);
    }

    // 個別ユニットの場合、ユニット番号のチェック
    if(markAllUnits === "n"){
      if(!unitStr || isNaN(parseInt(unitStr,10))){
        alert("有効なユニット番号を入力してください");
        return;
      }
    }
    // 個別レッスンの場合、レッスン番号のチェック
    if(document.getElementById("markAllUnits").value === "n" && document.getElementById("markAllLessons").value === "n"){
      if(!lessonStr || isNaN(parseInt(lessonStr,10))){
        alert("有効なレッスン番号を入力してください");
        return;
      }
      const ln = parseInt(lessonStr,10);
      if(ln < 1 || ln > 16){
        alert("レッスン番号は1～16の間で指定してください");
        return;
      }
    }

    // 自動採点のためのJSON取得（必要な場合）
    let jsonData = null;
    if(autoScore === "y"){
      const apiUrl = `https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities?classId=${classId}`;
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'timezone': getCurrentTimezone() }
        });
        if(!response.ok) throw new Error(response.status);
        jsonData = await response.json();
      } catch(error) {
        alert("JSON取得失敗");
        return;
      }
    }

    // マーク処理用関数
    const processMarking = (unit, lesson, activity) => {
      const unitPadded = unit.toString().padStart(2, "0");
      const lessonNumber = getLessonNumber(lesson);
      const activityId = activity.toString().padStart(2, "0");
      const fileName = `iQ3e_RW1_${unitPadded}_${lessonNumber}_${activityId}`;
      let score = autoScore === "y" ? getAutoScore(jsonData, unitPadded, lessonNumber, activityId) : parseInt(document.getElementById("score").value.trim(), 10);
      if(score === null){
        alert(`Unit:${unitPadded}, Lesson:${lessonNumber}, Activity:${activityId} のスコアが取得できません`);
        return false;
      }
      const reqData = createRequestData(unit, lessonNumber, activityId, fileName, score, timeVal, studentId, score);
      sendRequest(reqData, bookId);
      return true;
    };

    // 全ユニットの場合（例として1～10ユニット）
    const maxUnits = 10;
    if(markAllUnits === "y"){
      for(let unit = 1; unit <= maxUnits; unit++){
        // 全レッスンは自動でマーク
        for(let i = 1; i <= 16; i++){
          if(!processMarking(unit, i, i)) return;
        }
      }
    } else {
      const unit = parseInt(unitStr,10);
      if(document.getElementById("markAllLessons").value === "y"){
        for(let i = 1; i <= 16; i++){
          if(!processMarking(unit, i, i)) return;
        }
      } else {
        const ln = parseInt(lessonStr,10);
        if(!processMarking(unit, ln, ln)) return;
      }
    }
    alert("リクエスト送信済み");
    window.location.reload();
  };
})();
