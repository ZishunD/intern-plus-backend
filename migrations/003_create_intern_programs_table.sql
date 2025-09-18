CREATE TABLE IF NOT EXISTS intern_programs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hr_account_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    open_date DATE,
    close_date DATE,
    total_positions INT,
    category VARCHAR(100),
    status ENUM('open', 'paused', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hr_account
      FOREIGN KEY (hr_account_id)
      REFERENCES hr_accounts(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

INSERT INTO intern_programs
    (hr_account_id, title, description, category, total_positions)
VALUES
    (
        1567952,
        'HR Trainee',
        'Hi, Vanness Plus consulting Co., Ltd. is now recruiting interns. Internships can be done in both Work from home, On-site, and Hybrid with allowances. The office is located at Liberty Square Building, near BTS Sala Daeng/MRT Silom.',
        'human resources',
        3
    ),
    (
        1567952,
        'HRD Trainee',
        'Hi, Vanness Plus consulting Co., Ltd. is now recruiting interns. Internships can be done in both Work from home, On-site, and Hybrid with allowances. The office is located at Liberty Square Building, near BTS Sala Daeng/MRT Silom.',
        'human resources',
        2
    ),
    (
        1567952,
        'Administrative Trainee',
        'Hi, Vanness Plus consulting Co., Ltd. is now recruiting interns. Internships can be done in both Work from home, On-site, and Hybrid with allowances. The office is located at Liberty Square Building, near BTS Sala Daeng/MRT Silom.',
        'human resources',
        2
    ),
    (
        1567952,
        'Management Trainee',
        'Hi, Vanness Plus consulting Co., Ltd. is now recruiting interns. Internships can be done in both Work from home, On-site, and Hybrid with allowances. The office is located at Liberty Square Building, near BTS Sala Daeng/MRT Silom.',
        'human resources',
        1
    ),
    (
        1567952,
        'Secretary Trainee',
        'Hi, Vanness Plus consulting Co., Ltd. is now recruiting interns. Internships can be done in both Work from home, On-site, and Hybrid with allowances. The office is located at Liberty Square Building, near BTS Sala Daeng/MRT Silom.',
        'human resources',
        1
    );
