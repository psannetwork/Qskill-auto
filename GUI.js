alert("This script was written by Psan.\nWe do not take any responsibility for what you do with this script.\n©Psannetwork 11/21");

const promptUnit = parseInt(prompt("ユニット番号を入力してください (例: 4)"), 10);

const markAllLessons = prompt("このユニットすべてをマークしますか？ (y/n)").toLowerCase();

const unit = promptUnit;

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
    alert("無効なレッスン番号が指定されました");
    throw new Error("レッスン番号は 1 ～ 16 の範囲で指定してください。");
  }
}

function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRequestData(unit, lesson, activity, fileName) {
  const order = 10;
  const time = 60 + getRandomOffset(0, 5);

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

function postRequest(requestData) {
  return fetch("https://q3e.oxfordonlinepractice.com/api/books/129/activities", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .catch((error) => {
      alert(`Error: ${error}`);
      throw error;
    });
}

if (markAllLessons === "y") {
  const requests = [];
  for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
    const lesson = getLessonNumber(lessonNum);
    const activity = lessonNum.toString().padStart(2, "0");
    const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
    const requestData = createRequestData(unit, lesson, activity, fileName);
    requests.push(postRequest(requestData));
  }

  Promise.all(requests)
    .then(() => {
      alert("Happy hacking! Please reload the page.");
    })
    .catch((error) => {
      console.error("Error during requests:", error);
    });
} else {
  const promptLesson = parseInt(prompt("レッスン番号を入力してください (例: 5)"), 10);
  const lesson = getLessonNumber(promptLesson);
  const activity = promptLesson.toString().padStart(2, "0");
  const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
  const requestData = createRequestData(unit, lesson, activity, fileName);

  postRequest(requestData)
    .then(() => {
      alert("Happy hacking! Please reload the page.");
    })
    .catch((error) => {
      console.error("Error during request:", error);
    });
}
