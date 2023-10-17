/* CREATE DATABASE sw1pizarra;

USE sw1pizarra; */

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  PRIMARY KEY (id),
  username VARCHAR(30) NOT NULL,
  correo varchar(100) not NULL,
  password VARCHAR(60) NOT NULL
);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE users ADD COLUMN tokenU varchar(500);  

SELECT * FROM users;

-- salas TABLE
CREATE TABLE salas (
  id INT(11) NOT NULL ,
  PRIMARY KEY (id),
  title VARCHAR(100) NOT NULL,
  xml TEXT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE salas ADD COLUMN tokenS varchar(500);

ALTER TABLE salas
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

CREATE TABLE userSalas ( 
  id int(11) NOT null PRIMARY KEY AUTO_INCREMENT, 
  user_id int(11) not NULL, 
  salas_id int(11) not NULL, 
  FOREIGN KEY(user_id) REFERENCES users(id), 
  FOREIGN KEY(salas_id) REFERENCES salas(id) 
);