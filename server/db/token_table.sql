-- 创建用户Token表，用于存储Refresh Token
USE mynote;

CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `refresh_token` VARCHAR(255) NOT NULL COMMENT '刷新令牌',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_refresh_token` (`refresh_token`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_token_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户Token表';