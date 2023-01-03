*** The server.js in this file requires a mySQL database called CS2803_Final ***

drop database if exists CS2803_Final;
create database CS2803_Final;
use CS2803_Final;

create table registeredUsers(username varchar(64) primary key, password varchar(64) not null, score int);

replace mySQL credentials in server with your own credentials, and everything should run properly! :)
