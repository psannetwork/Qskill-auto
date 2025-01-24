// 入力バリデーション付き
function getValidatedInput(promptMessage, defaultValue, validator) {
  let value;
  do {
    value = prompt(promptMessage, defaultValue);
    if (validator(value)) {
      break;
    } else {
      alert("無効な入力です。もう一度お試しください。");
    }
  } while (true);
  return value;
}

// 必要なパラメータ取得
let studentId = localStorage.getItem("studentId") || getValidatedInput(
  "studentId を入力してください (空の場合はデフォルト値 2751883 を使用)", 
  "2751883", 
  (v) => v !== null && v.trim() !== ""
);
localStorage.setItem("studentId", studentId);

let bookId = localStorage.getItem("bookId") || getValidatedInput(
  "bookId を入力してください (空の場合はデフォルト値 129 を使用)", 
  "129", 
  (v) => v !== null && v.trim() !== ""
);
localStorage.setItem("bookId", bookId);

const promptUnit = parseInt(getValidatedInput(
  "ユニット番号を入力してください (例: 4)", 
  "", 
  (v) => !isNaN(parseInt(v, 10))
), 10);
const markAllLessons = getValidatedInput(
  "このユニットすべてをマークしますか？ (y/n)", 
  "n", 
  (v) => ["y", "n"].includes(v.toLowerCase())
).toLowerCase();

const score = parseInt(getValidatedInput(
  "スコアを入力してください (例: 8)", 
  "8", 
  (v) => !isNaN(parseInt(v, 10))
), 10);

const time = parseInt(getValidatedInput(
  "経過時間 (秒) を入力してください (例: 45)", 
  "45", 
  (v) => !isNaN(parseInt(v, 10)) && parseInt(v, 10) > 0
), 10);

const maxScore = score;

function getLessonNumber(lesson) {
  if (lesson < 1 || lesson > 16) {
    throw new Error("レッスン番号は 1 ～ 16 の範囲で指定してください。");
  }
  if (lesson === 1) return "01";
  if (lesson <= 9) return "02";
  if (lesson <= 14) return "03";
  return "04";
}

function createRequestData(unit, lesson, activity, fileName) {
  const order = 1; // デフォルトの順序を使用（必要に応じて変更可）
  return {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order,
            maxScore,
            state: `<a>`
          }),
          unit: unit.toString().padStart(2, "0"),
          lesson,
          activity,
          fileName,
          time,
          activityType: "mc_questions_single_image",
          score,
          studentId
        }
      ],
      order,
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
  };
}

function sendRequest(requestData, bookId) {
  fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

if (markAllLessons === "y") {
  for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
    const lesson = getLessonNumber(lessonNum);
    const activity = lessonNum.toString().padStart(2, "0");
    const fileName = `iQ3e_RW1_${promptUnit.toString().padStart(2, "0")}_${lesson}_${activity}`;
    const requestData = createRequestData(promptUnit, lesson, activity, fileName);
    sendRequest(requestData, bookId);
  }
} else {
  const promptLesson = parseInt(getValidatedInput(
    "レッスン番号を入力してください (例: 5)", 
    "", 
    (v) => !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 1 && parseInt(v, 10) <= 16
  ), 10);
  const lesson = getLessonNumber(promptLesson);
  const activity = promptLesson.toString().padStart(2, "0");
  const fileName = `iQ3e_RW1_${promptUnit.toString().padStart(2, "0")}_${lesson}_${activity}`;
  const requestData = createRequestData(promptUnit, lesson, activity, fileName);
  sendRequest(requestData, bookId);
}
