export interface ExtractedReport {
  summary: {
    totalGoals: number;
    totalBMPs: number;
    completionRate: number;
  };
  goals: Goal[];
  bmps: BMP[];
  implementation: ImplementationActivity[];
  monitoring: MonitoringMetric[];
  outreach: OutreachActivity[];
  geographicAreas: GeographicArea[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
}

export interface BMP {
  id: string;
  name: string;
  description: string;
}

export interface ImplementationActivity {
  id: string;
  activity: string;
  responsibleParty?: string;
  timeline?: string;
}

export interface MonitoringMetric {
  id: string;
  metric: string;
  targetValue?: string;
}

export interface OutreachActivity {
  id: string;
  type: string;
  audience: string;
  description: string;
}

export interface GeographicArea {
  id: string;
  name: string;
  description?: string;
}
