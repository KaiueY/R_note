-- 创建数据库
CREATE DATABASE IF NOT EXISTS mynote DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mynote;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别: 0-未设置, 1-男, 2-女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `signature` VARCHAR(255) DEFAULT NULL COMMENT '个性签名',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户设置表
CREATE TABLE IF NOT EXISTS `user_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `theme` VARCHAR(20) DEFAULT 'light' COMMENT '主题: light, dark',
  `language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言',
  `notification` BOOLEAN DEFAULT TRUE COMMENT '是否开启通知',
  `auto_sync` BOOLEAN DEFAULT TRUE COMMENT '是否自动同步',
  `data_backup` BOOLEAN DEFAULT FALSE COMMENT '是否数据备份',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_settings_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户设置表';

-- 账单表
CREATE TABLE IF NOT EXISTS `bills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `type_id` INT NOT NULL COMMENT '账单类型ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额',
  `date` DATE NOT NULL COMMENT '账单日期',
  `is_income` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否收入',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date` (`date`),
  CONSTRAINT `fk_bill_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账单表';

-- 账单类型表
CREATE TABLE IF NOT EXISTS `bill_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '类型名称',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标名称',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账单类型表';

-- 插入默认账单类型数据
INSERT INTO `bill_types` (`name`, `icon`) VALUES
('Food', 'note-food'),
('Transport', 'note-transport'),
('Entertainment', 'note-entertainment'),
('Shopping', 'note-shopping'),
('Medical', 'note-medical'),
('Education', 'note-education'),
('Housing', 'note-housing'),
('Utilities', 'note-utilities'),
('Travel', 'note-travel'),
('Other', 'note-bill');