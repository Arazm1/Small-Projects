from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_config = {
    'host': 'localhost',
    'port': 3306,
    'database': '',  # Your database name
    'user': '',      # Your username
    'password': '',  # Your password
    'autocommit': True
}

class BankAccount:
    def __init__(self, db_config):
        self.connection = mysql.connector.connect(**db_config)
        self.cursor = self.connection.cursor(dictionary=True)


    def get_balance(self):
        sql = "SELECT balance FROM bankacc WHERE id = 1"
        self.cursor.execute(sql)
        result = self.cursor.fetchone()
        if result:
            return result['balance']
        else:
            return None


    def deposit(self, amount):
        sql = "UPDATE bankacc SET balance = balance + %s WHERE id = 1"
        self.cursor.execute(sql, (amount,))
        self.connection.commit()
        return self.get_balance()


    def withdraw(self, amount):
        sql = "UPDATE bankacc SET balance = balance - %s WHERE id = 1"
        self.cursor.execute(sql, (amount,))
        self.connection.commit()
        return self.get_balance()


    def close_connection(self):
        self.cursor.close()
        self.connection.close()


account = BankAccount(db_config)





@app.route('/balance', methods=['GET'])
def show_balance():
    try:
        balance = account.get_balance()
        if balance is not None:
            return jsonify({'balance': balance}), 200
        else:
            return jsonify({'error': 'No balance found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/deposit', methods=['POST'])
def deposit():
    try:
        amount = request.json.get('amount')
        if amount is None or amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        new_balance = account.deposit(amount)
        return jsonify({'message': f'Deposited {amount}', 'new_balance': new_balance}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/withdraw', methods=['POST'])
def withdraw():
    try:
        amount = request.json.get('amount')
        if amount is None or amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        new_balance = account.withdraw(amount)
        return jsonify({'message': f'Withdrew {amount}', 'new_balance': new_balance}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/exit', methods=['POST'])
def exit_program():
    try:
        account.close_connection()
        return jsonify({'message': 'Connection closed. Thank you and goodbye!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)