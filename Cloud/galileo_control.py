from flask import Flask, render_template, url_for, request,redirect, flash, jsonify, session
import mysql.connector
sqlconfig = {
  'user': 'c00162379pb',
  'password': 'x',
 'host': 'mysql.server',
  'database': 'c00162379pb$medsig162379rt',
  'raise_on_warnings': True,
}


mydict = {}

## **************** Galileo calls ***********************
def updateUnits(mac):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [mac,0]
    result_sel = cursor.callproc('getUnitIdFromUnitNumber',args_sel)
    args = [result_sel[1],0]
    result_args = cursor.callproc('setUnitOnline',args)
    cnx.commit()
    args_out = [result_sel[1],1,1]
    result_out = cursor.callproc('getUnitCommands',args_out)
    mydict['rec'] = result_out[1]
    mydict['play'] = result_out[2]
    cursor.close()
    cnx.close()
    return mydict

def setAvgBeat(mac,beat):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    args_sel = [mac,0]
    result_sel = cursor.callproc('getUnitIdFromUnitNumber',args_sel)
    args = [result_sel[1],beat]
    cursor.callproc('setUnitAvgBeat',args)
    cnx.commit()
    cursor.close()
    cnx.close()

def saveMyFile(FileIn):
    cnx = mysql.connector.connect(**sqlconfig)
    cursor = cnx.cursor()
    sql = "INSERT INTO patient_file (file) VALUES (%s); insert into patient_file_has_patient(patient_file_id,patient_id) values(LAST_INSERT_ID(),4)"
    for result in cursor.execute(sql, (FileIn,), multi=True):
        pass
    cnx.commit()
    mydict = cursor.statement()
    cursor.close()
    cnx.close()


