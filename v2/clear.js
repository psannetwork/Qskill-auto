// localStorageからstudentIdを取得
let studentId = localStorage.getItem("studentId");

// studentIdが保存されていない場合は入力を促す
if (!studentId) {
  studentId = prompt("studentId を入力してください (空の場合はデフォルト値 2751883 を使用)");
  if (!studentId) {
    studentId = "2751883"; // デフォルト値
  }
  // 入力したstudentIdをlocalStorageに保存
  localStorage.setItem("studentId", studentId);
}
console.log("studentId:", studentId);  // デバッグ用

const unit = parseInt(prompt("ユニット番号を入力してください (例: 4)"), 10);
console.log("ユニット番号:", unit);  // デバッグ用

// ユーザーに空にしたいアクティビティ番号を入力してもらう
const promptActivity = parseInt(prompt("空にしたいアクティビティ番号を入力してください (例: 11)"), 10);
console.log("空にしたいアクティビティ番号:", promptActivity);  // デバッグ用

// レッスン番号を適切な形式（文字列）に変換する関数
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

// activity番号はユーザー入力の値そのまま
const activity = promptActivity;
console.log("指定されたアクティビティ番号:", activity);  // デバッグ用

// レッスン番号を計算（getLessonNumberを使う）
const lessonFormatted = getLessonNumber(activity);
console.log("計算されたレッスン番号:", lessonFormatted);  // デバッグ用

// activity番号をユニットとレッスンから計算
function calculateActivityNumber(unit, lesson) {
  // アクティビティ番号をユニットとレッスンから生成する例
  return `${unit.toString().padStart(2, "0")}_${lesson}`;
}

// activity番号を計算
const activityNumber = calculateActivityNumber(unit, lessonFormatted);
console.log("計算されたアクティビティ番号:", activityNumber);  // デバッグ用

// 指定されたレッスンとアクティビティのデータを空にする関数
function createEmptyRequestData(unit, lesson, activity, fileName) {
  return {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order: 0,  // 0に設定して空データを作成
            maxScore: 0,
            state: "<state></state>"  // 空の状態
          }),
          unit: unit.toString().padStart(2, "0"),
          lesson: lesson,
          activity: activity,
          fileName: fileName,
          time: 0,  // 時間も0に設定
          activityType: "mc_questions_single_image",
          score: 0,  // スコアも0に設定
          studentId: studentId
        }
      ],
      order: 0,  // 0に設定して空データを作成
      maxScore: 0,
      state: "<state></state>",  // 空の状態
    }),
    unit: unit.toString().padStart(2, "0"),
    lesson: lesson,
    activity: activity,
    fileName: fileName,
    time: 0,
    activityType: "mc_questions_single_image",
    score: 0,
    studentId: studentId
  };
}

// fileName を作成
const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lessonFormatted}_${activity}`;
console.log("生成されたファイル名:", fileName);  // デバッグ用

// 空のデータを作成
const requestData = createEmptyRequestData(unit, lessonFormatted, activity, fileName);
console.log("送信するデータ:", requestData);  // デバッグ用

// fetch APIを使ってPOSTリクエストを送る
fetch("https://q3e.oxfordonlinepractice.com/api/books/129/activities", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // JSONデータとして送信
  },
  body: JSON.stringify(requestData) // データをJSON形式で送信
})
  .then(response => response.json()) // レスポンスをJSONとして処理
  .then(data => {
    console.log('Success:', data); // 成功時のデータを表示
  })
  .catch((error) => {
    console.error('Error:', error); // エラー時のログ
  });
