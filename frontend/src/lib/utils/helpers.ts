// Format date helpers
export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
}

// Currency formatting
export function formatSalary(
	min?: number,
	max?: number,
	currency: string = 'USD'
): string {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	if (min && max) {
		return `${formatter.format(min)} - ${formatter.format(max)}`;
	} else if (min) {
		return `From ${formatter.format(min)}`;
	} else if (max) {
		return `Up to ${formatter.format(max)}`;
	}
	return 'Salary not specified';
}

// String utilities
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

export function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

// Validation
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
	// At least 8 characters
	return password.length >= 8;
}

// File utilities
export function isValidResumeFile(file: File): boolean {
	const validTypes = ['application/pdf', 'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
	const maxSize = 10 * 1024 * 1024; // 10MB

	return validTypes.includes(file.type) && file.size <= maxSize;
}

export function getFileExtension(filename: string): string {
	return filename.slice(filename.lastIndexOf('.'));
}

// ID generation
export function generateId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Match score to percentage and color
export function getMatchScoreColor(score: number): string {
	if (score >= 0.8) return 'text-green-600';
	if (score >= 0.6) return 'text-blue-600';
	if (score >= 0.4) return 'text-yellow-600';
	return 'text-gray-600';
}

export function formatMatchScore(score: number): string {
	return `${Math.round(score * 100)}%`;
}
