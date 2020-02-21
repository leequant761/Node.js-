CREATE SCHEMA nodejs;
use nodejs;

CREATE TABLE nodejs.users (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(20) NOT NULL,
age INT UNSIGNED NOT NULL,
married TINYINT NOT NULL,
comment TEXT NULL,
created_at DATETIME NOT NULL DEFAULT now(),
PRIMARY KEY(id),
UNIQUE INDEX name_UNIQUE (name ASC))
COMMENT = '사용자 정보'
DEFAULT CHARSET=utf8
ENGINE=InnoDB;

DESC users;
DROP TABLE users;

CREATE TABLE nodejs.comments (
id INT NOT NULL AUTO_INCREMENT,
commenter INT NOT NULL,
comment VARCHAR(100) NOT NULL,
created_at DATETIME NOT NULL DEFAULT now(),
PRIMARY KEY(id),
INDEX commenter_idx (commenter ASC),
CONSTRAINT commenter
FOREIGN KEY (commenter)
REFERENCES nodejs.users (id)
ON DELETE CASCADE -- if a record in the parent table is deleted, then the corresponding records in the child table will automatically be deleted.
ON UPDATE CASCADE)
COMMENT= '댓글'
DEFAULT CHARSET=utf8
ENGINE=InnoDB;

SHOW TABLES;

# CREATE
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('nero', 32, 1, '자기소개2');

INSERT INTO nodejs.comments (commenter, comment) VALUES (1, '안녕하세요. zero의 댓글입니다');

# READ
SELECT * FROM nodejs.users;
SELECT * FROM nodejs.comments;

SELECT name, married FROM nodejs.users;

SELECT name, married FROM nodejs.users WHERE married = 1 AND age > 30;
SELECT name, married FROM nodejs.users WHERE married = 0 OR age > 30;

SELECT id, name FROM nodejs.users ORDER BY age DESC;
SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1;
SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1; # 건너뛸 숫자

# UPDATE
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

# DELETE
DELETE FROM nodejs.users WHERE id =2;