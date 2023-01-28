from flask import Blueprint, render_template
from flask_login import login_required, current_user
from flask import jsonify, request
from models import User,Repo,AllowList
from flask_sqlalchemy import SQLAlchemy
from app import db

main = Blueprint('main', __name__)
@main.route('/')
def index():
    return render_template('base.html')

@main.route(f'/profile')
@login_required
def profile():
    return render_template('profile.html',
    name=current_user.userName)





# @main.route('/Flasher')
# @login_required
# def flasher():
#     return render_template('arduino.html')

