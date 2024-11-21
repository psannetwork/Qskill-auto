// ユニットとレッスンの入力をユーザーに求める
const promptUnit = parseInt(prompt("ユニット番号を入力してください (例: 4)"), 10);
const promptLesson = parseInt(prompt("レッスン番号を入力してください (例: 5)"), 10);

// unit の値
const unit = promptUnit;

// lesson の値を条件に応じて設定
let lesson;
if (promptLesson === 1) {
  lesson = "01";
} else if (promptLesson >= 2 && promptLesson <= 9) {
  lesson = "02";
} else if (promptLesson >= 10 && promptLesson <= 14) {
  lesson = "03";
} else if (promptLesson === 15 || promptLesson === 16) {
  lesson = "04";
} else {
  console.error("無効なレッスン番号が指定されました");
  throw new Error("レッスン番号は 1 ～ 16 の範囲で指定してください。");
}

// activity はレッスン番号を 2桁に変換したもの
const activity = promptLesson.toString().padStart(2, "0");

// fileName を作成
const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

// APIのURL
const url = "https://q3e.oxfordonlinepractice.com/api/books/129/activities";

// POSTリクエストのデータ
const requestData = {
  data: JSON.stringify({
    activityAttempts: [
      {
        data: JSON.stringify({
          order: 1,
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
        time: 17,
        activityType: "mc_questions_single_image",
        score: 3,
        studentId: "2751883"
      }
    ],
    order: 1,
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
  time: 17,
  activityType: "mc_questions_single_image",
  score: 8,
  studentId: "2751883"
};

// fetch APIを使ってPOSTリクエストを送る
fetch(url, {
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
