from flask import Flask, render_template, request
import json
import db_mngr, kafka
from dbm import DBManager

app = Flask(__name__)
DBM = DBManager('demo.db')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/db/read')
def db_read():
    result = db_mngr.read()
    return json.dumps(result)

@app.route('/db/routes')
def db_read_routes():
    all_routes = DBM.read_routes()
    return json.dumps(all_routes)

@app.route('/stream/collect', methods=['POST'])
def stream_collect_data():
    if request.method == 'POST':
        json_data = request.get_json(force=True)
        kafka.write_data(json_data)
        return json.dumps(request.get_json(force=True))


if __name__ == '__main__':
    app.run(debug=True)
    #app.run()
    #app.run(host='0.0.0.0', port=80) #DOCKER
