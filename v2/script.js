let studentId = localStorage.getItem("studentId");
if (!studentId) {
  studentId = prompt("studentId を入力してください (空の場合はデフォルト値 2751883 を使用)");
  if (!studentId) {
    studentId = "2751883"; 
  }
  localStorage.setItem("studentId", studentId);
}

let bookId = localStorage.getItem("bookId");
if (!bookId) {
  bookId = prompt("bookId を入力してください (空の場合はデフォルト値 129 を使用)");
  if (!bookId) {
    bookId = "129"; 
  }
  localStorage.setItem("bookId", bookId);
}

const promptUnit = parseInt(prompt("ユニット番号を入力してください (例: 4)"), 10);
const markAllLessons = prompt("このユニットすべてをマークしますか？ (y/n)").toLowerCase();
const unit = promptUnit;
const score = parseInt(prompt("スコアを入力してください (例: 8)"), 10);
const maxScore = score;

function getLessonNumber(lesson) {
  if (lesson === 1) {
    return "01";
  } else if (lesson >= 2 && lesson <= 9) {
    return "02";
  } else if (lesson >= 10 && lesson <= 14) {
    return "03";
  } else if (lesson === 15 || lesson === 16) {
    return "04";
  } else {
    console.error("無効なレッスン番号が指定されました");
    throw new Error("レッスン番号は 1 ～ 16 の範囲で指定してください。");
  }
}

function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRequestData(unit, lesson, activity, fileName) {
  const order = 1 + getRandomOffset(0, 5);  
  const time = 40 + getRandomOffset(0, 5);  

  return {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order: order,
            maxScore: maxScore,
            state: `<a>`
          }),
          unit: unit.toString().padStart(2, "0"),
          lesson: lesson,
          activity: activity,
          fileName: fileName,
          time: time,
          activityType: "mc_questions_single_image",
          score: score,
          studentId: studentId
        }
      ],
      order: order,
      maxScore: maxScore,
      state: `<state>
              </state>`
    }),
    unit: unit.toString().padStart(2, "0"),
    lesson: lesson,
    activity: activity,
    fileName: fileName,
    time: time,
    activityType: "mc_questions_single_image",
    score: score,
    studentId: studentId
  };
}

if (markAllLessons === "y") {
  for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
    const lesson = getLessonNumber(lessonNum);
    const activity = lessonNum.toString().padStart(2, "0");

    const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

    const requestData = createRequestData(unit, lesson, activity, fileName);

    fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestData) 
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
} else {
  const promptLesson = parseInt(prompt("レッスン番号を入力してください (例: 5)"), 10);
  const lesson = getLessonNumber(promptLesson);
  const activity = promptLesson.toString().padStart(2, "0");

  const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
  const requestData = createRequestData(unit, lesson, activity, fileName);

  fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
