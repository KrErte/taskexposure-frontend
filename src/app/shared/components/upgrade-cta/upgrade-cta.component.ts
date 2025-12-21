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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UpgradeFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-upgrade-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upgrade-cta.component.html',
  styleUrl: './upgrade-cta.component.scss',
})
export class UpgradeCtaComponent {
  @Input() variant: 'inline' | 'full' = 'inline';
  @Input() showFeatures = true;
  @Output() upgrade = new EventEmitter<void>();
  @Output() continueFree = new EventEmitter<void>();

  readonly price = '€9.99';

  readonly features: UpgradeFeature[] = [
    {
      icon: 'chart',
      title: 'Detailed Breakdown',
      description: 'Task-by-task analysis with AI capability radar',
    },
    {
      icon: 'map',
      title: 'Personal Roadmap',
      description: 'Actionable steps to reduce your exposure',
    },
    {
      icon: 'infinity',
      title: 'Unlimited Assessments',
      description: 'Track your progress over time',
    },
    {
      icon: 'download',
      title: 'PDF Report',
      description: 'Download and share your results',
    },
  ];

  readonly freeFeatures = [
    'Overall exposure score',
    'Basic AI capability match',
    '1 assessment per account',
  ];

  readonly premiumFeatures = [
    'Detailed task-by-task breakdown',
    'AI capability radar chart',
    'Personalized roadmap',
    'Unlimited assessments',
    'PDF export',
    'Progress tracking',
  ];

  onUpgrade(): void {
    this.upgrade.emit();
  }

  onContinueFree(): void {
    this.continueFree.emit();
  }
}
