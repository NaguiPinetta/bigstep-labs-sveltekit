import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Persona operations
export const getPersonas = async () => {
	const { data, error } = await supabase
		.from('personas')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
};

export const createPersona = async (
	persona: Database['public']['Tables']['personas']['Insert']
) => {
	const { data, error } = await supabase.from('personas').insert(persona).select().single();

	if (error) throw error;
	return data;
};

// Dataset operations
export const getDatasets = async () => {
	const { data, error } = await supabase
		.from('datasets')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
};

export const createDataset = async (
	dataset: Database['public']['Tables']['datasets']['Insert']
) => {
	const { data, error } = await supabase.from('datasets').insert(dataset).select().single();

	if (error) throw error;
	return data;
};

// Agent operations
export const getAgents = async () => {
	const { data, error } = await supabase
		.from('agents')
		.select(
			`
      *,
      personas (*),
      models (*)
    `
		)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
};

export const createAgent = async (agent: Database['public']['Tables']['agents']['Insert']) => {
	const { data, error } = await supabase.from('agents').insert(agent).select().single();

	if (error) throw error;
	return data;
};

// Agent-Dataset link operations
export const linkAgentToDataset = async (agentId: string, datasetId: string) => {
	const { data, error } = await supabase
		.from('agent_dataset_link')
		.insert({ agent_id: agentId, dataset_id: datasetId })
		.select()
		.single();

	if (error) throw error;
	return data;
};

export const unlinkAgentFromDataset = async (agentId: string, datasetId: string) => {
	const { error } = await supabase
		.from('agent_dataset_link')
		.delete()
		.match({ agent_id: agentId, dataset_id: datasetId });

	if (error) throw error;
};

// Get agent with all related data
export const getAgentWithDetails = async (agentId: string) => {
	const { data, error } = await supabase
		.from('agents')
		.select(
			`
      *,
      personas (*),
      models (*),
      agent_dataset_link (
        dataset_id,
        datasets (*)
      )
    `
		)
		.eq('id', agentId)
		.single();

	if (error) throw error;
	return data;
};
