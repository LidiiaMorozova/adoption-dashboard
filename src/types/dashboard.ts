// Mirrors server/src/dashboard/dashboard.types.ts.

export type Trend = 'up' | 'down' | 'flat';

export type IconName =
  | 'user'
  | 'question-mark-circle'
  | 'chat-bubble-left'
  | 'lifebuoy'
  | 'envelope'
  | 'document'
  | 'document-text'
  | 'exclamation-triangle'
  | 'heart'
  | 'shopping-bag'
  | 'calendar'
  | 'clipboard-document-check'
  | 'truck';

export interface CardBase {
  title: string;
  trend: Trend;
  caption: string;
  color: string;
  backgroundColor: string;
  icon: IconName;
}

export interface SmallCard extends CardBase {
  value: number;
  points: number[];
}

export interface BreakdownSegment {
  label: string;
  value: number;
  color: string;
}

export interface MiddleCard extends CardBase {
  value: number;
  points: BreakdownSegment[];
}

export interface UsageItem {
  label: string;
  value: number;
  icon: IconName;
}

export interface LargeCard extends CardBase {
  value: string;
  mostUsedValues: UsageItem[];
  lowestUsedValues: UsageItem[];
}

export interface DashboardData {
  smallCards: SmallCard[];
  middleCards: MiddleCard[];
  largeCards: LargeCard[];
}
