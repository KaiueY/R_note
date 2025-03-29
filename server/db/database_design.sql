-- 创建数据库
CREATE DATABASE IF NOT EXISTS mynote DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mynote;

-- ----------------------------
-- 1. 用户表（保持不变）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`),
  UNIQUE KEY `idx_phone` (`phone`)
) ENGINE=InnoDB COMMENT='用户表';

-- ----------------------------
-- 2. 账单类型表（保持不变）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `bill_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '类型名称',
  `is_income` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否收入类型',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='账单类型表';

-- ----------------------------
-- 3. 支付方式表（移除 sort 字段）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '支付方式名称',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='支付方式表';

-- ----------------------------
-- 4. 账单表（移除 is_income 字段）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `bills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `type_id` INT NOT NULL COMMENT '账单类型ID',
  `payment_method_id` INT DEFAULT NULL COMMENT '支付方式ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额',
  `date` DATE NOT NULL COMMENT '账单日期',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `status` ENUM('paid', 'pending', 'cancelled') DEFAULT 'paid' COMMENT '支付状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_bill_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bill_type_id` FOREIGN KEY (`type_id`) REFERENCES `bill_types` (`id`),
  CONSTRAINT `fk_bill_payment_method_id` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB COMMENT='账单表';

-- ----------------------------
-- 5. 待支付记录表（自动生成 due_date）
-- ----------------------------
CREATE TABLE IF NOT EXISTS `pending_payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bill_id` INT NOT NULL COMMENT '关联的账单ID',
  `due_date` DATE DEFAULT (DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)) COMMENT '截止日期',
  `reminder` BOOLEAN DEFAULT FALSE COMMENT '是否提醒',
  `reminder_date` DATETIME DEFAULT NULL COMMENT '提醒时间',
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bill_id` (`bill_id`),
  KEY `idx_due_date` (`due_date`),
  CONSTRAINT `fk_pending_bill_id` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='待支付记录表';

-- ----------------------------
-- 6. 删除原统计表，改为视图
-- ----------------------------

-- 月度统计视图
CREATE OR REPLACE VIEW v_monthly_statistics AS
SELECT
  b.user_id,
  YEAR(b.date) AS year,
  MONTH(b.date) AS month,
  SUM(IF(bt.is_income, b.amount, 0)) AS income_amount,
  SUM(IF(NOT bt.is_income AND b.status = 'paid', b.amount, 0)) AS expense_amount,
  SUM(IF(b.status = 'pending', b.amount, 0)) AS pending_amount,
  COUNT(IF(b.status = 'pending', 1, NULL)) AS pending_count
FROM bills b
JOIN bill_types bt ON b.type_id = bt.id
GROUP BY b.user_id, YEAR(b.date), MONTH(b.date);

-- 分类统计视图
CREATE OR REPLACE VIEW v_category_statistics AS
SELECT
  b.user_id,
  b.type_id,
  YEAR(b.date) AS year,
  MONTH(b.date) AS month,
  SUM(IF(b.status = 'paid', b.amount, 0)) AS amount,
  COUNT(IF(b.status = 'paid', 1, NULL)) AS count,
  SUM(IF(b.status = 'pending', b.amount, 0)) AS pending_amount,
  COUNT(IF(b.status = 'pending', 1, NULL)) AS pending_count
FROM bills b
JOIN bill_types bt ON b.type_id = bt.id
WHERE NOT bt.is_income -- 仅统计支出
GROUP BY b.user_id, b.type_id, YEAR(b.date), MONTH(b.date);

-- ----------------------------
-- 7. 触发器优化
-- ----------------------------
DELIMITER //

-- 插入账单时处理待支付记录
CREATE TRIGGER after_bill_insert AFTER INSERT ON bills
FOR EACH ROW
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO pending_payments (bill_id, due_date)
    VALUES (NEW.id, DATE_ADD(NEW.date, INTERVAL 7 DAY));
  END IF;
END //

-- 更新账单时处理数据和待支付记录
CREATE TRIGGER after_bill_update AFTER UPDATE ON bills
FOR EACH ROW
BEGIN
  -- 当关键字段变化时处理待支付记录
  IF OLD.status != NEW.status THEN
    IF NEW.status = 'pending' THEN
      INSERT INTO pending_payments (bill_id, due_date)
      VALUES (NEW.id, DATE_ADD(NEW.date, INTERVAL 7 DAY))
      ON DUPLICATE KEY UPDATE due_date = VALUES(due_date);
    ELSE
      DELETE FROM pending_payments WHERE bill_id = NEW.id;
    END IF;
  END IF;
END //

-- 删除账单时清理待支付记录
CREATE TRIGGER after_bill_delete AFTER DELETE ON bills
FOR EACH ROW
BEGIN
  DELETE FROM pending_payments WHERE bill_id = OLD.id;
END //

DELIMITER ;

-- 用户令牌表
CREATE TABLE IF NOT EXISTS `user_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `access_token` VARCHAR(255) NOT NULL COMMENT '访问令牌',
  `refresh_token` VARCHAR(255) DEFAULT NULL COMMENT '刷新令牌',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_access_token` (`access_token`),
  CONSTRAINT `fk_token_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='用户令牌表';