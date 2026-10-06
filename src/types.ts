export interface PublicApi {
  id: string;
  name: string;
  link: string;
  description: string;
  auth: string;
  https: boolean;
  cors: string;
  category: string;
}

export type ViewTab = 'directory' | 'sandbox' | 'mashup' | 'saved';

export type DisplayMode = 'grid' | 'table';

export type SortOption = 'name-asc' | 'name-desc' | 'category' | 'auth';

export interface FilterState {
  search: string;
  category: string;
  auth: string;
  httpsOnly: boolean;
  cors: string;
  sortBy: SortOption;
  onlySaved: boolean;
}

export interface PresetEndpoint {
  id: string;
  name: string;
  category: string;
  url: string;
  method: 'GET' | 'POST';
  description: string;
  requiresKey?: boolean;
}
