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

import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import {
  UncloneableProfile,
  HumanSignature,
  HumanSignaturePoint,
  DimensionScore,
  UncloneableTrait,
  LifeMoment,
  WeeklyChallenge,
  GrowthPath,
  UncloneableInsight,
  HumanDimension,
  HUMAN_DIMENSIONS,
} from '../../shared/models/uncloneable.model';

@Injectable({
  providedIn: 'root',
})
export class UncloneableService {
  private profileSubject = new BehaviorSubject<UncloneableProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  /**
   * Load the user's Uncloneable profile
   */
  loadProfile(): Observable<UncloneableProfile> {
    const profile = this.generateMockProfile();
    return of(profile).pipe(delay(800));
  }

  /**
   * Log a new life moment
   */
  logMoment(moment: Partial<LifeMoment>): Observable<LifeMoment> {
    const newMoment: LifeMoment = {
      id: `moment-${Date.now()}`,
      date: new Date().toISOString(),
      title: moment.title || '',
      description: moment.description || '',
      dimension: moment.dimension || 'judgment',
      impactScore: Math.floor(Math.random() * 30) + 10,
      type: moment.type || 'decision',
    };
    return of(newMoment).pipe(delay(300));
  }

  /**
   * Complete a weekly challenge
   */
  completeChallenge(challengeId: string): Observable<{ success: boolean; pointsEarned: number }> {
    return of({ success: true, pointsEarned: 25 }).pipe(delay(500));
  }

  /**
   * Generate unique human signature visualization data
   */
  private generateSignature(): HumanSignature {
    const points: HumanSignaturePoint[] = [];
    const dimensions: HumanDimension[] = ['judgment', 'trust', 'creativity', 'empathy', 'accountability', 'presence'];

    // Create a unique fingerprint-like pattern
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const baseRadius = 0.3 + Math.sin(i * 0.5) * 0.15;
      const noise = Math.random() * 0.1;
      const radius = baseRadius + noise;

      points.push({
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        intensity: 0.5 + Math.random() * 0.5,
        dimension: dimensions[i % 6],
      });
    }

    // Add inner pattern
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + 0.1;
      const radius = 0.15 + Math.sin(i * 0.8) * 0.05;

