// Tambahkan ini di atas (atau di file lib/definitions.ts)
export interface Farmer {
  id: string;
  product: string;
  name: string;
  location: string;
  status: string;
  statusType: 'success' | 'warning';
  desc: string;
  image: string;
}