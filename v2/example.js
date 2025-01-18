let studentId = "2751883"; // デフォルト値を設定
let bookId = "129"; // デフォルト値を設定
let unit = 1; // ユニット番号
let lessonNum = 3; // レッスン番号
let score = 1; // スコア
let maxScore = score; // 最大スコア

// getLessonNumber 関数の定義
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

// createRequestData 関数の定義
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
            state: `<h1>testcode</h1>`
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
      state: `<h1>testcode</h1>`
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

// getRandomOffset 関数の定義
function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
