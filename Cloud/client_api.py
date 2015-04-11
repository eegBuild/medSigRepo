from flask import Flask, render_template, url_for, request, redirect, flash, jsonify, session
from client_control import (validate_login, login_required, validate_admin_login,
                            admin_login_required, get_admin_org_table, get_admin_unit_table,
                            get_org_names,get_admin_unit_select, log_admin, log_user, get_user_level,
                            check_new_user_vadility, user_admin_login_required, get_org_id, insertNewUser,
                            get_patients_table, add_to_patients_table,edit_patients_table,
                            delete_patients, get_units_table, set_play, updateAllocations,isPatientAllocated,
                            set_record, set_stop, get_patients_files)
from galileo_control import (updateUnits,setAvgBeat,saveMyFile)
import datetime
import mysql.connector
import json
import codecs


sqlconfig = {
  'user': 'c00162379pb',
  'password': 'x',
  'host': 'mysql.server',
  'database': 'c00162379pb$medsig162379rt',
  'raise_on_warnings': True,
}
reader = codecs.getreader('utf-8')

app = Flask(__name__)
app.secret_key = 'thisis$%#!@mysecretkeywhichyouwillneverguessha$%#!@'


@app.route('/')
@app.route('/login',methods=['GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html',
                               message = """<p><h2>Enter Username and Password below</h2></p>""")
    return redirect(url_for('index'))

@app.route('/adminlogin',methods=['GET'])
def admin_login():
    if request.method == 'GET':
        return render_template('adminlogin.html',
                               message = """<p><h2>Enter Username and Password below</h2></p>""")
    return redirect(url_for('index'))

@app.route('/processlogin',methods=['GET','POST'])
def process_login():

    if request.method == 'GET':
        if 's_username' not in session:
            return render_template('login.html',
                               message =  """<p><h2>Enter Username and Password below</h2></p>""")
        else:
            return render_template("useradminbase.html",
                                       the_title="Home Page",
                                       the_name = "Admin %s" %(session['s_username']))
    if request.method == 'POST':
        username = request.form['user']
        password = request.form['pass']
        if(validate_login(username, password)):
            session['s_username'] = username
            session['s_password'] = password
            session['s_orgId'] = get_org_id(username)
            log_user(username)
            level = get_user_level(username)
            if level == 2:
                return render_template("useradminbase.html",
                                       the_title="Home Page",
                                       the_name = "Admin %s" %(session['s_username']),
                                       new_user_message = "Add user personal email and Password.")
            if level == 3:
                return render_template("userbase.html",
                                       the_title="Home Page",
                                       the_name = session['s_username'],)
                                       #the_name = level,)
        else:
            return render_template('login.html',
                            message = """<p><h2 style = 'color:red;'>Username and Password
                                       incorrect &nbsp;&nbsp;&nbsp;Enter details again</h2></p>""")

@app.route('/processadminlogin',methods=['GET','POST'])
def process_admin_login():

    if request.method == 'GET':
        return render_template('adminlogin.html',
                               message =  """<p><h2>Enter Username and Password below</h2></p>""")
    if request.method == 'POST':
        username = request.form['user']
        password = request.form['pass']
        if(validate_admin_login(username, password)):
            session['s_username'] = username
            session['s_password'] = password
            log_admin(username)
            return render_template("adminbase.html",
                                   the_title="Home Page",
                                   the_name = session['s_username'])
        else:
            return render_template('adminlogin.html',
                            message = """<p><h2 style = 'color:red;'>Username and Password
                                       incorrect &nbsp;&nbsp;&nbsp;Enter details again</h2></p>""")
            
            
@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    session.pop('s_username', None)
    session.pop('s_password', None)
    return redirect(url_for('login'))

@app.route('/add_new_user',methods=['GET','POST'])
@user_admin_login_required
def add_new_user():
    if request.method == 'GET':
        return render_template('addnewuser.html',
                               message =  """Add user Personal email and Password.""",
                               the_name = session['s_username'])
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['pass']
        name = request.form['name']
        org_id = get_org_id(str(session['s_username']))
        result = check_new_user_vadility(email,password)
        if result == 'x':
            insertNewUser(email,name, password, org_id)
            return render_template("adminbase.html",
                                   the_title="Home Page",
                                   the_name = session['s_username'])
        else:
            return render_template('addnewuser.html',
                               message =  result,
                               the_name = session['s_username'])
            


@app.route('/adminhome')
@admin_login_required
def admin_home():
    return render_template("adminbase.html",
                           the_title="Home",
                           the_name = session['s_username'])

@app.route('/adminorgtable',methods=['POST'])
@admin_login_required
def get_org_table():
    if request.method == 'POST':
        data = json.dumps(get_admin_org_table())
        return data

@app.route('/adminsigtable',methods=['POST'])
@admin_login_required
def get_sig_table():
    if request.method == 'POST':
        data = json.dumps(get_admin_unit_table())
        return data

@app.route('/organisationselect',methods=['POST'])
@admin_login_required
def get_org_select():
    if request.method == 'POST':
        data = json.dumps(get_org_names())
        return data

@app.route('/selectedadminunittable',methods=['POST'])
@admin_login_required
def get_admin_unit_selected():
    if request.method == 'POST':
        org_name = request.form['name']
        args =[org_name]
        data = json.dumps(get_admin_unit_select(args))
        return data
    
@app.route('/getpatientfiles',methods=['POST'])
@login_required
def get_patient_file():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        data = json.dumps(get_patients_files())
        return data

@app.route('/getpatientstable',methods=['POST'])
@login_required
def get_patient_table():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        data = json.dumps(get_patients_table(org_id))
        return data

@app.route('/addtopatientstable', methods =['POST'])
@login_required
def add_to_patient_table():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        fname = request.json['first_name']
        lname = request.json['last_name']
        ref = request.json['reference']
        data = json.dumps(add_to_patients_table(fname,lname,ref,org_id))
        return data

@app.route('/editpatientstable', methods =['POST'])
@login_required
def edit_patient_table():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        fname = request.json['first_name']
        lname = request.json['last_name']
        ref = request.json['reference']
        the_id = request.json['id']
        data = json.dumps(edit_patients_table(fname,lname,ref,the_id,org_id))
        return data

@app.route('/deletepatients', methods =['POST'])
@login_required
def delete_patient():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        the_id = request.json['id']
        data = json.dumps(delete_patients(the_id,org_id))
        return data

@app.route('/getunitstable',methods=['POST'])
@login_required
def get_unit_table():
    org_id = get_org_id(str(session['s_username']))
    if request.method == 'POST':
        data = json.dumps(get_units_table(org_id))
        return data

    
@app.route('/playpressed',methods=['POST'])
@login_required
def play_pressed():
    if request.method == 'POST':
        the_id = request.json['id']
        data = json.dumps(set_play(the_id))
        return data
  

@app.route('/recordpressed',methods=['POST'])
@login_required
def record_pressed():
        if request.method == 'POST':
            the_id = request.json['id']
            data = json.dumps(set_record(the_id))
            return data

@app.route('/stoppressed',methods=['POST'])
@login_required
def stop_pressed():
        if request.method == 'POST':
            the_id = request.json['id']
            data = json.dumps(set_stop(the_id))
            return data



@app.route('/selectedpatientunittable',methods=['POST'])
@login_required
def get_patient_unit_selected():
    if request.method == 'POST':
        unit_id = request.json['unit_id']
        pat_id = request.json['pat_id']
        args =[unit_id,pat_id]
        data = json.dumps(updateAllocations(args))
        return data


@app.route('/ispatientallocated',methods=['POST'])
@login_required
def is_patient_allocated():
    if request.method == 'POST':
        unit_id = request.json['unit_id']
        data = json.dumps(isPatientAllocated(unit_id))
        return data

## **************** Galileo calls ************************

@app.route('/unit_hello', methods = ['GET'])
def logUnit():
    #print(request)
    mac = request.args.get('mac')
    return jsonify(updateUnits(mac))

@app.route('/unit_livebeat', methods = ['GET'])
def unitBeat():
    #print(request)
    mac = request.args.get('mac')
    beat = request.args.get('beat')
    setAvgBeat(mac,beat)

@app.route('/save_file', methods = ['GET'])
def saveFile():
    #print(request)
    file_in = request.args.get('datajson')
    saveMyFile(file_in)

## ********************************************************

@app.route('/live_chart')
@login_required
def call_live_chart():
    return render_template("base.html",
                           the_title="Galileo Test",
                           the_name = session['s_username'])



if __name__ == "__main__":

    app.run(port=80, debug=True, host='0.0.0.0')
