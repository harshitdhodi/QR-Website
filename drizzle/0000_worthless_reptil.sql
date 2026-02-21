CREATE TABLE `Address` (
	`id` varchar(36) NOT NULL,
	`street` varchar(191) NOT NULL,
	`city` varchar(191) NOT NULL,
	`state` varchar(191) NOT NULL,
	`pincode` varchar(191) NOT NULL,
	`country` varchar(191) DEFAULT 'India',
	`phone` varchar(191) NOT NULL,
	`customer_id` varchar(191) NOT NULL,
	CONSTRAINT `Address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Customer` (
	`id` varchar(191) NOT NULL,
	`phone` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`otp` varchar(6),
	`otp_expires` timestamp,
	`is_phone_verified` boolean DEFAULT false,
	`role` varchar(191) DEFAULT 'user',
	`photo` varchar(191),
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Customer_id` PRIMARY KEY(`id`),
	CONSTRAINT `Customer_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `Customer_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `OrderItem` (
	`id` varchar(36) NOT NULL,
	`orderId` varchar(36) NOT NULL,
	`name` varchar(191) NOT NULL,
	`sku` varchar(191) NOT NULL,
	`quantity` int NOT NULL,
	`price` double NOT NULL,
	CONSTRAINT `OrderItem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` varchar(36) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`amount` double NOT NULL,
	`status` varchar(191) DEFAULT 'PENDING',
	`paymentMethod` varchar(191) DEFAULT 'PREPAID',
	`shiprocketOrderId` int,
	`shipmentId` int,
	`awbCode` varchar(191),
	`customer_id` varchar(191) NOT NULL,
	CONSTRAINT `Order_id` PRIMARY KEY(`id`)
);
