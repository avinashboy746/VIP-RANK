import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt: Timestamp;
}

export interface ServerInstance {
  id: string;
  ownerUid: string;
  name: string;
  plan: string;
  status: 'running' | 'stopped' | 'provisioning';
  ip?: string;
  domain?: string;
  createdAt: Timestamp;
}

export interface HostingPlan {
  id: string;
  name: string;
  ram: string;
  cpu: string;
  price: number;
}
