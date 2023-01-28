from re import A
from flask import Flask, render_template
from flask import jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import requests
from flask_sqlalchemy import SQLAlchemy

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager 


from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)


ENV="dev"

if ENV=="dev":
    app.debug=True
else:
    app.debug=False

app.debug=True    


app.config['SECRET_KEY'] = 'secret-key-goes-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:12345678@localhost/gotcha'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
app.config['DEBUG'] = True


cors = CORS(app)
db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'


app.app_context().push()




from models import User

def fetchdata():
    db.drop_all()
    print("Dropped all Tables")
    db.create_all()
    print("Created new Tables")
    print("Adding new rows")
    db.session.add(User(userName="hypernovic",password=generate_password_hash("password", method='sha256'),bio="Mahn,Alls Well",pic="https://i.ibb.co/JvxvLTH/image.png"))
    createUserFolder("hypernovic")
    db.session.add(User(userName="strangerdanger",password=generate_password_hash("password", method='sha256'),bio="Mahn,Alls not Well",pic="https://i.ibb.co/PYZfpZp/Donald-Trump-official-portrait.jpg"))
    createUserFolder("strangerdanger")

    # result = db.session.query(Questions,Choices).filter(Questions.questionId==Choices.questionId,Questions.questionId==1).all()
    # print(result)
    db.session.commit()


@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(int(user_id))

# blueprint for auth routes in our app
from auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint)

# blueprint for non-auth parts of app
from main import main as main_blueprint
app.register_blueprint(main_blueprint)



AdminUser={'root':'12345678'}

from models import User,Repo,AllowList




if __name__ == '__main__':
    #app.run(threaded=True)
    #host="127.0.0.1", port=8080, threaded=True host="192.168.137.1", port=5000, threaded=True
    print("something")
    app.run(host="127.0.0.1", port="8080", threaded=True)
