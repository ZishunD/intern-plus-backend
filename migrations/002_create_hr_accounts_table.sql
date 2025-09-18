CREATE TABLE IF NOT EXISTS hr_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255),
    position VARCHAR(255),
    password VARCHAR(255),
    provider ENUM('local', 'google', 'facebook') DEFAULT 'local',
    provider_id VARCHAR(255),
    avatar_url VARCHAR(255),
    package ENUM('free', 'standard', 'premium') DEFAULT 'free',
    status ENUM('active', 'inactive') DEFAULT 'inactive',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mock 数据
INSERT INTO hr_accounts 
    (id, company_name, first_name, last_name, email, phone_number, position, password, provider, provider_id, avatar_url, package, status, verified)
VALUES
    (1567952, 'Vanness Plus Consulting Co., Ltd.', 'John', 'Doe', 'hr@vannessplus.com', '0123456789', 'HR Manager', NULL, 'local', NULL, NULL, 'standard', 'active', true);
