from flask import Flask, jsonify, request, render_template, url_for, redirect
import mysql.connector
import bcrypt
app = Flask(__name__)

def get_db_connection():
    connection = mysql.connector.connect(
        host='mysql',
        user='root',
        password='huysql2004',
        database='db1'
    )
    return connection

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user:
            return redirect(url_for('index'))
        else:
            return "Login failed"
    if request.method == 'GET':
        return render_template('login.html')




@app.route('/message', methods=['POST'])
def message(): 
    message = 'Hello'
    data = request.get_json()
    username = data.get('username')
    return jsonify({'message': f'{message} {username}'})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
