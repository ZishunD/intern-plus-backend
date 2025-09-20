CREATE TABLE IF NOT EXISTS interns (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    password VARCHAR(255),
    provider ENUM('local', 'google', 'facebook') DEFAULT 'local',
    provider_id VARCHAR(255),
    avatar_url VARCHAR(255),
    status ENUM('guest', 'pending', 'onboarded', 'offboarded') DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
