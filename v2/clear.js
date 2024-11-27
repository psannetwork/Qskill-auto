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
const unit = prompt("ユニット番号を入力してください (例: 4)");

// ユーザーに入力してもらう、空にしたいレッスン番号
const promptLesson = parseInt(prompt("空にしたいレッスン番号を入力してください (例: 5)"), 10);

// ユーザーにユニット番号を入力してもらう

// activity番号をユニットとレッスンから計算
function calculateActivityNumber(unit, lesson) {
  // ここでは単純なロジックを例として、ユニットとレッスン番号でアクティビティ番号を決定します
  // 例えば、ユニット番号とレッスン番号を組み合わせてアクティビティ番号を決める
  return `${unit.toString().padStart(2, "0")}_${lesson.toString().padStart(2, "0")}`;
}

// activity番号を計算
const activity = calculateActivityNumber(unit, promptLesson);

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
const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${promptLesson.toString().padStart(2, "0")}_${activity}`;

// 空のデータを作成
const requestData = createEmptyRequestData(unit, promptLesson.toString().padStart(2, "0"), activity, fileName);

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
