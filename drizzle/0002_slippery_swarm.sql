CREATE TABLE `membershipValidations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`membershipId` int NOT NULL,
	`membershipCode` varchar(50) NOT NULL,
	`validatedAt` timestamp NOT NULL DEFAULT (now()),
	`validatedBy` varchar(255),
	`ipAddress` varchar(45),
	`userAgent` text,
	CONSTRAINT `membershipValidations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `memberships` MODIFY COLUMN `status` enum('pending','approved','rejected','active','inactive') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `memberships` ADD `professionalRegistration` varchar(100);--> statement-breakpoint
ALTER TABLE `memberships` ADD `membershipCode` varchar(50);--> statement-breakpoint
ALTER TABLE `memberships` ADD `qrCodeUrl` text;--> statement-breakpoint
ALTER TABLE `memberships` ADD `approvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `memberships` ADD `expiresAt` timestamp;--> statement-breakpoint
ALTER TABLE `memberships` ADD `photoUrl` text;--> statement-breakpoint
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_membershipCode_unique` UNIQUE(`membershipCode`);--> statement-breakpoint
ALTER TABLE `membershipValidations` ADD CONSTRAINT `membershipValidations_membershipId_memberships_id_fk` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`id`) ON DELETE no action ON UPDATE no action;