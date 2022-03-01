from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask import request
from flask_bootstrap import Bootstrap
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import string
import random
from flask_wtf import FlaskForm
from wtforms.fields.simple import PasswordField
from wtforms.validators import InputRequired, Length
from flask_login import login_required, LoginManager, UserMixin, login_user
from config import MAIL_KEY, S_KEY

app = Flask(__name__)
app.config['SECRET_KEY'] = S_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.sqlite3'
app.config['SQLALCHEMY_BINDS'] = {'two' : 'sqlite:///slots.sqlite3', 'three' : 'sqlite:///spots.sqlite3'}

Bootstrap(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

db = SQLAlchemy(app)

class Slot(db.Model):
    __bind_key__ = 'two'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=False, nullable=False)
    timeslot = db.Column(db.String(120), unique=True, nullable=False)
    cancelID = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"{self.timeslot}"

class Login(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(80))

    def __repr__(self):
        return f"id: {self.id}, password: {self.password}"

class Spot(db.Model):
    __bind_key__ = 'three'
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(120), unique=True, nullable=False)
    time = db.Column(db.String(300), nullable=False)

    def __repr__(self):
        return f"id: {self.id}, day: {self.day}, time: {self.time}"

class LoginForm(FlaskForm):
    password = PasswordField('password', validators=[InputRequired(), Length(min=8,max=80)])

@login_manager.user_loader
def load_user(id):
    return Login.query.get(int(id))

