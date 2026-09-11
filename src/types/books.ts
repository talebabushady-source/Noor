export interface Book {
  id: string;
  name: string;
  riwayah: string;
  description: string;
  cover_key: string;
  folder: string; // معرّف المصحف المستخدم في بناء روابط الصور (مثال: hafs)
  page_count: number;
  sort_order: number;
  is_active: boolean;
}

 export interface BooksResponse {
  items: Book[];
}