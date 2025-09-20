CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intern_id BIGINT UNSIGNED NOT NULL,
    program_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    internship_type ENUM('onsite', 'remote', 'hybrid') NOT NULL,
    resume_file VARCHAR(255) NOT NULL,
    portfolio_file VARCHAR(255) NULL,
    status ENUM(
        'pending', 
        'request_application', 
        'request_document', 
        'acceptance_terms', 
        'success', 
        'confirm', 
        'cancel', 
        'reject'
    ) NOT NULL DEFAULT 'pending',
    status_due_date DATE NULL,
    application_id VARCHAR(20) NOT NULL UNIQUE,
    submitted_at TIMESTAMP NULL,
    request_application_submitted_at TIMESTAMP NULL,
    request_document_submitted_at TIMESTAMP NULL,
    acceptance_terms_submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_intern FOREIGN KEY (intern_id) REFERENCES interns(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES intern_programs(id) ON DELETE CASCADE ON UPDATE CASCADE
);
