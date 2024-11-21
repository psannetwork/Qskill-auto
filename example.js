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
        unit: "04",
        lesson: "02",
        activity: "07",
        fileName: "iQ3e_RW1_04_02_07",
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
  unit: "05",
  lesson: "02",
  activity: "02",
  fileName: "iQ3e_RW1_05_02_02",
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