@app.route("/login", methods = ['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        current = Login.query.filter_by(password=form.password.data).first()
        if current:
            login_user(current)
            return redirect(url_for('admin'))
        return "Invalid password"
    return render_template('login.html',form=form)

@app.route("/")
def home():
    slots = Slot.query.all()
    return render_template("index.html", slots=slots)

@app.route("/enroll")
def enroll():
    res = Slot.query.all()
    spots = Spot.query.all()
    return render_template("result.html", res=res, spots=spots) 

def checkTakenDates():
    res = []
    ls = Slot.query.all()
    for i in ls:
        res += ls[10:]
    return res

def convertTime(inputtime):
    res = ""
    for idx,val in enumerate(inputtime):
        if inputtime[idx] == "-":
            res += "_"
        elif inputtime[idx] != ":":
            res += inputtime[idx]
    return res
        
def convertDate(inputdate):
    res = ""
    res += inputdate[0:2]
    res += "_"
    month_name = inputdate[3:6]
    datetime_object = datetime.datetime.strptime(month_name, "%b")
    month_number = datetime_object.month
    if month_number < 10:
        res += "0"
    res += str(month_number)
    res += "_"
    res += inputdate[7:]
    str2 = res[6:]
    str3 = res[:2]
    str1 = res[2:6]
    res = str2 + str1 + str3
    return res

def removeSpaces(inputline):
    inputline = inputline.replace(" ", "_")
    return inputline

@app.route("/cancel/<cancelID>")
def cancelSlot(cancelID):
    cancel = Slot.query.filter_by(cancelID = cancelID).first_or_404()
    db.session.delete(cancel)
    db.session.commit()
    return render_template('cancel.html', cancel=cancel)

@app.route("/admin", methods=["GET","POST"])
@login_required
def admin():
    if request.method == "POST":
        form_name = request.form['form-name']
        if form_name == 'Submit':
            placeholderDate = "20 Oct 2022"
            slots = Slot.query.all()
            spots = Spot.query.all()  
            spotdate = request.form.get("spotdate")
            spotstart = request.form.get("spotstart")
            spotend = request.form.get("spotend")
            if spotdate == None and spotstart == None and spotend == None:
                spotdate = placeholderDate
                spotstart = "00:00"
                spotend = "01:00"
            date, newtime = convertSpot(spotdate,spotstart,spotend)
            exists = db.session.query(Spot).filter_by(day=date).first() is not None
            if exists:
                chosenday = Spot.query.filter_by(day=date).first()
                chosenday.time = chosenday.time + "," + newtime
                db.session.commit()
                return redirect('/admin')
            else:
                newday = Spot(day=date, time=newtime)
                db.session.add(newday)
                db.session.commit()
                return redirect('/admin')
        else:
            slotdate = request.form.get("spotdate")
            spottime = request.form.get("spottime")
            spotdate = slotdate[8:10] + "_" + slotdate[5:7] + "_" + slotdate[0:4]
            exists = db.session.query(Spot).filter_by(day=spotdate).first() is not None
            if exists:
                entry = db.session.query(Spot).filter_by(day=spotdate).first()
                if spottime in entry.time:
                    entry.time = entry.time.replace(spottime, '')
                    db.session.commit()
                    if entry.time == '':
                        db.session.delete(entry)
                        db.session.commit()
                    else:
                        entry.time = entry.time[1:]
                        db.session.commit()
                inSlot = slotdate + "_" + spottime
                exists = db.session.query(Slot).filter_by(timeslot=inSlot).first() is not None
                if exists:
                    slotEntry = db.session.query(Slot).filter_by(timeslot=inSlot).first()
                    email = slotEntry.email
                    timeslot = slotEntry.timeslot
                    db.session.delete(slotEntry)
                    db.session.commit()

                    message = MIMEMultipart("alternative")
                    message["Subject"] = "Uw inschrijving is geannuleerd"
                    message["From"] = "snelinschrijven@gmail.com"
                    message["To"] = email
                    text = f'You reservation at: {timeslot} has been cancelled by the owner. For more information about please contact the owner.'
                    html = f'You reservation at: {timeslot} has been cancelled by the owner. For more information about please contact the owner.'

                    part1 = MIMEText(text, "plain")
                    part2 = MIMEText(html, "html")

                    message.attach(part1)
                    message.attach(part2)

                    server = smtplib.SMTP("smtp.gmail.com", 587)
                    server.starttls()
                    server.login("snelinschrijven@gmail.com", MAIL_KEY)
                    server.sendmail("snelinschrijven@gmail.com", email, message.as_string())
            
            return redirect('/admin')
    else:
        slots = Slot.query.all()
        spots = Spot.query.all()
        return render_template("admin.html", slots=slots, spots=spots)

def convertSpot(date,start,end):
    month = date[3:6]
    datetime_object = datetime.datetime.strptime(month, "%b")
    month_number = str(datetime_object.month)
    if len(month_number) < 2:
        month_number = "0" + month_number
    start = start[0:2] + start[3:5]
    end = end[0:2] + end[3:5]
    spotdate = date[0:2] + "_" + str(month_number) + "_" + date[7:11]
    spottime = start + "_" + end
    return spotdate, spottime

def generateCancelID():
    randomID = ''.join(random.choices(string.ascii_lowercase + string.digits, k=100))
    return randomID

@app.route("/form", methods = ["POST", "GET"])
def form():
    if request.method == "POST":
        if request.form['submit_button'][12:] not in checkTakenDates():
            generatedCancelID = generateCancelID()
            new_slot = Slot(name = removeSpaces(request.form['name']), email = removeSpaces(request.form['email']), cancelID = generatedCancelID, timeslot = convertDate(request.form['submit_button'][:11]) + "_" + convertTime(request.form['submit_button'][12:]))
            exists = db.session.query(Slot.id).filter_by(timeslot = convertDate(request.form['submit_button'][:11]) + "_" + convertTime(request.form['submit_button'][12:])).first() is not None
            if not exists:
                db.session.add(new_slot)
                db.session.commit()

                email = removeSpaces(request.form['email'])
                timeslot = {request.form["submit_button"]}
                message = MIMEMultipart("alternative")
                message["Subject"] = "Uw inschrijving"
                message["From"] = "snelinschrijven@gmail.com"
                message["To"] = email
                text = f'You have a reservation for: {timeslot}. Use the following link to cancel your reservation: https://snelinschrijven.herokuapp.com/cancel/{generatedCancelID}'
                html = f'You have a reservation for: {timeslot}. Use the following link to cancel your reservation: https://snelinschrijven.herokuapp.com/cancel/{generatedCancelID}'

                part1 = MIMEText(text, "plain")
                part2 = MIMEText(html, "html")

                message.attach(part1)
                message.attach(part2)

                server = smtplib.SMTP("smtp.gmail.com", 587)
                server.starttls()
                server.login("snelinschrijven@gmail.com", MAIL_KEY)
                server.sendmail("snelinschrijven@gmail.com", email, message.as_string())
            return redirect('/enroll')
        else:
            return redirect('/enroll')
    else:
        slots = Slot.query.all()
        return render_template("form.html", slots = slots) 

if __name__ == "__main__":
    db.create_all()
    app.run()