      points.push({
        x: 0.5 + Math.cos(angle) * radius,
        y: 0.5 + Math.sin(angle) * radius,
        intensity: 0.7 + Math.random() * 0.3,
        dimension: dimensions[i % 6],
      });
    }

    return {
      points,
      dominantColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      complexity: 78,
      symmetry: 62,
      entropy: 84,
    };
  }

  private generateMockProfile(): UncloneableProfile {
    const dimensions: DimensionScore[] = [
      {
        dimension: 'judgment',
        score: 72,
        trend: 'rising',
        percentile: 78,
        keyStrength: 'You made 3 decisions this month that required weighing incomplete information',
        growthOpportunity: 'Seek more situations with unclear outcomes',
      },
      {
        dimension: 'trust',
        score: 85,
        trend: 'stable',
        percentile: 91,
        keyStrength: 'Your network relies on your word—7 people cited you as their go-to advisor',
        growthOpportunity: 'Extend trust to new relationships',
      },
      {
        dimension: 'creativity',
        score: 58,
        trend: 'rising',
        percentile: 62,
        keyStrength: 'You connected two unrelated domains in your last project',
        growthOpportunity: 'Expose yourself to fields outside your expertise',
      },
      {
        dimension: 'empathy',
        score: 79,
        trend: 'stable',
        percentile: 84,
        keyStrength: 'You noticed what wasn\'t said in a critical conversation',
        growthOpportunity: 'Practice empathy with those you disagree with',
      },
      {
        dimension: 'accountability',
        score: 88,
        trend: 'rising',
        percentile: 93,
        keyStrength: 'You owned a failure publicly when it would have been easy to deflect',
        growthOpportunity: 'Take on responsibilities with visible consequences',
      },
      {
        dimension: 'presence',
        score: 65,
        trend: 'declining',
        percentile: 55,
        keyStrength: 'Your physical presence at the team offsite changed the dynamic',
        growthOpportunity: 'Reduce screen time in high-stakes moments',
      },
    ];

    const topTraits: UncloneableTrait[] = [
      {
        id: 'trait-1',
        name: 'Crisis Compass',
        description: 'You stay calm when others panic and make clear decisions under pressure',
        icon: '🧭',
        rarity: 'rare',
        aiReplicability: 15,
        strengthenedBy: ['High-stakes negotiations', 'Emergency response', 'Conflict mediation'],
      },
      {
        id: 'trait-2',
        name: 'Bridge Builder',
        description: 'You connect people who would never meet otherwise',
        icon: '🌉',
        rarity: 'uncommon',
        aiReplicability: 22,
        strengthenedBy: ['Cross-functional projects', 'Community involvement', 'Mentoring'],
      },
      {
        id: 'trait-3',
        name: 'Truth Teller',
        description: 'You say what needs to be said, even when it\'s uncomfortable',
        icon: '💎',
        rarity: 'rare',
        aiReplicability: 8,
        strengthenedBy: ['Honest feedback', 'Difficult conversations', 'Public disagreement'],
      },
      {
        id: 'trait-4',
        name: 'Pattern Breaker',
        description: 'You see solutions others miss by connecting unrelated ideas',
        icon: '⚡',
        rarity: 'legendary',
        aiReplicability: 12,
        strengthenedBy: ['Cross-domain learning', 'Unconventional approaches', 'First-principles thinking'],
      },
    ];

    const recentMoments: LifeMoment[] = [
      {
        id: 'moment-1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Took ownership of team\'s missed deadline',
        description: 'Instead of blaming circumstances, I explained to leadership what went wrong and my plan to prevent it.',
        dimension: 'accountability',
        impactScore: 35,
        type: 'decision',
      },
      {
        id: 'moment-2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Connected struggling colleague with mentor',
        description: 'Noticed someone was overwhelmed and introduced them to someone who had faced similar challenges.',
        dimension: 'empathy',
        impactScore: 28,
        type: 'relationship',
      },
      {
        id: 'moment-3',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Proposed unconventional solution',
        description: 'Combined an approach from gaming with our enterprise software problem. Team was skeptical but it worked.',
        dimension: 'creativity',
        impactScore: 42,
        type: 'creation',
      },
    ];

    const weeklyChallenge: WeeklyChallenge = {
      id: 'challenge-current',
      title: 'The Uncomfortable Truth',
      description: 'Share honest feedback with someone who needs to hear it, even if it\'s awkward. Document how they responded.',
      dimension: 'trust',
      difficulty: 'hard',
      rewardPoints: 50,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    };

    const activePath: GrowthPath = {
      id: 'path-presence',
      name: 'Presence Over Pixels',
      description: 'Strengthen your irreplaceable physical and emotional presence in a digital world',
      targetDimension: 'presence',
      steps: [
        { id: 'step-1', title: 'One device-free meeting per day', completed: true },
        { id: 'step-2', title: 'Host an in-person gathering', completed: true },
        { id: 'step-3', title: 'Practice active listening for a week', completed: false },
        { id: 'step-4', title: 'Lead a critical conversation face-to-face', completed: false, unlocksAt: 70 },
        { id: 'step-5', title: 'Become someone\'s go-to for support', completed: false, unlocksAt: 80 },
      ],
      progress: 40,
      estimatedImpact: 15,
    };

    const insights: UncloneableInsight[] = [
      {
        id: 'insight-1',
        type: 'strength',
        title: 'Your accountability is in the top 7%',
        description: 'When you take ownership, people remember. This is rare in 2025 when deflection is easy.',
        icon: '🏆',
        actionable: false,
      },
      {
        id: 'insight-2',
        type: 'vulnerability',
        title: 'Presence score declining',
        description: 'Your physical/emotional presence has dropped 8 points in 30 days. Screen time up?',
        icon: '📉',
        actionable: true,
        action: 'Try the "Presence Over Pixels" growth path',
      },
      {
        id: 'insight-3',
        type: 'opportunity',
        title: 'Creativity is rising fast',
        description: 'Your unconventional solutions are getting noticed. Double down on cross-domain learning.',
        icon: '🚀',
        actionable: true,
        action: 'Log a creative moment this week',
      },
      {
        id: 'insight-4',
        type: 'milestone',
        title: '12-day streak!',
        description: 'You\'ve logged human moments for 12 days straight. Your signature is getting stronger.',
        icon: '🔥',
        actionable: false,
      },
    ];

    return {
      overallScore: 74,
      previousScore: 71,
      scoreTrend: 'rising',
      percentileRank: 82,
      dimensions,
      signature: this.generateSignature(),
      topTraits,
      recentMoments,
      weeklyChallenge,
      activePath,
      insights,
      streakDays: 12,
      totalMomentsLogged: 47,
      challengesCompleted: 8,
      aiComparisonMetrics: {
        tasksOnlyYouCanDo: 23,
        uniqueDecisionsMade: 156,
        relationshipsAiCantReplace: 34,
        creativeSolutionsGenerated: 12,
      },
    };
  }
}
