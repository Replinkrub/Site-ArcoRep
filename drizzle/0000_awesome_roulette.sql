CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`company` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`segment` text NOT NULL,
	`brand` text DEFAULT '' NOT NULL,
	`subject` text NOT NULL,
	`demand` text DEFAULT '' NOT NULL,
	`cnpj` text,
	`created_at` text NOT NULL,
	`request_hash` text NOT NULL,
	`ip_hash` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_created_id` ON `leads` (`created_at`,`id`);--> statement-breakpoint
CREATE INDEX `idx_leads_ip_created` ON `leads` (`ip_hash`,`created_at`);