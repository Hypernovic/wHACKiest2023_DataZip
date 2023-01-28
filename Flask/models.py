from sqlalchemy import inspect
from flask_login import UserMixin
from app import db
from flask import Flask, render_template
from flask import jsonify, request
from datetime import datetime
from sqlalchemy import func
import json
from flask_sqlalchemy import SQLAlchemy


class User(UserMixin,db.Model):
    __tablename__='Users'
    id=db.Column(db.Integer, primary_key=True)
    userName=db.Column(db.String(50), nullable=False)
    password=db.Column(db.Text, nullable=False)
    pic=db.Column(db.Text, nullable=False)
    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

class Repo(db.Model):
    __tablename__='Repos'
    repoId=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.Text,nullable=False)
    desc=db.Column(db.Text,nullable=False)
    repoOwner=db.Column(db.Integer, db.ForeignKey("Users.id", ondelete='CASCADE'), nullable=False)
    repoLocation=db.Column(db.Text,nullable=False)
    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

class AllowList(db.Model):
    __tablename__="AllowList"
    id=db.Column(db.Integer,primary_key=True)
    userId=db.Column(db.Integer, db.ForeignKey("Users.id", ondelete='CASCADE'), nullable=False)
    repoId=db.Column(db.Integer, db.ForeignKey("Repos.repoId", ondelete='CASCADE'), nullable=False)
    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }