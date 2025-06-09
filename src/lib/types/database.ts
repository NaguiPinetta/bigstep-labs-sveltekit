export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			personas: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					tone: string | null;
					use_case: string | null;
					system_prompt: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					tone?: string | null;
					use_case?: string | null;
					system_prompt: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					tone?: string | null;
					use_case?: string | null;
					system_prompt?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			datasets: {
				Row: {
					id: string;
					user_id: string;
					slug: string;
					name: string;
					description: string | null;
					type: 'corpus' | 'glossary' | 'tmx';
					file_url: string | null;
					metadata: Json;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					slug: string;
					name: string;
					description?: string | null;
					type: 'corpus' | 'glossary' | 'tmx';
					file_url?: string | null;
					metadata?: Json;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					slug?: string;
					name?: string;
					description?: string | null;
					type?: 'corpus' | 'glossary' | 'tmx';
					file_url?: string | null;
					metadata?: Json;
					created_at?: string;
					updated_at?: string;
				};
			};
			agents: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					description: string | null;
					model_id: string;
					persona_id: string | null;
					datasets: Json;
					tools: Json;
					output_format: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name: string;
					description?: string | null;
					model_id: string;
					persona_id?: string | null;
					datasets?: Json;
					tools?: Json;
					output_format?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					description?: string | null;
					model_id?: string;
					persona_id?: string | null;
					datasets?: Json;
					tools?: Json;
					output_format?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			agent_dataset_link: {
				Row: {
					agent_id: string;
					dataset_id: string;
					created_at: string;
				};
				Insert: {
					agent_id: string;
					dataset_id: string;
					created_at?: string;
				};
				Update: {
					agent_id?: string;
					dataset_id?: string;
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
