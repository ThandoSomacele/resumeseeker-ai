// API Types
export interface User {
	id: string;
	email: string;
	full_name?: string;
	is_active: boolean;
	created_at: string;
}

export interface AuthResponse {
	access_token: string;
	token_type: string;
	user: User;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	full_name: string;
}

export interface Resume {
	id: string;
	user_id: string;
	original_filename: string;
	file_path: string;
	parsed_data: ParsedResumeData;
	embedding?: number[];
	created_at: string;
	updated_at: string;
}

export interface ParsedResumeData {
	contact?: ContactInfo;
	skills: string[];
	experience: WorkExperience[];
	education: Education[];
	summary?: string;
}

export interface ContactInfo {
	email?: string;
	phone?: string;
	location?: string;
	linkedin?: string;
	github?: string;
}

export interface WorkExperience {
	company: string;
	position: string;
	start_date?: string;
	end_date?: string;
	description?: string;
}

export interface Education {
	institution: string;
	degree: string;
	field?: string;
	start_date?: string;
	end_date?: string;
}

export interface Job {
	id: string;
	title: string;
	company: string;
	location?: string;
	remote_type?: 'remote' | 'hybrid' | 'onsite';
	employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship';
	salary_min?: number;
	salary_max?: number;
	salary_currency?: string;
	description: string;
	requirements?: string;
	url?: string;
	source: string;
	posted_date?: string;
	expires_at?: string;
	is_active: boolean;
	created_at: string;
}

export interface JobMatch {
	job: Job;
	match_score: number;
	semantic_score: number;
	skill_score: number;
	location_score: number;
	match_reasons: string[];
}

export interface UserStats {
	total_resumes: number;
	total_matches: number;
	saved_jobs: number;
	applied_jobs: number;
}

export interface UserInteraction {
	job_id: string;
	interaction_type: 'view' | 'like' | 'dislike' | 'save' | 'apply' | 'dismiss';
	created_at: string;
}

// UI State Types
export interface ToastMessage {
	id: string;
	type: 'success' | 'error' | 'info' | 'warning';
	message: string;
	duration?: number;
}

export interface LoadingState {
	[key: string]: boolean;
}

// API Error
export interface ApiError {
	detail: string;
	status?: number;
}
