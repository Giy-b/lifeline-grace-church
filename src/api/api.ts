import { API_BASE_URL } from "../config/api";
const BASE_URL = API_BASE_URL;

type LeaderPayload = {
  full_name: string;
  phone: string;
  password: string;
  role: string;
  department: string;
  branch: string;
};

type DepartmentPayload = {
  department_name: string;
  description: string;
};

// =========================
// LEADERS
// =========================
export const getLeaders = async () => {
  const res = await fetch(`${BASE_URL}/leaders`);
  return res.json();
};

export const createLeader = async (leader: LeaderPayload) => {
  const res = await fetch(`${BASE_URL}/leaders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leader),
  });

  return res.json();
};

// =========================
// DEPARTMENTS
// =========================
export const getDepartments = async () => {
  const res = await fetch(`${BASE_URL}/departments`);
  return res.json();
};

export const createDepartment = async (dept: DepartmentPayload) => {
  const res = await fetch(`${BASE_URL}/departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dept),
  });

  return res.json();
};
