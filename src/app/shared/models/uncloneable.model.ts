/*
 * Copyright 2025 TASKEXPOSURE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * UNCLONEABLE - Your Human Signature Dashboard
 *
 * "In a world of AI copies, prove you're the original"
 *
 * Addresses 2025's deepest fear: becoming replaceable/irrelevant
 * in the age of AI. Maps what makes each person uniquely human
 * and provides a path to strengthen their irreplaceable value.
 */

// The 6 dimensions of human irreplaceability
export type HumanDimension =
  | 'judgment'      // Decisions in ambiguity
  | 'trust'         // Relationships & credibility
  | 'creativity'    // Novel connections & ideas
  | 'empathy'       // Emotional intelligence
  | 'accountability' // Taking real responsibility
  | 'presence';     // Physical & emotional presence

export interface DimensionScore {
  dimension: HumanDimension;
  score: number; // 0-100
  trend: 'rising' | 'stable' | 'declining';
  percentile: number; // vs. other users
  keyStrength: string;
  growthOpportunity: string;
}

export interface HumanSignaturePoint {
  x: number;
  y: number;
  intensity: number; // 0-1, for glow effect
  dimension: HumanDimension;
}

export interface HumanSignature {
  // Unique visual fingerprint data
  points: HumanSignaturePoint[];
  dominantColor: string;
  secondaryColor: string;
  complexity: number; // 0-100, how unique the pattern is
  symmetry: number; // 0-100
  entropy: number; // 0-100, randomness/uniqueness
}

export interface UncloneableTrait {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  aiReplicability: number; // 0-100, how easy for AI to copy (lower = more uncloneable)
  strengthenedBy: string[];
}

export interface LifeMoment {
  id: string;
  date: string;
  title: string;
  description: string;
  dimension: HumanDimension;
  impactScore: number; // How much it contributed to being uncloneable
  type: 'decision' | 'relationship' | 'creation' | 'challenge' | 'growth';
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  dimension: HumanDimension;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
  expiresAt: string;
  completed: boolean;
  completedAt?: string;
}

export interface UncloneableInsight {
  id: string;
  type: 'strength' | 'vulnerability' | 'opportunity' | 'milestone';
  title: string;
  description: string;
  icon: string;
  actionable: boolean;
  action?: string;
}

export interface GrowthPath {
  id: string;
  name: string;
  description: string;
  targetDimension: HumanDimension;
  steps: {
    id: string;
    title: string;
    completed: boolean;
    unlocksAt?: number; // score threshold
  }[];
  progress: number; // 0-100
  estimatedImpact: number; // How much it could raise overall score
}

export interface UncloneableProfile {
  // Core scores
  overallScore: number; // 0-100, "Uncloneable Score"
  previousScore: number; // For trend
  scoreTrend: 'rising' | 'stable' | 'declining';
  percentileRank: number; // Top X%

  // Dimension breakdown
  dimensions: DimensionScore[];

  // Visual signature
  signature: HumanSignature;

  // Traits & moments
  topTraits: UncloneableTrait[];
  recentMoments: LifeMoment[];

  // Growth
  weeklyChallenge: WeeklyChallenge;
  activePath: GrowthPath;
  insights: UncloneableInsight[];

  // Streaks & engagement
  streakDays: number;
  totalMomentsLogged: number;
  challengesCompleted: number;

  // AI comparison (the fear factor)
  aiComparisonMetrics: {
    tasksOnlyYouCanDo: number;
    uniqueDecisionsMade: number;
    relationshipsAiCantReplace: number;
    creativeSolutionsGenerated: number;
  };
}

// Tier configuration
export type UncloneableTier = 'vulnerable' | 'developing' | 'established' | 'remarkable' | 'legendary';

export const UNCLONEABLE_TIERS: Record<UncloneableTier, {
  minScore: number;
  maxScore: number;
  label: string;
  color: string;
  glowColor: string;
  description: string;
  icon: string;
}> = {
  vulnerable: {
    minScore: 0,
    maxScore: 25,
    label: 'Vulnerable',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    description: 'Your human edge needs urgent attention',
    icon: '⚠️'
  },
  developing: {
    minScore: 25,
    maxScore: 50,
    label: 'Developing',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Building your irreplaceable foundation',
    icon: '🌱'
  },
  established: {
    minScore: 50,
    maxScore: 70,
    label: 'Established',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Solid human advantages in place',
    icon: '✓'
  },
  remarkable: {
    minScore: 70,
    maxScore: 90,
    label: 'Remarkable',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    description: 'Distinctly irreplaceable',
    icon: '⭐'
  },
  legendary: {
    minScore: 90,
    maxScore: 100,
    label: 'Legendary',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    description: 'Truly one of a kind',
    icon: '👑'
  }
};

export const HUMAN_DIMENSIONS: Record<HumanDimension, {
  label: string;
  icon: string;
  description: string;
  aiWeakness: string;
  color: string;
}> = {
  judgment: {
    label: 'Judgment',
    icon: '⚖️',
    description: 'Making decisions when there\'s no clear right answer',
    aiWeakness: 'AI needs defined parameters; you navigate ambiguity',
    color: '#60a5fa'
  },
  trust: {
    label: 'Trust',
    icon: '🤝',
    description: 'Building relationships that depend on you personally',
    aiWeakness: 'AI can simulate rapport; you create real bonds',
    color: '#34d399'
  },
  creativity: {
    label: 'Creativity',
    icon: '💡',
    description: 'Connecting ideas in ways never done before',
    aiWeakness: 'AI remixes existing patterns; you create new ones',
    color: '#fbbf24'
  },
  empathy: {
    label: 'Empathy',
    icon: '💜',
    description: 'Understanding emotions beyond what\'s expressed',
    aiWeakness: 'AI reads signals; you feel what others feel',
    color: '#a78bfa'
  },
  accountability: {
    label: 'Accountability',
    icon: '🎯',
    description: 'Taking responsibility when things go wrong',
    aiWeakness: 'AI deflects blame; you own outcomes',
    color: '#f472b6'
  },
  presence: {
    label: 'Presence',
    icon: '👤',
    description: 'Being there in ways that matter',
    aiWeakness: 'AI is available; you are present',
    color: '#fb923c'
  }
};

export function getTierFromScore(score: number): UncloneableTier {
  if (score >= 90) return 'legendary';
  if (score >= 70) return 'remarkable';
  if (score >= 50) return 'established';
  if (score >= 25) return 'developing';
  return 'vulnerable';
}
