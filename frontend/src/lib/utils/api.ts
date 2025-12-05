import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	User,
	Resume,
	Job,
	JobMatch,
	UserStats,
	UserInteraction,
	ApiError
} from '$lib/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
	private baseUrl: string;
	private token: string | null = null;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		// Load token from localStorage if available
		if (typeof window !== 'undefined') {
			this.token = localStorage.getItem('auth_token');
		}
	}

	setToken(token: string | null) {
		this.token = token;
		if (typeof window !== 'undefined') {
			if (token) {
				localStorage.setItem('auth_token', token);
			} else {
				localStorage.removeItem('auth_token');
			}
		}
	}

	getToken(): string | null {
		return this.token;
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options.headers,
		};

		if (this.token) {
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			const error: ApiError = await response.json().catch(() => ({
				detail: 'An error occurred',
				status: response.status,
			}));
			throw error;
		}

		return response.json();
	}

	// Auth endpoints
	async register(data: RegisterRequest): Promise<AuthResponse> {
		return this.request<AuthResponse>('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		const response = await this.request<AuthResponse>('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		this.setToken(response.access_token);
		return response;
	}

	async getCurrentUser(): Promise<User> {
		return this.request<User>('/api/auth/me');
	}

	async logout() {
		this.setToken(null);
	}

	// User endpoints
	async getUserProfile(): Promise<User> {
		return this.request<User>('/api/users/profile');
	}

	async getUserStats(): Promise<UserStats> {
		return this.request<UserStats>('/api/users/stats');
	}

	// Resume endpoints
	async uploadResume(file: File): Promise<Resume> {
		const formData = new FormData();
		formData.append('file', file);

		const headers: HeadersInit = {};
		if (this.token) {
			headers['Authorization'] = `Bearer ${this.token}`;
		}

		const response = await fetch(`${this.baseUrl}/api/resumes/upload`, {
			method: 'POST',
			headers,
			body: formData,
		});

		if (!response.ok) {
			const error: ApiError = await response.json().catch(() => ({
				detail: 'Failed to upload resume',
				status: response.status,
			}));
			throw error;
		}

		return response.json();
	}

	async getResumes(): Promise<Resume[]> {
		return this.request<Resume[]>('/api/resumes/');
	}

	async getResume(id: string): Promise<Resume> {
		return this.request<Resume>(`/api/resumes/${id}`);
	}

	async updateResumeSkills(id: string, skills: string[]): Promise<Resume> {
		return this.request<Resume>(`/api/resumes/${id}/skills`, {
			method: 'PUT',
			body: JSON.stringify({ skills }),
		});
	}

	async deleteResume(id: string): Promise<void> {
		return this.request<void>(`/api/resumes/${id}`, {
			method: 'DELETE',
		});
	}

	// Job endpoints
	async getJobs(params?: {
		skip?: number;
		limit?: number;
		location?: string;
		remote_type?: string;
		employment_type?: string;
		min_salary?: number;
		sort_by?: string;
	}): Promise<JobMatch[]> {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, value.toString());
				}
			});
		}
		const queryString = queryParams.toString();
		const endpoint = queryString ? `/api/jobs/?${queryString}` : '/api/jobs/';
		return this.request<JobMatch[]>(endpoint);
	}

	async getJob(id: string): Promise<Job> {
		return this.request<Job>(`/api/jobs/${id}`);
	}

	async interactWithJob(
		id: string,
		interaction_type: UserInteraction['interaction_type']
	): Promise<void> {
		return this.request<void>(`/api/jobs/${id}/interact`, {
			method: 'POST',
			body: JSON.stringify({ interaction_type }),
		});
	}

	async getSavedJobs(): Promise<Job[]> {
		return this.request<Job[]>('/api/jobs/saved/list');
	}

	async getAppliedJobs(): Promise<Job[]> {
		return this.request<Job[]>('/api/jobs/applied/list');
	}
}

export const api = new ApiClient(API_BASE_URL);
