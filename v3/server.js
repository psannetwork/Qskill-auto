import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fetch from 'node-fetch';

const app = express();
const PORT = 5921;
const usersDir = path.join(__dirname, 'users');

// ユーザーディレクトリを確認または作成
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

// JSON データを解析
app.use(express.json());
app.use(express.static('public'));

// POST エンドポイント
app.post('/submit', async (req, res) => {
  const { cookie, unit, score, lesson, studentId, bookId } = req.body;

  // 必須フィールドの確認
  if (!cookie || !unit || !score || !lesson) {
    return res.status(400).json({ error: '必須フィールド (cookie, unit, score, lesson) を入力してください。' });
  }

  // デフォルト値の適用
  const validStudentId = studentId || '0'; //2751883
  const validBookId = bookId || '129'; //129

  // データ保存
  const userData = { cookie, studentId: validStudentId, bookId: validBookId };
  const userFilePath = path.join(usersDir, `${validStudentId}.json`);
  fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));

  // API リクエストデータ作成
  const requestData = {
    data: JSON.stringify({
      activityAttempts: [
        {
          data: JSON.stringify({
            order: 1,
            maxScore: score,
            state: '<state><question><answer index="2" selected="true">protect</answer></question></state>',
          }),
          unit: unit.toString().padStart(2, '0'),
          lesson: lesson.toString().padStart(2, '0'),
          activity: lesson.toString().padStart(2, '0'),
          fileName: `iQ3e_RW1_${unit.toString().padStart(2, '0')}_${lesson.toString().padStart(2, '0')}`,
          time: 45,
          activityType: 'mc_questions_single_image',
          score,
          studentId: validStudentId,
        },
      ],
    }),
    unit: unit.toString().padStart(2, '0'),
    lesson: lesson.toString().padStart(2, '0'),
    activity: lesson.toString().padStart(2, '0'),
    fileName: `iQ3e_RW1_${unit.toString().padStart(2, '0')}_${lesson.toString().padStart(2, '0')}`,
    time: 45,
    activityType: 'mc_questions_single_image',
    score,
    studentId: validStudentId,
  };

  // ヘッダー
  const headers = {
    'content-type': 'application/json',
    cookie,
  };

  try {
    // API 送信
    const response = await fetch(`https://q3e.oxfordonlinepractice.com/api/books/${validBookId}/activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });
    const result = await response.json();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'API リクエストに失敗しました。', details: error.message });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました。`);
});
