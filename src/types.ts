/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  category: '系统通知' | '缴费提醒' | '分摊通知' | '缴费成功';
  title: string;
  content: string;
  time: string;
  date: string;
  unread: boolean;
}

export interface BillItem {
  id: string;
  category: '电费' | '水费' | '网费' | '校园卡' | '空调' | '洗衣';
  title: string;
  amount: number;
  time: string;
  status: '已缴费' | '分摊中' | '待分摊';
  month: string;
  payer?: string;
  roommatesInvolved?: string[];
  orderNo?: string;
  paymentMethod?: string;
  afterBalance?: number;
  invoiceType?: string;
}

export interface Roommate {
  id: string;
  name: string;
  pinyin: string;
  avatar: string;
  selected: boolean;
}

export interface FleaItem {
  id: string;
  title: string;
  price: number;
  description: string;
  seller: string;
  time: string;
  contact: string;
  image?: string;
  purchased?: boolean;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  location: string;
  time: string;
  contact: string;
  status: 'processing' | 'claimed';
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  registeredCount: number;
  registered: boolean;
  tag: string;
}

export interface RepairRecord {
  id: string;
  category: '电路故障' | '水管漏水' | '家具损坏' | '网络故障' | '其他';
  description: string;
  location: string;
  time: string;
  status: 'pending' | 'processing' | 'completed';
  contact: string;
  image?: string;
}

// 分摊账单中每个室友的缴费状态
export type RoommatePaymentStatus = Record<string, 'paid' | 'pending'>;

export interface PowerGuaranteeRecord {
  id: string;
  title: string;
  timeSlot: string;
  date: string;
  status: '已批准' | '已拒绝' | '审批中';
}
