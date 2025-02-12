// HTML不使用、すぐに実行されるコンパクトなモーダルフォームスクリプト
(function(){
  const getLessonNumber = lesson => {
    if(lesson<1 || lesson>16) throw new Error("レッスン番号は1～16");
    return lesson===1 ? "01" : lesson<=9 ? "02" : lesson<=14 ? "03" : "04";
  };
  const createRequestData = (unit, lesson, activity, fileName, score, time, studentId, maxScore) => ({
    data: JSON.stringify({
      activityAttempts: [{
        data: JSON.stringify({order:1, maxScore, state:`<a>`}),
        unit: unit.toString().padStart(2,"0"), lesson, activity, fileName, time,
        activityType:"mc_questions_single_image", score, studentId
      }],
      order: 1, maxScore, state: `<state></state>`
    }),
    unit: unit.toString().padStart(2,"0"), lesson, activity, fileName, time,
    activityType:"mc_questions_single_image", score, studentId
  });
  const sendRequest = (data, bookId) => {
    fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(data)
    })
    .then(r=>{ if(!r.ok) throw new Error(`HTTPエラー: ${r.status}`); return r.json(); })
    .then(d=>console.log("成功:", d))
    .catch(e=>console.error("エラー:", e));
  };
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;overflow:auto";
  const modal = document.createElement("div");
  modal.style.cssText = "background:#fff;padding:20px;border-radius:8px;width:90%;max-width:500px;position:relative;box-sizing:border-box;max-height:90%;overflow-y:auto";
  const closeBtn = document.createElement("button"); closeBtn.textContent="×";
  closeBtn.style.cssText = "position:absolute;top:10px;right:10px;border:none;background:transparent;font-size:24px;cursor:pointer";
  closeBtn.onclick = () => document.body.removeChild(overlay);
  modal.appendChild(closeBtn);
  const form = document.createElement("form");
  const createField = (id, labelText, type="text", defaultVal="") => {
    const c = document.createElement("div");
    c.style.marginBottom = "10px";
    const l = document.createElement("label");
    l.htmlFor = id; l.textContent=labelText; l.style.cssText="display:block;margin-bottom:5px";
    const i = document.createElement("input");
    i.type = type; i.id = id; i.name = id; i.value = defaultVal; i.style.cssText="width:100%;padding:8px;box-sizing:border-box";
    c.appendChild(l); c.appendChild(i); return c;
  };
  const storedStudentId = localStorage.getItem("studentId") || "2751883",
        storedBookId = localStorage.getItem("bookId") || "129";
  form.appendChild(createField("studentId","studentId (空の場合は2751883)","text",storedStudentId));
  form.appendChild(createField("bookId","bookId (空の場合は129)","text",storedBookId));
  form.appendChild(createField("unit","ユニット番号 (例:4)","number",""));
  const markDiv = document.createElement("div");
  markDiv.style.marginBottom = "10px";
  const markLabel = document.createElement("label");
  markLabel.htmlFor = "markAllLessons"; markLabel.textContent = "このユニットすべてをマークしますか？";
  markLabel.style.cssText = "display:block;margin-bottom:5px";
  markDiv.appendChild(markLabel);
  const markSelect = document.createElement("select");
  markSelect.id = "markAllLessons"; markSelect.name = "markAllLessons";
  ["y","n"].forEach(v=>{
    const op = document.createElement("option");
    op.value = v; op.textContent = v; markSelect.appendChild(op);
  });
  markSelect.value="n"; markDiv.appendChild(markSelect); form.appendChild(markDiv);
  form.appendChild(createField("score","スコア (例:8)","number","8"));
  form.appendChild(createField("time","経過時間 (秒) (例:45)","number","45"));
  const lessonDiv = createField("lessonNumber","レッスン番号 (例:5)","number","");
  lessonDiv.style.display = markSelect.value==="n"?"block":"none";
  form.appendChild(lessonDiv);
  markSelect.onchange = e => lessonDiv.style.display = e.target.value==="n"?"block":"none";
  const submitBtn = document.createElement("button"); submitBtn.type="submit"; submitBtn.textContent="送信";
  submitBtn.style.cssText="padding:10px 20px;font-size:16px;cursor:pointer"; form.appendChild(submitBtn);
  modal.appendChild(form); overlay.appendChild(modal); document.body.appendChild(overlay);
  form.onsubmit = e=>{
    e.preventDefault();
    const studentId = (document.getElementById("studentId").value.trim()||"2751883"),
          bookId = (document.getElementById("bookId").value.trim()||"129"),
          unitStr = document.getElementById("unit").value.trim(),
          markAll = markSelect.value.toLowerCase(),
          scoreStr = document.getElementById("score").value.trim(),
          timeStr = document.getElementById("time").value.trim();
    let lessonStr = document.getElementById("lessonNumber").value.trim();
    if(!unitStr||isNaN(parseInt(unitStr,10))){ alert("有効なユニット番号を入力"); return; }
    if(!scoreStr||isNaN(parseInt(scoreStr,10))){ alert("有効なスコアを入力"); return; }
    if(!timeStr||isNaN(parseInt(timeStr,10))||parseInt(timeStr,10)<=0){ alert("有効な経過時間を入力"); return; }
    if(markAll==="n"){
      if(!lessonStr||isNaN(parseInt(lessonStr,10))){ alert("有効なレッスン番号を入力"); return; }
      const ln = parseInt(lessonStr,10); if(ln<1||ln>16){ alert("レッスン番号は1～16"); return; }
    }
    localStorage.setItem("studentId",studentId);
    localStorage.setItem("bookId",bookId);
    const unit = parseInt(unitStr,10), score = parseInt(scoreStr,10), time = parseInt(timeStr,10), maxScore = score;
    if(markAll==="y"){
      for(let i=1;i<=16;i++){
        const lesson = getLessonNumber(i), activity = i.toString().padStart(2,"0"),
              fileName = `iQ3e_RW1_${unit.toString().padStart(2,"0")}_${lesson}_${activity}`,
              reqData = createRequestData(unit,lesson,activity,fileName,score,time,studentId,maxScore);
        sendRequest(reqData,bookId);
      }
    } else {
      const ln = parseInt(lessonStr,10),
            lesson = getLessonNumber(ln), activity = ln.toString().padStart(2,"0"),
            fileName = `iQ3e_RW1_${unit.toString().padStart(2,"0")}_${lesson}_${activity}`,
            reqData = createRequestData(unit,lesson,activity,fileName,score,time,studentId,maxScore);
      sendRequest(reqData,bookId);
    }
    alert("リクエスト送信済み"); document.body.removeChild(overlay);
  };
})();
