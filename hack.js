// ユーザーにユニット番号を入力してもらう
const promptUnit = parseInt(prompt("ユニット番号を入力してください (例: 4)"), 10);

// ユーザーに「このユニットすべてをマークしますか？」と確認
const markAllLessons = prompt("このユニットすべてをマークしますか？ (y/n)").toLowerCase();

// ユニットの値
const unit = promptUnit;

// レッスン番号を取得するための関数
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

// ランダムな1桁の数字を生成する関数 (0以上、最大でも5)
function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;  // min 以上 max 以下のランダムな数
}

// requestData を作成する関数
function createRequestData(unit, lesson, activity, fileName) {
  const order = 1 + getRandomOffset(0, 5);  // orderは1以上になるようにランダム値を加算
  const time = 40 + getRandomOffset(0, 5);  // timeは40以上になるようにランダム値を加算

  return {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order: order,
            maxScore: 8,
            state: `<state>
                      <question>
                        <answer index="0"/>
                        <answer index="1"/>
                        <answer index="2" selected="true">protect</answer>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">surprise</answer>
                        <answer index="2"/>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1"/>
                        <answer index="2" selected="true">pretend</answer>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">serious</answer>
                        <answer index="2"/>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">effect</answer>
                        <answer index="2"/>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">rate</answer>
                        <answer index="2"/>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">whole</answer>
                        <answer index="2"/>
                      </question>
                      <question>
                        <answer index="0"/>
                        <answer index="1" selected="true">effect</answer>
                        <answer index="2"/>
                      </question>
                      <attempts>-1</attempts>
                    </state>`
          }),
          unit: unit.toString().padStart(2, "0"),
          lesson: lesson,
          activity: activity,
          fileName: fileName,
          time: time,
          activityType: "mc_questions_single_image",
          score: 8,
          studentId: "2751883"
        }
      ],
      order: order,
      maxScore: 8,
      state: `<state>
                <question>
                  <answer index="0"/>
                  <answer index="1"/>
                  <answer index="2" selected="true">protect</answer>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">surprise</answer>
                  <answer index="2"/>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1"/>
                  <answer index="2" selected="true">pretend</answer>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">serious</answer>
                  <answer index="2"/>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">effect</answer>
                  <answer index="2"/>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">rate</answer>
                  <answer index="2"/>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">whole</answer>
                  <answer index="2"/>
                </question>
                <question>
                  <answer index="0"/>
                  <answer index="1" selected="true">effect</answer>
                  <answer index="2"/>
                </question>
                <attempts>-1</attempts>
              </state>`
    }),
    unit: unit.toString().padStart(2, "0"),
    lesson: lesson,
    activity: activity,
    fileName: fileName,
    time: time,
    activityType: "mc_questions_single_image",
    score: 8,
    studentId: "2751883"
  };
}

// レッスン1～16を一括で処理する場合
if (markAllLessons === "y") {
  for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
    const lesson = getLessonNumber(lessonNum);
    const activity = lessonNum.toString().padStart(2, "0");

    // fileName を作成
    const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

    // POSTリクエストのデータ作成
    const requestData = createRequestData(unit, lesson, activity, fileName);

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
  }
} else {
  // 1つのレッスンのみ処理する場合
  const promptLesson = parseInt(prompt("レッスン番号を入力してください (例: 5)"), 10);
  const lesson = getLessonNumber(promptLesson);
  const activity = promptLesson.toString().padStart(2, "0");

  // fileName を作成
  const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

  // POSTリクエストのデータ作成
  const requestData = createRequestData(unit, lesson, activity, fileName);

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
}
