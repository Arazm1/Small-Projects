import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS



def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        port=3306,
        database='',
        user='',
        password='',
        autocommit=True
    )

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/<path:target>/', methods=['GET', 'DELETE'])
def task(target):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        if target == 'show_tasks':
            sql = "SELECT id, name, status FROM todolist"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(result)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error": str(e)}), 500




#Add task

@app.route('/add_task', methods=['POST'])
def add_task():
    try:

        data = request.get_json()
        if not data:
            return jsonify({"Error": "Invalid JSON format"}), 400
        
        task_name = data.get('input_box')
        if not task_name or not task_name.strip():
            return jsonify({"Error": "Task name is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "INSERT INTO todolist (name) VALUES (%s)"
        cursor.execute(sql, (task_name,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Task added successfully!"}), 201

    except mysql.connector.Error as db_err:
        print(f"Database Error: {db_err}")
        return jsonify({"Error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error": str(e)}), 500




#Delete task from To-Do list

@app.route('/del_task', methods=['DELETE'])
def del_task():
    try:
        data = request.get_json()
        print(f"Received JSON payload: {data}")

        if not data:
            return jsonify({"Error": "Invalid JSON format"}), 400

        task_id = data.get('id')
        if not task_id:
            return jsonify({"Error": "Task ID is required"}), 400


        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "DELETE FROM todolist WHERE id = %s"
        cursor.execute(sql, (task_id,))
        conn.commit()

        print(f"Rows affected: {cursor.rowcount}")

        if cursor.rowcount == 0:
            return jsonify({"Error": "No task found with the given ID"}), 404

        cursor.close()
        conn.close()

        return jsonify({"message": "Task removed successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error": str(e)}), 500
    



#Update task status

@app.route('/update_status', methods=['PATCH'])
def update_status():
    try:
        data = request.get_json()
        print(f"Received JSON payload: {data}")

        if not data:
            return jsonify({"Error": "Invalid JSON format"}), 400

        task_id = data.get('id')
        task_status = data.get('status')
        if not task_id or task_status is None:
            return jsonify({"Error": "Invalid data"}), 400


        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "UPDATE todolist SET status = (%s) WHERE id = (%s)"
        cursor.execute(sql, (task_status, task_id,))
        conn.commit()

        print(f"Rows affected: {cursor.rowcount}")

        if cursor.rowcount == 0:
            return jsonify({"Error": "No task found with the given ID"}), 404

        cursor.close()
        conn.close()

        return jsonify({"message": "Task status changed successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error": str(e)}), 500


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)