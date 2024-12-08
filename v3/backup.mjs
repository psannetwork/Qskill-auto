import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';

// ローカルストレージ代替（JSONファイルとして保存）
const storageFile = './storage.json';

// ストレージの読み込みと保存
function loadStorage() {
  if (fs.existsSync(storageFile)) {
    return JSON.parse(fs.readFileSync(storageFile, 'utf8'));
  }
  return {};
}

function saveStorage(data) {
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2));
}

// ユーザー入力
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// ストレージデータの初期化
const storage = loadStorage();
let studentId = storage.studentId || '';
let bookId = storage.bookId || '';

// 学生 ID を確認
async function initialize() {
  if (!studentId) {
    studentId = await askQuestion("studentId を入力してください (空の場合はデフォルト値 2751883 を使用): ");
    if (!studentId) studentId = "2751883";
    storage.studentId = studentId;
    saveStorage(storage);
  }

  if (!bookId) {
    bookId = await askQuestion("bookId を入力してください (空の場合はデフォルト値 129 を使用): ");
    if (!bookId) bookId = "129";
    storage.bookId = bookId;
    saveStorage(storage);
  }
}

// レッスン番号取得
function getLessonNumber(lesson) {
  if (lesson === 1) return "01";
  if (lesson >= 2 && lesson <= 9) return "02";
  if (lesson >= 10 && lesson <= 14) return "03";
  if (lesson === 15 || lesson === 16) return "04";
  console.error("無効なレッスン番号が指定されました");
  throw new Error("レッスン番号は 1 ～ 16 の範囲で指定してください。");
}

// ランダムオフセット
function getRandomOffset(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// リクエストデータ生成
function createRequestData(unit, lesson, activity, fileName, score, studentId) {
  const order = 1 + getRandomOffset(0, 5);
  const time = 40 + getRandomOffset(0, 5);

  return {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order,
            maxScore: score,
            state: "<state><question><answer index=\"2\" selected=\"true\">protect</answer></question></state>"
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
      ]
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

const headers = {
  //accept: 'application/json, text/plain, */*',
  //'accept-encoding': 'gzip, deflate, br, zstd',
  //'accept-language': 'ja,ca;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/json',
  cookie: 'oup-cookie=1_24-11-2024; _hjSessionUser_1961605=eyJpZCI6IjFjMTEzZGUxLTc4YTYtNTIwYi05NzEwLWIzMWE5Yjg1MTI5MCIsImNyZWF0ZWQiOjE3MzI0MzYxNzcyODcsImV4aXN0aW5nIjp0cnVlfQ==; _gid=GA1.2.248432956.1733646961; _hjSession_1961605=eyJpZCI6IjM2MTI4Y2ZjLWY2ZTItNDdhNi1hNmU2LTUwZGU4NjZkZDk2NSIsImMiOjE3MzM2NDY5NjM0MjYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; authsessionId=f4097b53-da86-46e5-8770-6196fdde2b43; CSRFCOOKIES=Rvb9rpzqP1IoI0ycQdTz; _ga=GA1.2.1287498366.1732436175; _ga_16W43F8611=GS1.2.1733646965.10.1.1733647239.0.0.0; _ga_GWWWLE5G38=GS1.1.1733646960.10.1.1733647240.0.0.0; _ga_LECR1RJLD9=GS1.1.1733646960.10.1.1733647243.0.0.0',
  //origin: 'https://q3e.oxfordonlinepractice.com',
  //referer: 'https://q3e.oxfordonlinepractice.com/app/dashboard/book/129/unit/01/lesson/02/activity/03',
  //'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  //'sec-ch-ua-mobile': '?0',
  //'sec-ch-ua-platform': '"Chrome OS"',
  //'user-agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  //timezone: '12-08-2024 17:41:13+0900'
};

// メイン処理
async function main() {
  await initialize();

  const unit = parseInt(await askQuestion("ユニット番号を入力してください (例: 4): "), 10);
  const score = parseInt(await askQuestion("スコアを入力してください (例: 8): "), 10);
  const markAllLessons = (await askQuestion("このユニットすべてをマークしますか？ (y/n): ")).toLowerCase();

  if (markAllLessons === 'y') {
    for (let lessonNum = 1; lessonNum <= 16; lessonNum++) {
      const lesson = getLessonNumber(lessonNum);
      const activity = lessonNum.toString().padStart(2, "0");
      const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

      const requestData = createRequestData(unit, lesson, activity, fileName, score, studentId);
      await fetchActivity(requestData, bookId);
    }
  } else {
    const promptLesson = parseInt(await askQuestion("レッスン番号を入力してください (例: 5): "), 10);
    const lesson = getLessonNumber(promptLesson);
    const activity = promptLesson.toString().padStart(2, "0");
    const fileName = `iQ3e_RW1_${unit.toString().padStart(2, "0")}_${lesson}_${activity}`;

    const requestData = createRequestData(unit, lesson, activity, fileName, score, studentId);
    await fetchActivity(requestData, bookId);
  }

  rl.close();
}

// API リクエスト送信
async function fetchActivity(requestData, bookId) {
  try {
    const response = await fetch(`https://q3e.oxfordonlinepractice.com/api/books/${bookId}/activities`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData)
    });
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 実行
main().catch(console.error);
