import bcrypt
import mysql.connector
import binascii
from functools import wraps
from flask import render_template, url_for, request, redirect, flash, jsonify, session
import re

##sqlconfig = {
##  'user': 'c00162379pb',
##  'password': 'x',
##  'host': 'mysql.server',
##  'database': 'c00162379pb$medsig162379rt',
##  'raise_on_warnings': True,
##}

sqlconfig = {
  'user': 'root',
  'password': '',
  'host': '127.0.0.1',
  'database': 'c00162379pb$medsig162379rt',
  'raise_on_warnings': True,
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 's_username' not in session:
            return redirect(url_for('login', next=request.url))
        if validate_login(session['s_username'],session['s_password']) == False:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def user_admin_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 's_username' not in session:
            return redirect(url_for('login', next=request.url))
        if validate_login(session['s_username'],session['s_password']) == False and get_user_level(session['s_username']) != 2 :
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 's_username' not in session:
            return redirect(url_for('admin_login', next=request.url))
        if validate_admin_login(session['s_username'],session['s_password']) == False:
            return redirect(url_for('admin_login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def validate_login(user, password):
    password_bytes = bytes(password, "ascii")
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [user,0,1]
    try:
        result_sel = cursor.callproc('c00162379pb$medsig162379rt.getUserPass',args_sel)
    except mysql.connector.Error as err:
      if err.errno == 1329:
        return False
      else:
        raise
    if bcrypt.hashpw(password_bytes, result_sel[1]) == result_sel[1]:
        session['s_level'] = result_sel[2]
        return True
    else:
        return False
    cursor.close()
    cnx.close()

def log_user(name):
  
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [name,0]
    try:
        result_sel = cursor.callproc('c00162379pb$medsig162379rt.getUserIdFromName',args_sel)
    except mysql.connector.Error as err:
      if err.errno == 1329:
        return False
      else:
        raise
    args_sel = [result_sel[1]]
    cursor.callproc('c00162379pb$medsig162379rt.logUserLogin',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()

def get_user_level(name):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [name,0]
    try:
        result_sel = cursor.callproc('c00162379pb$medsig162379rt.getLevelByUsername',args_sel)
    except mysql.connector.Error as err:
      if err.errno == 1329:
        return False
    return result_sel[1]
    cursor.close()
    cnx.close()
    

def validate_admin_login(user, password):
    password_bytes = bytes(password, "ascii")
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [user,0]
    try:
        result_sel = cursor.callproc('c00162379pb$medsig162379rt.getAdminPass',args_sel)
    except mysql.connector.Error as err:
      if err.errno == 1329:
        return False
      else:
        raise
    if bcrypt.hashpw(password_bytes, result_sel[1]) == result_sel[1]:
        return True
    else:
        return False
    cursor.close()
    cnx.close()

def log_admin(name):
  
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [name,0]
    try:
        result_sel = cursor.callproc('c00162379pb$medsig162379rt.getAdminIdFromName',args_sel)
    except mysql.connector.Error as err:
      if err.errno == 1329:
        return False
      else:
        raise
    args_sel = [result_sel[1]]
    cursor.callproc('c00162379pb$medsig162379rt.logAdminLogin',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()

def check_new_user_vadility(email, password):
    password_regex = re.compile("(?=.*[\d])(?=.*[a-z])(?=.*[A-Z]).{6,20}")
    email_regex = re.compile("""[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}""")
    result = 'x'

    # Is the email address valid?
    if not email_regex.match(email):
        result = ("Email address not valid. Please Add User again")

    # Is the password too simple?
    elif not password_regex.match(password):
        result = ("Password length at least 6 characters and maximum of 20.\n"+
                    "Password must contain one digit from 0-9.\n"+
                    "Password must contain one lowercase character.\n"+
                    "Password must contain one uppercase character.\n"+
                    "Please Add User again.")
    # Is Email duplicated?
    elif check_user_email_match(email):
        result = ("Email address already exists. Please Add User again")

    return result

def insertNewUser(email,name, password, orgId):
    password_bytes = bytes(password, "ascii")
    storedhashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt(10))
    level = 3 
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [orgId,level,email,name,storedhashed]
    cursor.callproc('c00162379pb$medsig162379rt.insertUserPass',args_sel)
    cursor.close()
    cnx.commit()
    cnx.close()

def get_admin_org_table():
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [0]
    cursor.callproc('c00162379pb$medsig162379rt.getAdminOrgTable')
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            result.append(dict(zip(recordset.column_names,row)))
    cursor.close()
    cnx.close()
    return result

def get_admin_unit_table():
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [0]
    cursor.callproc('c00162379pb$medsig162379rt.getAdminUnitTable')
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            result.append(dict(zip(recordset.column_names,row)))
    cursor.close()
    cnx.close()
    return result

def get_org_names():
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [0]
    cursor.callproc('c00162379pb$medsig162379rt.getOrgNames')
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            result.append(dict(zip(recordset.column_names,row)))
    cursor.close()
    cnx.close()
    return result

def get_admin_unit_select(args):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [0]
    cursor.callproc('c00162379pb$medsig162379rt.getAdminUnitSelected',args)
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            result.append(dict(zip(recordset.column_names,row)))
    cursor.close()
    cnx.close()
    return result

def get_org_id(name):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [name,0]
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.getOrgId',args_sel)
    cursor.close()
    cnx.close()
    return result_sel[1]

def get_patients_table(org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [org_id]
    x = cursor.callproc('c00162379pb$medsig162379rt.getPatientTable',args_sel)
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            old = dict(zip(recordset.column_names,row))
            for k, v in old.items():
                if 'create_date' in k:
                    old[k] =(v.strftime("%y-%m-%d"))
            result.append(old)
    cursor.close()
    cnx.close()
    return result

def add_to_patients_table(fname,lname,ref,org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [fname,lname,ref,org_id]
    cursor.callproc('c00162379pb$medsig162379rt.insertPatient',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return get_patients_table(org_id)

def edit_patients_table(fname,lname,ref,the_id,org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [fname,lname,ref,the_id]
    cursor.callproc('c00162379pb$medsig162379rt.updatePatient',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return get_patients_table(org_id)

def delete_patients(the_id,org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [the_id]
    cursor.callproc('c00162379pb$medsig162379rt.deletePatient',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return get_patients_table(org_id)

def get_units_table(org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [org_id]
    x = cursor.callproc('c00162379pb$medsig162379rt.getUnitTable',args_sel)
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            old = dict(zip(recordset.column_names,row))
            for k, v in old.items():
                if 'create_date' in k:
                    old[k] =(v.strftime("%d-%m-%y"))
            result.append(old)
    cursor.close()
    cnx.close()
    return result

def get_patients_files():
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    x = cursor.callproc('c00162379pb$medsig162379rt.getPatientFiles')
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            old = dict(zip(recordset.column_names,row))
            for k, v in old.items():
                if 'save_date' in k:
                    old[k] =(v.strftime("%d-%m-%y"))
            result.append(old)
    cursor.close()
    cnx.close()
    return result

def get_pat_file(file_id):
    cnx = mysql.connector.connect(**sqlconfig)
    args =[file_id]
    cursor = cnx.cursor()
    cursor.callproc('c00162379pb$medsig162379rt.getPatientFile',args)
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            strdict = {zip(recordset.column_names,row)}
            #result.append(dict(zip(recordset.column_names,row)))
            unidict = {k.decode('utf8'): v.decode('utf8') for k, v in strdict.items()}
            result.append(unidict)
    cursor.close()
    cnx.close()
    return result

def set_play(the_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [the_id]
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.setUnitPlayOn',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return result_sel[0]

def set_record(the_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [the_id]
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.setUnitRecOn',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return result_sel[0]

def set_stop(the_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [the_id]
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.setUnitRecOff',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return result_sel[0]

def updateAllocations(args):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.updateUnitAllocation',args)
    cnx.commit()
    cursor.close()
    cnx.close()
    return result_sel[0]

def isPatientAllocated(unit_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [unit_id]
    result_sel = cursor.callproc('c00162379pb$medsig162379rt.isUnitAllocated',args_sel)
    result = []
    for recordset in cursor.stored_results():
        for row in recordset:
            result.append(dict(zip(recordset.column_names,row)))
    cursor.close()
    cnx.close()
    return result
    
    

def x(fname,lname,ref,org_id):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [fname,lname,ref,org_id]
    cursor.callproc('c00162379pb$medsig162379rt.insertPatient',args_sel)
    cnx.commit()
    cursor.close()
    cnx.close()
    return get_patients_table(org_id)

##################### Internal Functions ##############################
def check_user_email_match(email):
    result = False
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    cursor.callproc('c00162379pb$medsig162379rt.getUserEmails')
    emails = []
    for recordset in cursor.stored_results():
        for row in recordset:
            if row[0] == email:
                result = True
    cursor.close()
    cnx.close()
    return result

    
