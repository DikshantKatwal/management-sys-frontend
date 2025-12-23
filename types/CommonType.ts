export type TUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar?: string | File;
  email: string;
  full_name: string;
  user_type: string;
  phone: number;
};

export type TGuest = {
  created_at?: string;
  updated_at?: string;
  address?: string;
  dob?: string;
  nationality?: string;
  identification?: string;
  id_number?: string;
};
