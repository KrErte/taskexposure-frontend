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

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RISK_SCORE_COPY,
  getExposureBand,
  getScoreMeaning,
} from '../../shared/content/copy';
import { AnimatedGaugeComponent } from '../../shared/components/animated-gauge/animated-gauge.component';
import { UpgradeCtaComponent } from '../../shared/components/upgrade-cta/upgrade-cta.component';
import { PremiumService } from '../../core/services/premium.service';

@Component({
  selector: 'app-risk-score',
  standalone: true,
  imports: [CommonModule, AnimatedGaugeComponent, UpgradeCtaComponent],
  templateUrl: './risk-score.component.html',
  styleUrl: './risk-score.component.scss',
})
export class RiskScoreComponent {
  readonly premium = inject(PremiumService);

  @Input() score: number = 0;
  @Output() continue = new EventEmitter<void>();
  @Output() upgrade = new EventEmitter<void>();

  readonly copy = RISK_SCORE_COPY;
  showContext: boolean = false;

  get scoreColorClass(): string {
    const band = getExposureBand(this.score);
    if (band === 'low') return 'risk-score__percentage--low';
    if (band === 'moderate') return 'risk-score__percentage--medium';
    return 'risk-score__percentage--high';
  }

  get bandColorClass(): string {
    const band = getExposureBand(this.score);
    return `risk-score__band--${band}`;
  }

  get scoreMeaning(): { label: string; meaning: string; action: string } {
    return getScoreMeaning(this.score);
  }

  onAnimationComplete(): void {
    this.showContext = true;
  }

  onContinue(): void {
    this.continue.emit();
  }

  onUpgrade(): void {
    this.upgrade.emit();
  }
}
