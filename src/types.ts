export type Leader = {
  id: number;
  full_name: string;
  phone: string;
  password: string;
  role: string;
  department: string;
  branch: string;
};

export type LoggedInMember = {
  id: number;
  full_name: string;
  username: string;
  department: string;
  branch_id: number;
  cell_group: string;
};
