from flask import Flask, render_template, request, jsonify
import requests
import json
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    # フォームからデータを取得
    studentId = request.form.get('studentId', '2751883')
    bookId = request.form.get('bookId', '129')
    
    # unit, score, lesson を取得
    try:
        unit = int(request.form.get('unit', '1'))  # 空の場合デフォルト値1
        score = int(request.form.get('score', '0'))  # 空の場合デフォルト値0
    except ValueError:
        return jsonify({"Error": "unit と score は整数でなければなりません。"})

    markAllLessons = request.form.get('markAllLessons', 'n').lower()
    lesson_input = request.form.get('lesson', None)
    cookie_input = request.form.get('cookie')

    # Cookieの設定
    cookies = {
        "cookie": cookie_input
    }

    # レッスン番号を計算する関数
    def get_lesson_number(lesson):
        if lesson == 1:
            return "01"
        elif 2 <= lesson <= 9:
            return "02"
        elif 10 <= lesson <= 14:
            return "03"
        elif lesson in [15, 16]:
            return "04"
        else:
            raise ValueError("無効なレッスン番号が指定されました。レッスン番号は1～16の範囲で指定してください。")

    # ランダムオフセットを生成する関数
    def get_random_offset(min_val, max_val):
        return random.randint(min_val, max_val)

    # リクエストデータを生成する関数
    def create_request_data(unit, lesson, activity, file_name):
        order = 1 + get_random_offset(0, 5)  
        time = 40 + get_random_offset(0, 5)
        
        state = """
        <state>
            <question><answer index="0"/><answer index="1"/><answer index="2" selected="true">protect</answer></question>
            <question><answer index="0"/><answer index="1" selected="true">surprise</answer><answer index="2"/></question>
            <question><answer index="0"/><answer index="1"/><answer index="2" selected="true">pretend</answer></question>
            <question><answer index="0"/><answer index="1" selected="true">serious</answer><answer index="2"/></question>
            <question><answer index="0"/><answer index="1" selected="true">effect</answer><answer index="2"/></question>
            <question><answer index="0"/><answer index="1" selected="true">rate</answer><answer index="2"/></question>
            <question><answer index="0"/><answer index="1" selected="true">whole</answer><answer index="2"/></question>
            <question><answer index="0"/><answer index="1" selected="true">effect</answer><answer index="2"/></question>
            <attempts>-1</attempts>
        </state>
        """

        request_data = {
            "data": json.dumps({
                "activityAttempts": [
                    {
                        "data": json.dumps({
                            "order": order,
                            "maxScore": score,
                            "state": state
                        }),
                        "unit": str(unit).zfill(2),
                        "lesson": lesson,
                        "activity": activity,
                        "fileName": file_name,
                        "time": time,
                        "activityType": "mc_questions_single_image",
                        "score": score,
                        "studentId": studentId
                    }
                ],
                "order": order,
                "maxScore": score,
                "state": state
            }),
            "unit": str(unit).zfill(2),
            "lesson": lesson,
            "activity": activity,
            "fileName": file_name,
            "time": time,
            "activityType": "mc_questions_single_image",
            "score": score,
            "studentId": studentId
        }
        
        return request_data

    # APIエンドポイント
    url = f"https://q3e.oxfordonlinepractice.com/api/books/{bookId}/activities"

    if markAllLessons == "y":
        results = []
        for lesson_num in range(1, 17):
            lesson = get_lesson_number(lesson_num)
            activity = str(lesson_num).zfill(2)

            file_name = f"iQ3e_RW1_{str(unit).zfill(2)}_{lesson}_{activity}"

            request_data = create_request_data(unit, lesson, activity, file_name)

            # APIリクエストの送信
            response = requests.post(url, json=request_data, headers={'Content-Type': 'application/json'}, cookies=cookies)
            if response.status_code == 200:
                results.append(f"Lesson {lesson_num} - Success")
            else:
                results.append(f"Lesson {lesson_num} - Error: {response.status_code}")
        return jsonify(results)
    else:
        if lesson_input:
            lesson = get_lesson_number(int(lesson_input))
            activity = str(int(lesson_input)).zfill(2)

            file_name = f"iQ3e_RW1_{str(unit).zfill(2)}_{lesson}_{activity}"
            request_data = create_request_data(unit, lesson, activity, file_name)

            # APIリクエストの送信
            response = requests.post(url, json=request_data, headers={'Content-Type': 'application/json'}, cookies=cookies)

            if response.status_code == 200:
                return jsonify({"Success": response.json()})
            else:
                return jsonify({"Error": response.status_code, "Message": response.text})
        else:
            return jsonify({"Error": "レッスン番号が指定されていません。"})

if __name__ == '__main__':
    app.run(debug=True, port=5921)
