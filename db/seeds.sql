INSERT INTO department
    (name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles 
    (title, salary, department_id)
VALUES
("Sales Lead", 75000, 1),
("Marketing Agent", 60000, 1),
("Software Engineer", 100000, 2),
("Full Stack Developer", 80000, 2),
("Finance Advisor", 90000, 3),
("Accountant", 70000, 3),
("Assistant", 50000, 4),
("Lawyer", 105000, 4);


INSERT INTO employee 
    (first_name, last_name, roles_id, manager_id)
VALUES
("Tavian", "Dawson", 1, NULL),
("Phil", "Phillips", 2, 1),
("Steve", "Rogers", 3, NULL),
("Kelly", "Henning", 4, 3),
("Billy", "Geis", 5, NULL),
("DeShaun", "Markus", 6, 5),
("Penelope", "James", 7, 8),
("Jonathan", "Flegel", 8, NULL);



