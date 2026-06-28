export type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  note: string | null;
  status: "new" | "read" | "archived";
};

export type QrCode = {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  destination_url: string;
  is_active: boolean;
};

export type QrScan = {
  id: string;
  created_at: string;
  qr_code_id: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
};
