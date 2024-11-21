function addPromptDiv(message, inputId, buttonText, nextStepCallback) {
  const promptDiv = document.createElement('div');
  promptDiv.style.position = 'absolute';
  promptDiv.style.top = '50%';
  promptDiv.style.left = '50%';
  promptDiv.style.transform = 'translate(-50%, -50%)';
  promptDiv.style.padding = '20px';
  promptDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  promptDiv.style.color = 'white';
  promptDiv.style.borderRadius = '10px';
  promptDiv.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
  promptDiv.style.zIndex = '1000';
  promptDiv.style.fontSize = '16px';
  promptDiv.style.width = '300px';

  const promptMessage = document.createElement('div');
  promptMessage.textContent = message;
  promptMessage.style.marginBottom = '10px';
  promptDiv.appendChild(promptMessage);

  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.id = inputId;
  inputElement.style.padding = '8px';
  inputElement.style.marginBottom = '10px';
  inputElement.style.width = '100%';
  inputElement.style.border = '1px solid #ccc';
  inputElement.style.borderRadius = '5px';
  inputElement.style.fontSize = '16px';
  inputElement.style.backgroundColor = '#f9f9f9';
  inputElement.style.color = '#333';
  promptDiv.appendChild(inputElement);

  const actionButton = document.createElement('button');
  actionButton.textContent = buttonText;
  actionButton.style.padding = '8px 16px';
  actionButton.style.backgroundColor = '#4CAF50';
  actionButton.style.color = 'white';
  actionButton.style.border = 'none';
  actionButton.style.borderRadius = '5px';
  actionButton.style.cursor = 'pointer';
  actionButton.style.fontSize = '16px';
  actionButton.style.transition = 'background-color 0.3s ease';
  actionButton.onmouseover = () => actionButton.style.backgroundColor = '#45a049';
  actionButton.onmouseout = () => actionButton.style.backgroundColor = '#4CAF50';
  actionButton.onclick = () => {
    if (nextStepCallback) nextStepCallback(inputElement.value);
    promptDiv.remove();
  };
  promptDiv.appendChild(actionButton);

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '❌';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    promptDiv.remove();
  };
  promptDiv.appendChild(closeButton);

  document.body.appendChild(promptDiv);
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

addPromptDiv('©Psannetwork \n\n\n ユニット番号を入力してください (例: 4)', 'unitInput', '次へ', (unitValue) => {
  const unit = parseInt(unitValue, 10);
  addPromptDiv('このユニットすべてをマークしますか？ (y/n)', 'markAllInput', '確認', (markAllValue) => {
    const markAllLessons = markAllValue.toLowerCase();
    const requests = [];

    const sendRequest = (unit, lessonNum) => {
      const lesson = lessonNum.toString().padStart(2, '0');
      const activity = lessonNum.toString().padStart(2, '0');
      const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;
      const requestData = createRequestData(unit, lesson, activity, fileName);

      return fetch("https://q3e.oxfordonlinepractice.com/api/books/129/activities", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    };

    if (markAllLessons === 'y') {
      for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
        requests.push(sendRequest(unit, lessonNum));
      }
    } else {
      const promptLesson = parseInt(prompt("レッスン番号を入力してください (例: 5)"), 10);
      requests.push(sendRequest(unit, promptLesson));
    }

    Promise.all(requests).then(() => {
      location.reload(); // すべてのリクエストが完了したらページをリロード
    });
  });
});
