LOAD DATA LOCAL INFILE 'C:/Users/1/Desktop/enterprise develop/sourcs/books.csv' 
INTO TABLE mydb.books 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n' 
IGNORE 1 LINES
(title, author, genre, height, publisher, stock, price);

CREATE TABLE `mydb`.`user` (
`userid` INT  AUTO_INCREMENT,
`username` VARCHAR(50),  
`password` VARCHAR(50),
`gender` VARCHAR(20), 
`role` VARCHAR(20), 
PRIMARY KEY (`userid`)
);

CREATE TABLE `mydb`.`books` (
`book_id` INT  AUTO_INCREMENT ,
  `title` VARCHAR(150) NOT NULL ,
  `author` VARCHAR(50) ,
  `genre` VARCHAR(50) NOT NULL,
  `height` INT ,
  `publisher` VARCHAR(50) ,
  `stock` INT NOT NULL,
  `price` INT NOT NULL,
  PRIMARY KEY (`book_id`)
);

CREATE TABLE `mydb`.`wish` (
`wishid` INT  AUTO_INCREMENT,
`userid` INT  ,
`book_id` INT  ,
PRIMARY KEY (`wishid`)
);
CREATE TABLE `mydb`.`purchase` (
`purchaseid` INT  AUTO_INCREMENT,
`userid` INT  ,
`book_id` INT  ,
PRIMARY KEY (`purchaseid`)
);
CREATE TABLE `mydb`.`review` (
`reviewid` INT  AUTO_INCREMENT,
`userid` INT  ,
`book_id` INT,
`review` VARCHAR(1000), 
PRIMARY KEY (`reviewid`)
);