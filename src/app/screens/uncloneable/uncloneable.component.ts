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

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UncloneableService } from '../../core/services/uncloneable.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { HumanSignatureComponent } from './human-signature.component';
import {
  UncloneableProfile,
  DimensionScore,
  UncloneableTrait,
  LifeMoment,
  UncloneableInsight,
  HUMAN_DIMENSIONS,
  UNCLONEABLE_TIERS,
  getTierFromScore,
  HumanDimension,
} from '../../shared/models/uncloneable.model';

@Component({
  selector: 'app-uncloneable',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, HumanSignatureComponent],
  templateUrl: './uncloneable.component.html',
  styleUrl: './uncloneable.component.scss',
})
export class UncloneableComponent implements OnInit {
  private readonly service = inject(UncloneableService);

  profile = signal<UncloneableProfile | null>(null);
  loading = signal(true);
  activeTab = signal<'overview' | 'dimensions' | 'moments' | 'growth'>('overview');
  showMomentModal = signal(false);

  // Moment form
  newMoment = {
    title: '',
    description: '',
    dimension: 'judgment' as HumanDimension,
    type: 'decision' as 'decision' | 'relationship' | 'creation' | 'challenge' | 'growth',
  };

  readonly dimensions = HUMAN_DIMENSIONS;
  readonly tiers = UNCLONEABLE_TIERS;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.service.loadProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getTier(score: number) {
    return this.tiers[getTierFromScore(score)];
  }

  setTab(tab: 'overview' | 'dimensions' | 'moments' | 'growth'): void {
    this.activeTab.set(tab);
  }

  getScoreDelta(): number {
    const p = this.profile();
    if (!p) return 0;
    return p.overallScore - p.previousScore;
  }

  getDimensionColor(dimension: HumanDimension): string {
    return HUMAN_DIMENSIONS[dimension].color;
  }

  getDimensionInfo(dim: string): { label: string; icon: string } {
    return HUMAN_DIMENSIONS[dim as HumanDimension];
  }

  getInsightIcon(type: string): string {
    switch (type) {
      case 'strength': return '💪';
      case 'vulnerability': return '⚠️';
      case 'opportunity': return '🚀';
      case 'milestone': return '🎉';
      default: return '💡';
    }
  }

  getRarityClass(rarity: string): string {
    return `trait-card--${rarity}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  openMomentModal(): void {
    this.showMomentModal.set(true);
  }

  closeMomentModal(): void {
    this.showMomentModal.set(false);
    this.newMoment = {
      title: '',
      description: '',
      dimension: 'judgment',
      type: 'decision',
    };
  }

  saveMoment(): void {
    if (!this.newMoment.title.trim()) return;

    this.service.logMoment(this.newMoment).subscribe({
      next: () => {
        this.closeMomentModal();
        this.loadProfile();
      },
    });
  }

  completeChallenge(): void {
    const p = this.profile();
    if (!p) return;

    this.service.completeChallenge(p.weeklyChallenge.id).subscribe({
      next: () => {
        this.loadProfile();
      },
    });
  }
}
