from flask import Flask, render_template, url_for, request, redirect, flash, jsonify, session
from uuid import uuid1 as get_mac
from cloud_control import *
from werkzeug.datastructures import ImmutableMultiDict
import datetime

app = Flask(__name__)

unit = "No Units Online"
unitNum = "n/a"

@app.route('/')
def display_home():
    session['ip'] = request.environ['REMOTE_ADDR']
    session['online'] = "No Units Online"
    return render_template("index.html",
                            the_title="Galileo Test",
                            galileo_url=url_for("call_galileo"),
                            ip_url=url_for("get_my_ip"),
			    the_ip = session.get('ip', 'unknown'),
                            the_name = "Dr John Watson",
                            the_gap = ". ",
                            the_online_unit = session.get('online', 'No Online Units'),
                            the_unitNum = unitNum ,)

@app.route('/live_chart')
def call_live_chart():
        return render_template("livechart.html",
                            the_title="Galileo Test",
                            galileo_url=url_for("call_galileo"),
                            ip_url=url_for("get_my_ip"),
			    the_ip = session.get('ip', 'unknown'),
                            the_name = "Dr John Watson",
                            the_gap = ". ",
                            the_online_unit = session.get('online', 'No Online Units'),)

@app.route('/file_chart')
def call_file_chart():
        return render_template("chart.html",
                            the_title="Galileo Test",
                            galileo_url=url_for("call_galileo"),
                            ip_url=url_for("get_my_ip"),
			    the_ip = session.get('ip', 'unknown'),
                            the_name = "Dr John Watson",
                            the_gap = ". ",
                            the_online_unit = session.get('online', 'No Online Units'),)

@app.route('/xxxxxx',methods=["GET"])
def call_galileo():
    

        return render_template("index.html",
                            the_title="Galileo Test",
                            galileo_url=url_for("call_galileo"),
                            ip_url=url_for("get_my_ip"),
			    the_ip = session.get('ip', 'unknown'),
                            the_name = "Dr John Watson",
                            the_gap = ". ",
                            the_online_unit = session.get('online', 'No Online Units'),)

@app.route("/get_my_ip", methods=["POST","GET"])
def get_my_ip():
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    return '{"ip": "'+ip+'"}'

@app.route("/get_my_unit", methods=["POST","GET"])
def get_my_unit():
    with open('comments.log') as log:
        line = log.readline()[3:10]
    return '{"unit": "'+line+'"}'

@app.route("/send_info", methods=["POST"])
def send_info():
    d = request.data
    writeFile(d)
    

    return render_template("index.html",
                            the_title="Galileo Test",
                            galileo_url=url_for("call_galileo"),
                            ip_url=url_for("get_my_ip"),
			    the_ip = session.get('ip', 'unknown'),
                            the_name = "Dr John Watson",
                            the_gap = ". ",
                            the_online_unit = session.get('online', 'No Online Units again'),
                            the_unit = unit,
                            the_unitNum = unitNum ,)


@app.route("/call_from_galileo", methods=["POST"])
def return_hello():
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    return '{"ip": "'+ip+'"}'

def writeFile(x):
    #jsonf = json.loads(x)
    with open('comments.log', 'w') as log:
        print(x, file=log)
        




app.config['SECRET_KEY'] = 'thisismysecretkeywhichyouwillneverguesshahahahahahahaha'

if __name__ == "__main__":

    app.run(port=80, debug=True, host='0.0.0.0')
