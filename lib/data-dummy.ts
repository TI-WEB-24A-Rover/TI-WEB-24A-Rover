export const farmers = [
  {
    id: '1',
    product: 'Padi Ciherang',
    name: 'Budi Santoso',
    location: 'Lampung Tengah',
    status: 'Ready 0.4 Ton',
    statusType: 'success', // Hijau
    desc: 'Padi Ciherang dari lahan sawah irigasi teknis dikelola dengan pola tanam terpadu...',
    image: '/gambar1.jpg',
  },
  {
    id: '2',
    product: 'Cabai Merah Keriting',
    name: 'Siti Nurjanah',
    location: 'Lampung Selatan',
    status: 'Stok Menipis',
    statusType: 'warning', // Oranye
    desc: 'Cabai merah keriting dibudidayakan di lahan dataran rendah dengan manajemen hama...',
    image: '/tomat.jpg',
  },
  {
    id: '3',
    product: 'Jagung Hibrida',
    name: 'Riyan Pratama',
    location: 'Lampung Timur',
    status: 'Stok Menipis',
    statusType: 'warning',
    desc: 'Jagung hibrida dipanen pada umur optimal untuk menjaga kadar air dan bobot biji...',
    image: '/gamba6.jpg',
  },
];
export interface Farmer {
  id: string;
  product: string;
  name: string;
  location: string;
  status: string;
  statusType: 'success' | 'warning'; // Hanya boleh dua nilai ini
  desc: string;
  image: string;
}