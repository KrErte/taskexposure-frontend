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
import { Task } from '../../shared/models/task.model';
import { RISK_BREAKDOWN_COPY } from '../../shared/content/copy';
import { RadarChartComponent, RadarDataPoint } from '../../shared/components/radar-chart/radar-chart.component';
import { ScoreBarComponent } from '../../shared/components/score-bar/score-bar.component';

@Component({
  selector: 'app-risk-breakdown',
  standalone: true,
  imports: [CommonModule, RadarChartComponent, ScoreBarComponent],
  templateUrl: './risk-breakdown.component.html',
  styleUrl: './risk-breakdown.component.scss',
})
export class RiskBreakdownComponent {
  @Input() tasks: Task[] = [];
  @Output() continue = new EventEmitter<void>();

  readonly copy = RISK_BREAKDOWN_COPY;
  expandedTaskIndex: number | null = null;

  get radarData(): RadarDataPoint[] {
    // Create capability categories based on task analysis
    return [
      { label: 'Routine', value: this.getRoutineExposure() },
      { label: 'Analysis', value: this.getAnalysisExposure() },
      { label: 'Creative', value: this.getCreativeExposure() },
      { label: 'Social', value: this.getSocialExposure() },
      { label: 'Physical', value: this.getPhysicalExposure() },
    ];
  }

  get exposureSummary(): { high: number; medium: number; low: number } {
    return {
      high: this.tasks.filter((t) => t.exposure === 'high').length,
      medium: this.tasks.filter((t) => t.exposure === 'medium').length,
      low: this.tasks.filter((t) => t.exposure === 'low').length,
    };
  }

  private getRoutineExposure(): number {
    const highCount = this.tasks.filter((t) => t.exposure === 'high').length;
    return Math.min(100, (highCount / Math.max(this.tasks.length, 1)) * 150);
  }

  private getAnalysisExposure(): number {
    const mediumCount = this.tasks.filter((t) => t.exposure === 'medium').length;
    return Math.min(100, 40 + (mediumCount / Math.max(this.tasks.length, 1)) * 80);
  }

  private getCreativeExposure(): number {
    const lowCount = this.tasks.filter((t) => t.exposure === 'low').length;
    return Math.max(10, 30 - (lowCount / Math.max(this.tasks.length, 1)) * 40);
  }

  private getSocialExposure(): number {
    return Math.max(15, Math.random() * 35 + 15);
  }

  private getPhysicalExposure(): number {
    return Math.max(10, Math.random() * 25 + 10);
  }

  getExposureClass(exposure: Task['exposure']): string {
    return `risk-breakdown__task--${exposure}`;
  }

  getExposureLabelClass(exposure: Task['exposure']): string {
    return `risk-breakdown__exposure-label--${exposure}`;
  }

  getExposureLabel(exposure: 'high' | 'medium' | 'low'): string {
    return this.copy.exposureLabels[exposure];
  }

  getExposurePercentage(exposure: 'high' | 'medium' | 'low'): number {
    if (exposure === 'high') return 85;
    if (exposure === 'medium') return 55;
    return 25;
  }

  toggleTaskExpanded(index: number): void {
    this.expandedTaskIndex = this.expandedTaskIndex === index ? null : index;
  }

  onContinue(): void {
    this.continue.emit();
  }
}
