from flask import Flask, jsonify, request
app = Flask(__name__)


@app.route('/hello', methods=['POST'])
def hello_name():
    data = request.get_json()
    username = data.get('username')
    return jsonify({'message': f"Hello {username}!"})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
