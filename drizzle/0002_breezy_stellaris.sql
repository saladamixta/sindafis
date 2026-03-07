-- Adiciona passwordHash se não existir (idempotente)
SET @exist_passwordHash := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME = 'passwordHash'
);
SET @sql_passwordHash := IF(@exist_passwordHash = 0,
  'ALTER TABLE `users` ADD `passwordHash` varchar(255)',
  'SELECT 1'
);
PREPARE stmt1 FROM @sql_passwordHash;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;
--> statement-breakpoint
-- Adiciona isActive se não existir (idempotente)
SET @exist_isActive := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME = 'isActive'
);
SET @sql_isActive := IF(@exist_isActive = 0,
  'ALTER TABLE `users` ADD `isActive` int NOT NULL DEFAULT 1',
  'SELECT 1'
);
PREPARE stmt2 FROM @sql_isActive;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;
