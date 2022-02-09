INSERT INTO users (name, email, password)
VALUES ('Bruce Wayne', 'im_not_batman@yahoo.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Leon Kennedy', 'ashley_please@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Shinji Ikari', 'screw_you_dad@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'Wayne Manor', 'description', 'https://fakeimg.pl/100/', 'https://fakeimg.pl/300/', 3000, 12, 10, 8, 'USA', 'Billionaire St.', 'Gotham', 'Washington', 'X9ZA1B'),
(2, 'Spooky Castle', 'description', 'https://fakeimg.pl/100/', 'https://fakeimg.pl/300/', 4000, 16, 15, 12, 'Spain', 'Secret Rd.', 'Madrid', 'Madrid', 'X8ZA2B'),
(3, 'NERV HQ', 'description', 'https://fakeimg.pl/100/', 'https://fakeimg.pl/300/', 12000, 90, 85, 94, 'Japan', 'EVA Ct.', 'Tokyo-3', 'Kanto', 'X7ZA3C');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 1),
('2020-11-11', '2020-12-01', 3, 2),
('2021-08-15', '2021-08-26', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 4, 'message'),
(2, 3, 2, 3, 'message'),
(3, 1, 3, 1, 'message');